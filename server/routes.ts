import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertPostSchema, insertCommentSchema, insertLikeSchema, insertFollowSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Route for getting posts for the feed
  app.get("/api/posts", async (req, res) => {
    try {
      const posts = await storage.getPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Route for creating a new post
  app.post("/api/posts", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const postData = insertPostSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const post = await storage.createPost(postData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  // Route for liking a post
  app.post("/api/posts/:postId/like", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const postId = parseInt(req.params.postId);
      const userId = req.user.id;
      
      const existingLike = await storage.getLike(userId, postId);
      if (existingLike) {
        await storage.removeLike(userId, postId);
        return res.json({ liked: false });
      }
      
      await storage.createLike({ userId, postId });
      res.json({ liked: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  // Route for commenting on a post
  app.post("/api/posts/:postId/comment", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const postId = parseInt(req.params.postId);
      const commentData = insertCommentSchema.parse({
        userId: req.user.id,
        postId,
        content: req.body.content
      });
      
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to post comment" });
    }
  });

  // Route for getting user profile
  app.get("/api/users/:username", async (req, res) => {
    try {
      const user = await storage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  // Route for following/unfollowing a user
  app.post("/api/users/:username/follow", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
    
    try {
      const user = await storage.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const followerId = req.user.id;
      const followingId = user.id;
      
      if (followerId === followingId) {
        return res.status(400).json({ message: "You cannot follow yourself" });
      }
      
      const existingFollow = await storage.getFollow(followerId, followingId);
      if (existingFollow) {
        await storage.removeFollow(followerId, followingId);
        return res.json({ following: false });
      }
      
      await storage.createFollow({ followerId, followingId });
      res.json({ following: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to follow user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
