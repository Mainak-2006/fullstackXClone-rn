import mongoose from "mongoose";
import { ENV } from "./env.js";

let isConnected = false;

export const connectDB = async () => {
  // If already connected, return immediately (important for serverless)
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("Using existing database connection");
    return;
  }

  try {
    // Avoid multiple connections in serverless environment
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(ENV.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      });
      isConnected = true;
      console.log("Connected to DB SUCCESSFULLY ✅");
    }
  } catch (error) {
    console.error("Error connecting to MONGODB:", error.message);
    isConnected = false;
    throw error; // Re-throw to handle in middleware
  }
};