import { 
  User, InsertUser, Post, InsertPost, 
  Like, InsertLike, Comment, InsertComment, 
  Follow, InsertFollow 
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

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
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private likes: Map<number, Like>;
  private comments: Map<number, Comment>;
  private follows: Map<number, Follow>;
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private postIdCounter: number;
  private likeIdCounter: number;
  private commentIdCounter: number;
  private followIdCounter: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.likes = new Map();
    this.comments = new Map();
    this.follows = new Map();
    
    this.userIdCounter = 1;
    this.postIdCounter = 1;
    this.likeIdCounter = 1;
    this.commentIdCounter = 1;
    this.followIdCounter = 1;
    
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Add some sample users
    this.seedData();
  }

  private seedData() {
    // This will be overwritten by actual user registration
    // The seed data provides some structure for the initial UI state
    const demoUsers = [
      {
        username: "user",
        email: "user@example.com",
        password: "password", // In real app, this would be hashed
        fullName: "Demo User",
        profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        bio: "Welcome to ConnectX!"
      }
    ];
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Post methods
  async getPosts(): Promise<(Post & { user: User, likeCount: number, commentCount: number })[]> {
    const posts = Array.from(this.posts.values());
    
    return posts.map(post => {
      const user = this.users.get(post.userId);
      if (!user) throw new Error(`User not found for post ${post.id}`);
      
      const postLikes = Array.from(this.likes.values()).filter(
        like => like.postId === post.id
      );
      
      const postComments = Array.from(this.comments.values()).filter(
        comment => comment.postId === post.id
      );
      
      return {
        ...post,
        user,
        likeCount: postLikes.length,
        commentCount: postComments.length
      };
    })
    .sort((a, b) => {
      const dateA = a.createdAt?.getTime() || 0;
      const dateB = b.createdAt?.getTime() || 0;
      return dateB - dateA; // Newest first
    });
  }

  async getPostById(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.postIdCounter++;
    const now = new Date();
    const post: Post = {
      ...insertPost,
      id,
      createdAt: now
    };
    this.posts.set(id, post);
    return post;
  }

  // Like methods
  async getLike(userId: number, postId: number): Promise<Like | undefined> {
    return Array.from(this.likes.values()).find(
      like => like.userId === userId && like.postId === postId
    );
  }

  async createLike(insertLike: InsertLike): Promise<Like> {
    const id = this.likeIdCounter++;
    const now = new Date();
    const like: Like = {
      ...insertLike,
      id,
      createdAt: now
    };
    this.likes.set(id, like);
    return like;
  }

  async removeLike(userId: number, postId: number): Promise<void> {
    const like = await this.getLike(userId, postId);
    if (like) {
      this.likes.delete(like.id);
    }
  }

  // Comment methods
  async getCommentsByPostId(postId: number): Promise<(Comment & { user: User })[]> {
    const comments = Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => {
        const dateA = a.createdAt?.getTime() || 0;
        const dateB = b.createdAt?.getTime() || 0;
        return dateB - dateA; // Newest first
      });
    
    return comments.map(comment => {
      const user = this.users.get(comment.userId);
      if (!user) throw new Error(`User not found for comment ${comment.id}`);
      
      return {
        ...comment,
        user
      };
    });
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentIdCounter++;
    const now = new Date();
    const comment: Comment = {
      ...insertComment,
      id,
      createdAt: now
    };
    this.comments.set(id, comment);
    return comment;
  }

  // Follow methods
  async getFollow(followerId: number, followingId: number): Promise<Follow | undefined> {
    return Array.from(this.follows.values()).find(
      follow => follow.followerId === followerId && follow.followingId === followingId
    );
  }

  async createFollow(insertFollow: InsertFollow): Promise<Follow> {
    const id = this.followIdCounter++;
    const now = new Date();
    const follow: Follow = {
      ...insertFollow,
      id,
      createdAt: now
    };
    this.follows.set(id, follow);
    return follow;
  }

  async removeFollow(followerId: number, followingId: number): Promise<void> {
    const follow = await this.getFollow(followerId, followingId);
    if (follow) {
      this.follows.delete(follow.id);
    }
  }
}

export const storage = new MemStorage();
