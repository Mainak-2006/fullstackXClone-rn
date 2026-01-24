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

    // Find users who have either messaged us or we follow/follow us
    // For simplicity in this clone, we'll just return all users except current user
    const filteredUsers = await User.find({ _id: { $ne: loggedInUser._id } }).select(
        "username firstName lastName profilePicture"
    );

    res.status(200).json(filteredUsers);
});

export const getMessages = asyncHandler(async (req, res) => {
    const { userId: clerkId } = getAuth(req);
    const { id: userToChatId } = req.params;

    const currentUserId = (await User.findOne({ clerkId }))._id;

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
