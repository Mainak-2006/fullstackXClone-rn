import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { getAuth } from "@clerk/express";
import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = asyncHandler(async (req, res) => {
    const { userId: clerkId } = getAuth(req);
    const loggedInUser = await User.findOne({ clerkId });

    if (!loggedInUser) {
        return res.status(404).json({ error: "User not found" });
    }

    // Only return users who follow us AND we follow them (Mutual followers)
    const mutualFollowers = await User.find({
        _id: {
            $in: loggedInUser.following,
            $ne: loggedInUser._id
        },
        following: loggedInUser._id // They must be following us back
    }).select("username firstName lastName profilePicture");

    res.status(200).json(mutualFollowers);
});

export const getMessages = asyncHandler(async (req, res) => {
    const { userId: clerkId } = getAuth(req);
    const { id: userToChatId } = req.params;

    const loggedInUser = await User.findOne({ clerkId });
    if (!loggedInUser) {
        return res.status(404).json({ error: "User not found" });
    }
    const currentUserId = loggedInUser._id;

    const messages = await Message.find({
        $or: [
            { senderId: currentUserId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: currentUserId },
        ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
});

export const sendMessage = asyncHandler(async (req, res) => {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const { userId: clerkId } = getAuth(req);

    const currentUser = await User.findOne({ clerkId });
    const senderId = currentUser._id;

    // Check if they are mutual followers
    const receiver = await User.findById(receiverId);
    if (!receiver) {
        return res.status(404).json({ error: "Receiver not found" });
    }

    const isIFollowThem = currentUser.following.includes(receiverId);
    const isTheyFollowMe = receiver.following.includes(senderId);

    if (!isIFollowThem || !isTheyFollowMe) {
        return res.status(403).json({ error: "You can only message mutual followers" });
    }

    let imageUrl;
    if (image) {
        // Upload base64 image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
    });

    await newMessage.save();

    // Socket logic
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
});
