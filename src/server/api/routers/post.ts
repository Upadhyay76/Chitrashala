import { user } from "auth-schema";
import { desc, eq, and, inArray, ilike, or } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { post, postToTag, tag } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  // 🟢 Get all public posts
  getPosts: protectedProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const posts = await db
      .select({
        id: post.id,
        title: post.title,
        description: post.description,
        mediaUrl: post.mediaUrl,
        type: post.type,
        createdAt: post.createdAt,
        user: {
          id: user.id,
          name: user.name,
          avatarImage: user.image,
        },
      })
      .from(post)
      .leftJoin(user, eq(post.userId, user.id))
      .where(eq(post.visibility, "public"))
      .orderBy(desc(post.createdAt));

    return { posts };
  }),

  // 🟢 Get single post by ID
  getPostById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;

      const [postDetail] = await db
        .select({
          id: post.id,
          title: post.title,
          description: post.description,
          mediaUrl: post.mediaUrl,
          type: post.type,
          createdAt: post.createdAt,
          user: {
            id: user.id,
            name: user.name,
            avatarImage: user.image,
          },
        })
        .from(post)
        .leftJoin(user, eq(post.userId, user.id))
        .where(eq(post.id, input.id))
        .limit(1);

      if (!postDetail) throw new Error("Post not found");
      return postDetail;
    }),

  getUserPosts: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;
    const userId = session.user.id;

    // 1️⃣ Fetch user posts
    const posts = await db
      .select({
        id: post.id,
        title: post.title,
        description: post.description,
        mediaUrl: post.mediaUrl,
        type: post.type,
        createdAt: post.createdAt,
        visibility: post.visibility,
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
      .where(
        inArray(postToTag.postId, posts.map((p) => p.id))
      );

    // 3️⃣ Map tags to posts
    const postsWithTags = posts.map((p) => ({
      ...p,
      tags: postTags
        .filter((t) => t.postId === p.id)
        .map((t) => t.tagName)
        .filter(Boolean),
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

      // 2️⃣ Find posts that match title, description, or tags
      const posts = await db
        .select({
          id: post.id,
          title: post.title,
          description: post.description,
          mediaUrl: post.mediaUrl,
          type: post.type,
          createdAt: post.createdAt,
          user: {
            id: user.id,
            name: user.name,
            avatarImage: user.image,
          },
        })
        .from(post)
        .leftJoin(user, eq(post.userId, user.id))
        .where(
          or(
            ilike(post.title, search),
            ilike(post.description, search),
            inArray(
              post.id,
              db
                .select({ postId: postToTag.postId })
                .from(postToTag)
                .where(inArray(postToTag.tagId, tagIds))
            )
          )
        )
        .orderBy(desc(post.createdAt));

      return { posts };
    }),
});
