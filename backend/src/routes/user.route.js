import express from "express";
import {
  followUser,
  getCurrentUser,
  getUserProfile,
  syncUser,
  updateProfile,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
  saveSearchHistory,
  getSearchHistory,
  clearSearchHistory,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// public route
router.get("/profile/:username", getUserProfile);

// protected routes
router.post("/sync", protectRoute, syncUser);
router.get("/me", protectRoute, getCurrentUser);
router.put("/profile", protectRoute, updateProfile);
router.post("/follow/:targetUserId", protectRoute, followUser);
router.post("/unfollow/:targetUserId", protectRoute, unfollowUser);
router.get("/:userId/followers", protectRoute, getFollowers);
router.get("/:userId/following", protectRoute, getFollowing);
router.get("/search-users", protectRoute, searchUsers);

// Search History routes
router.post("/search-history", protectRoute, saveSearchHistory);
router.get("/search-history", protectRoute, getSearchHistory);
router.delete("/search-history/:id?", protectRoute, clearSearchHistory);

export default router;
