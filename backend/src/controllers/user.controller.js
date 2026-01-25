import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import SearchHistory from "../models/search-history.model.js";

import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/express";

export const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  const user = await User.findOneAndUpdate({ clerkId: userId }, req.body, { new: true });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});

export const syncUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  // check if user already exists in mongodb
  const existingUser = await User.findOne({ clerkId: userId });
  if (existingUser) {
    return res.status(200).json({ user: existingUser, message: "User already exists" });
  }

  // create new user from Clerk data
  const clerkUser = await clerkClient.users.getUser(userId);

  const userData = {
    clerkId: userId,
    email: clerkUser.emailAddresses[0].emailAddress,
    firstName: clerkUser.firstName || "",
    lastName: clerkUser.lastName || "",
    username: clerkUser.emailAddresses[0].emailAddress.split("@")[0],
    profilePicture: clerkUser.imageUrl || "",
  };

  const user = await User.create(userData);

  res.status(201).json({ user, message: "User created successfully" });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const user = await User.findOne({ clerkId: userId });

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ user });
});

export const followUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { targetUserId } = req.params;

  if (userId === targetUserId) return res.status(400).json({ error: "You cannot follow yourself" });

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser) return res.status(404).json({ error: "Current user not found" });
  if (!targetUser) return res.status(404).json({ error: "Target user not found" });

  const isFollowing = currentUser.following.includes(targetUserId);

  if (isFollowing) {
    // unfollow
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { followers: currentUser._id },
    });
  } else {
    // follow
    await User.findByIdAndUpdate(currentUser._id, {
      $push: { following: targetUserId },
    });
    await User.findByIdAndUpdate(targetUserId, {
      $push: { followers: currentUser._id },
    });

    // create notification
    await Notification.create({
      from: currentUser._id,
      to: targetUserId,
      type: "follow",
    });
  }

  res.status(200).json({
    message: isFollowing ? "User unfollowed successfully" : "User followed successfully",
    isFollowing: !isFollowing,
  });
});

export const unfollowUser = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { targetUserId } = req.params;

  if (userId === targetUserId) return res.status(400).json({ error: "You cannot unfollow yourself" });

  const currentUser = await User.findOne({ clerkId: userId });
  const targetUser = await User.findById(targetUserId);

  if (!currentUser || !targetUser) return res.status(404).json({ error: "User not found" });

  const isFollowing = currentUser.following.includes(targetUserId);

  if (!isFollowing) return res.status(400).json({ error: "You are not following this user" });

  // unfollow
  await User.findByIdAndUpdate(currentUser._id, {
    $pull: { following: targetUserId },
  });
  await User.findByIdAndUpdate(targetUserId, {
    $pull: { followers: currentUser._id },
  });

  res.status(200).json({ message: "User unfollowed successfully" });
});

export const getFollowers = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate("followers", "username profilePicture");

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ followers: user.followers });
});

export const getFollowing = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId).populate("following", "username profilePicture");

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ following: user.following });
});

export const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const { userId: clerkId } = getAuth(req);

  const currentUser = await User.findOne({ clerkId });

  if (!currentUser) {
    return res.status(404).json({ error: "User not found" });
  }

  // Ensure query is a string and escape special characters
  const queryStr = String(query || "");
  const escapedQuery = queryStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const users = await User.find({
    $and: [
      { _id: { $ne: currentUser._id } },
      {
        $or: [
          { username: { $regex: escapedQuery, $options: "i" } },
          { firstName: { $regex: escapedQuery, $options: "i" } },
          { lastName: { $regex: escapedQuery, $options: "i" } },
        ],
      },
    ],
  })
    .select("username firstName lastName profilePicture followers following")
    .limit(20);

  res.status(200).json(users);
});

// Search History functions
export const saveSearchHistory = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { query, searchedUserId } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: "Query is required" });
  }

  const currentUser = await User.findOne({ clerkId: userId });
  if (!currentUser) {
    return res.status(404).json({ error: "User not found" });
  }

  // Create search history entry
  const searchHistory = await SearchHistory.create({
    userId: currentUser._id,
    query: query.trim(),
    searchedUserId: searchedUserId || null,
  });

  res.status(201).json({ message: "Search history saved", searchHistory });
});

export const getSearchHistory = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  const currentUser = await User.findOne({ clerkId: userId });
  if (!currentUser) {
    return res.status(404).json({ error: "User not found" });
  }

  // Get unique search history (latest per query) with user details
  const searchHistory = await SearchHistory.find({ userId: currentUser._id })
    .populate("searchedUserId", "username firstName lastName profilePicture")
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json({ searchHistory });
});

export const clearSearchHistory = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { id } = req.params;

  const currentUser = await User.findOne({ clerkId: userId });
  if (!currentUser) {
    return res.status(404).json({ error: "User not found" });
  }

  if (id) {
    // Delete specific item
    await SearchHistory.findOneAndDelete({ _id: id, userId: currentUser._id });
    res.status(200).json({ message: "Search history item deleted" });
  } else {
    // Delete all history for user
    await SearchHistory.deleteMany({ userId: currentUser._id });
    res.status(200).json({ message: "All search history cleared" });
  }
});