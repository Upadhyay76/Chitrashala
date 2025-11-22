import { user } from "auth-schema";
import { desc, eq, and, inArray, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { post, postToTag, tag } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  // 🟢 Get all public posts with tags
  getPosts: protectedProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    // 1️⃣ Fetch all public posts
    const posts = await db
      .select({
        id: post.id,
        userId: post.userId,
        title: post.title,
        description: post.description,
        mediaUrl: post.mediaUrl,
        thumbnailUrl: post.thumbnailUrl,
        type: post.type,
        visibility: post.visibility,
        accessType: post.accessType,
        price: post.price,
        isDownloadable: post.isDownloadable,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          avatarImage: user.image,
        },
      })
      .from(post)
      .leftJoin(user, eq(post.userId, user.id))
      .where(eq(post.visibility, "public"))
      .orderBy(desc(post.createdAt));

    if (!posts.length) return { posts: [] };

    // 2️⃣ Fetch post-tag mappings
    const postTags = await db
      .select({
        postId: postToTag.postId,
        tagId: tag.id,
        tagName: tag.name,
      })
      .from(postToTag)
      .leftJoin(tag, eq(postToTag.tagId, tag.id))
      .where(inArray(postToTag.postId, posts.map((p) => p.id)));

    // 3️⃣ Map tags to posts
    const postsWithTags = posts.map((p) => ({
      ...p,
      tags: postTags
        .filter((t) => t.postId === p.id)
        .map((t) => t.tagName)
        .filter(Boolean) as string[],
    }));

    return { posts: postsWithTags };
  }),

  // 🟢 Get single post by ID with all fields and tags
  getPostById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      // 1️⃣ Fetch post details
      const [postDetail] = await db
        .select({
          id: post.id,
          userId: post.userId,
          title: post.title,
          description: post.description,
          mediaUrl: post.mediaUrl,
          thumbnailUrl: post.thumbnailUrl,
          type: post.type,
          visibility: post.visibility,
          accessType: post.accessType,
          price: post.price,
          isDownloadable: post.isDownloadable,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            avatarImage: user.image,
          },
        })
        .from(post)
        .leftJoin(user, eq(post.userId, user.id))
        .where(eq(post.id, input.id))
        .limit(1);

      if (!postDetail) throw new Error("Post not found");

      // 2️⃣ Fetch tags for this post
      const postTags = await db
        .select({
          tagId: tag.id,
          tagName: tag.name,
        })
        .from(postToTag)
        .leftJoin(tag, eq(postToTag.tagId, tag.id))
        .where(eq(postToTag.postId, input.id));

      // 3️⃣ Combine post with tags
      return {
        ...postDetail,
        tags: postTags.map((t) => t.tagName).filter(Boolean) as string[],
      };
    }),

  // 🟢 Get user's own posts with all fields
  getUserPosts: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const userId = session.user.id;

    // 1️⃣ Fetch user posts
    const posts = await db
      .select({
        id: post.id,
        userId: post.userId,
        title: post.title,
        description: post.description,
        mediaUrl: post.mediaUrl,
        thumbnailUrl: post.thumbnailUrl,
        type: post.type,
        visibility: post.visibility,
        accessType: post.accessType,
        price: post.price,
        isDownloadable: post.isDownloadable,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })
      .from(post)
      .where(eq(post.userId, userId))
      .orderBy(desc(post.createdAt));

    if (!posts.length) return { posts: [] };

    // 2️⃣ Fetch post-tag mappings
    const postTags = await db
      .select({
        postId: postToTag.postId,
        tagId: tag.id,
        tagName: tag.name,
      })
      .from(postToTag)
      .leftJoin(tag, eq(postToTag.tagId, tag.id))
      .where(inArray(postToTag.postId, posts.map((p) => p.id)));

    // 3️⃣ Map tags to posts
    const postsWithTags = posts.map((p) => ({
      ...p,
      tags: postTags
        .filter((t) => t.postId === p.id)
        .map((t) => t.tagName)
        .filter(Boolean) as string[],
    }));

    return { posts: postsWithTags };
  }),

  // 🟠 Edit a post (only by its owner, with tag updates)
  editPost: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        visibility: z.enum(["public", "private"]).default("public"),
        tags: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;
      const userId = session.user.id;

      // 1️⃣ Verify ownership
      const [existingPost] = await db
        .select()
        .from(post)
        .where(and(eq(post.id, input.id), eq(post.userId, userId)))
        .limit(1);

      if (!existingPost) throw new Error("Unauthorized or post not found");

      // 2️⃣ Start transaction (ensures atomic updates)
      await db.transaction(async (tx) => {
        // Update post details
        await tx
          .update(post)
          .set({
            title: input.title,
            description: input.description,
            visibility: input.visibility,
            updatedAt: new Date(),
          })
          .where(eq(post.id, input.id));

        // 3️⃣ Update tags if provided
        if (input.tags && input.tags.length > 0) {
          // Remove existing tag relations for this post
          await tx.delete(postToTag).where(eq(postToTag.postId, input.id));

          for (const tagName of input.tags) {
            const trimmed = tagName.trim();
            if (!trimmed) continue;

            // Check if tag already exists
            const [existingTag] = await tx
              .select()
              .from(tag)
              .where(eq(tag.name, trimmed))
              .limit(1);

            let tagId: string;
            if (existingTag) {
              tagId = existingTag.id;
            } else {
              // Create new tag if not found
              const [newTag] = await tx
                .insert(tag)
                .values({ id: crypto.randomUUID(), name: trimmed })
                .returning();
              if (!newTag?.id) throw new Error("Failed to insert tag");
              tagId = newTag.id;
            }

            // Link tag to post
            await tx.insert(postToTag).values({
              postId: input.id,
              tagId,
            });
          }
        } else {
          // If no tags sent, clear all
          await tx.delete(postToTag).where(eq(postToTag.postId, input.id));
        }
      });

      return { success: true };
    }),

  // 🔍 Search posts by title, description, or tags
  searchPosts: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1, "Search term required"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const search = `%${input.query}%`;

      // 1️⃣ Find tags that match query
      const matchedTags = await db
        .select({ id: tag.id })
        .from(tag)
        .where(ilike(tag.name, search));

      const tagIds = matchedTags.map((t) => t.id);

      // 2️⃣ Find post IDs that have matching tags
      const postsWithMatchingTags = tagIds.length > 0
        ? await db
          .select({ postId: postToTag.postId })
          .from(postToTag)
          .where(inArray(postToTag.tagId, tagIds))
        : [];

      const matchingPostIds = postsWithMatchingTags.map((p) => p.postId);

      // 3️⃣ Find posts that match title, description, or have matching tags
      const posts = await db
        .select({
          id: post.id,
          userId: post.userId,
          title: post.title,
          description: post.description,
          mediaUrl: post.mediaUrl,
          thumbnailUrl: post.thumbnailUrl,
          type: post.type,
          visibility: post.visibility,
          accessType: post.accessType,
          price: post.price,
          isDownloadable: post.isDownloadable,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
        })
        .from(post)
        .leftJoin(user, eq(post.userId, user.id))
        .where(
          and(
            eq(post.visibility, "public"),
            or(
              ilike(post.title, search),
              ilike(post.description, search),
              matchingPostIds.length > 0 ? inArray(post.id, matchingPostIds) : undefined
            )
          )
        )
        .orderBy(desc(post.createdAt));

      if (!posts.length) return { posts: [] };

      // 4️⃣ Fetch tags for all found posts
      const postTags = await db
        .select({
          postId: postToTag.postId,
          tagId: tag.id,
          tagName: tag.name,
        })
        .from(postToTag)
        .leftJoin(tag, eq(postToTag.tagId, tag.id))
        .where(inArray(postToTag.postId, posts.map((p) => p.id)));

      // 5️⃣ Map tags to posts
      const postsWithTags = posts.map((p) => ({
        ...p,
        tags: postTags
          .filter((t) => t.postId === p.id)
          .map((t) => t.tagName)
          .filter(Boolean) as string[],
      }));

      return { posts: postsWithTags };
    }),
});
