import { 
  users, posts, likes, comments, follows,
  insertUserSchema, insertPostSchema, insertLikeSchema, insertCommentSchema, insertFollowSchema
} from "@shared/schema";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { db, pool } from "./db";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Define our insert types from the schemas
type InsertUser = z.infer<typeof insertUserSchema>;
type InsertPost = z.infer<typeof insertPostSchema>;
type InsertLike = z.infer<typeof insertLikeSchema>;
type InsertComment = z.infer<typeof insertCommentSchema>;
type InsertFollow = z.infer<typeof insertFollowSchema>;

// Use the inferred types from the schema
type User = typeof users.$inferSelect;
type Post = typeof posts.$inferSelect;
type Like = typeof likes.$inferSelect;
type Comment = typeof comments.$inferSelect;
type Follow = typeof follows.$inferSelect;

// Extend the interface with our CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Post methods
  getPosts(): Promise<(Post & { user: User, likeCount: number, commentCount: number })[]>;
  getPostById(id: number): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  
  // Like methods
  getLike(userId: number, postId: number): Promise<Like | undefined>;
  createLike(like: InsertLike): Promise<Like>;
  removeLike(userId: number, postId: number): Promise<void>;
  
  // Comment methods
  getCommentsByPostId(postId: number): Promise<(Comment & { user: User })[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Follow methods
  getFollow(followerId: number, followingId: number): Promise<Follow | undefined>;
  createFollow(follow: InsertFollow): Promise<Follow>;
  removeFollow(followerId: number, followingId: number): Promise<void>;
  
  // Session store
  sessionStore: any; // Using any to avoid type issues with session store
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({
      pool,
      tableName: "session", 
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Post methods
  async getPosts(): Promise<(Post & { user: User, likeCount: number, commentCount: number })[]> {
    const result = await db.query.posts.findMany({
      with: {
        user: true,
      },
      orderBy: (posts, { desc }) => [desc(posts.createdAt)]
    });

    const postsWithCounts = await Promise.all(
      result.map(async (post) => {
        const likeCount = await db.select({ count: sql`count(*)` })
          .from(likes)
          .where(eq(likes.postId, post.id));
        
        const commentCount = await db.select({ count: sql`count(*)` })
          .from(comments)
          .where(eq(comments.postId, post.id));

        return {
          ...post,
          likeCount: Number(likeCount[0]?.count || 0),
          commentCount: Number(commentCount[0]?.count || 0)
        };
      })
    );
    
    return postsWithCounts;
  }

  async getPostById(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db.insert(posts).values(insertPost).returning();
    return post;
  }

  // Like methods
  async getLike(userId: number, postId: number): Promise<Like | undefined> {
    const [like] = await db.select()
      .from(likes)
      .where(and(
        eq(likes.userId, userId),
        eq(likes.postId, postId)
      ));
    return like;
  }

  async createLike(insertLike: InsertLike): Promise<Like> {
    const [like] = await db.insert(likes).values(insertLike).returning();
    return like;
  }

  async removeLike(userId: number, postId: number): Promise<void> {
    await db.delete(likes)
      .where(and(
        eq(likes.userId, userId),
        eq(likes.postId, postId)
      ));
  }

  // Comment methods
  async getCommentsByPostId(postId: number): Promise<(Comment & { user: User })[]> {
    const result = await db.query.comments.findMany({
      where: eq(comments.postId, postId),
      with: {
        user: true
      },
      orderBy: (comments, { desc }) => [desc(comments.createdAt)]
    });
    
    return result;
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(insertComment).returning();
    return comment;
  }

  // Follow methods
  async getFollow(followerId: number, followingId: number): Promise<Follow | undefined> {
    const [follow] = await db.select()
      .from(follows)
      .where(and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      ));
    return follow;
  }

  async createFollow(insertFollow: InsertFollow): Promise<Follow> {
    const [follow] = await db.insert(follows).values(insertFollow).returning();
    return follow;
  }

  async removeFollow(followerId: number, followingId: number): Promise<void> {
    await db.delete(follows)
      .where(and(
        eq(follows.followerId, followerId),
        eq(follows.followingId, followingId)
      ));
  }
}

export const storage = new DatabaseStorage();