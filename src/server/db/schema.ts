import { relations, sql } from "drizzle-orm"; // Import 'sql' for conditional indexes
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  pgTableCreator,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `pg-drizzle_${name}`);

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

export const postTypeEnum = pgEnum("post_type", ["image", "video"]);

export const postVisibilityEnum = pgEnum("post_visibility", [
  "public",
  "private",
]);

export const postAccessTypeEnum = pgEnum("post_access_type", ["free", "paid"]);

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  avatarImage: varchar("avatarImage", { length: 300 }),
  coverImage: varchar("coverImage", { length: 300 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const follow = pgTable(
  "follow",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    followingId: text("following_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).defaultNow(),
  },
  (table) => ({
    pk: uniqueIndex("follow_pk").on(table.followerId, table.followingId),
  }),
);

export const tag = pgTable("tag", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).defaultNow(),
});

export const post = pgTable(
  "post",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: postTypeEnum("type").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    mediaUrl: text("media_url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    visibility: postVisibilityEnum("visibility").default("public").notNull(),
    accessType: postAccessTypeEnum("access_type").default("free").notNull(),
    price: varchar("price", { length: 50 }),
    isDownloadable: boolean("is_downloadable").default(false).notNull(),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).defaultNow(),
  },
  (table) => ({
    userIdIdx: index("post_userId_idx").on(table.userId),
    visibilityIdx: index("post_visibility_idx").on(table.visibility),
  }),
);

export const postToTag = pgTable(
  "post_to_tag",
  {
    postId: text("post_id")
      .notNull()
      .references(() => post.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: uniqueIndex("post_to_tag_pk").on(table.postId, table.tagId),
  }),
);

export const comment = pgTable(
  "comment",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    postId: text("post_id")
      .notNull()
      .references(() => post.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    // For nested comments (optional) - self-referencing.
    // Drizzle will correctly infer the type for `comment.id` here.
    parentId: text("parent_id").references((): any => comment.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      withTimezone: true,
    }).defaultNow(),
  },
  (table) => ({
    postIdIdx: index("comment_postId_idx").on(table.postId),
    userIdIdx: index("comment_userId_idx").on(table.userId),
  }),
);

// Likes: on posts, comments
export const like = pgTable(
  "like",
  {
    id: text("id").primaryKey(), // Using a primary key for likes
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // Use postId for liking posts
    postId: text("post_id").references(() => post.id, { onDelete: "cascade" }),
    // Use commentId for liking comments
    commentId: text("comment_id").references(() => comment.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at", {
      mode: "date",
      withTimezone: true,
    }).defaultNow(),
  },
  (table) => ({
    postUnique: uniqueIndex("like_post_unique")
      .on(table.userId, table.postId)
      .where(sql`${table.postId} IS NOT NULL`),
    commentUnique: uniqueIndex("like_comment_unique")
      .on(table.userId, table.commentId)
      .where(sql`${table.commentId} IS NOT NULL`),
    userIdIdx: index("like_userId_idx").on(table.userId),
    postIdIdx: index("like_postId_idx").on(table.postId),
    commentIdIdx: index("like_commentId_idx").on(table.commentId),
  }),
);

export const userRelations = relations(user, ({ many }) => ({
  account: many(account),
  session: many(session),
  posts: many(post),
  comments: many(comment),
  likes: many(like),
  following: many(follow, { relationName: "user_following" }),
  followers: many(follow, { relationName: "user_followers" }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const followRelations = relations(follow, ({ one }) => ({
  follower: one(user, {
    fields: [follow.followerId],
    references: [user.id],
    relationName: "user_following",
  }),
  following: one(user, {
    fields: [follow.followingId],
    references: [user.id],
    relationName: "user_followers",
  }),
}));

export const postRelations = relations(post, ({ one, many }) => ({
  user: one(user, { fields: [post.userId], references: [user.id] }),
  comments: many(comment),
  likes: many(like),
  postToTags: many(postToTag),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  postToTags: many(postToTag),
}));

export const postToTagRelations = relations(postToTag, ({ one }) => ({
  post: one(post, { fields: [postToTag.postId], references: [post.id] }),
  tag: one(tag, { fields: [postToTag.tagId], references: [tag.id] }),
}));

export const commentRelations = relations(comment, ({ one, many }) => ({
  user: one(user, { fields: [comment.userId], references: [user.id] }),
  post: one(post, { fields: [comment.postId], references: [post.id] }),
  parent: one(comment, {
    fields: [comment.parentId],
    references: [comment.id],
    relationName: "child_comments",
  }),
  replies: many(comment, { relationName: "child_comments" }),
  likes: many(like),
}));

export const likeRelations = relations(like, ({ one }) => ({
  user: one(user, { fields: [like.userId], references: [user.id] }),
  post: one(post, { fields: [like.postId], references: [post.id] }),
  comment: one(comment, { fields: [like.commentId], references: [comment.id] }),
}));
