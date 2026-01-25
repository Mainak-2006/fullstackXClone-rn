import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";


import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import commentRoutes from "./routes/comment.route.js";
import notificationRoutes from "./routes/notification.route.js";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
const app = express();

app.use(cors());
app.use(express.json());
app.set('trust proxy', 1);

app.use(clerkMiddleware());

// Database connection middleware - ensures DB is connected for each serverless invocation
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    return res.status(503).json({
      error: {
        code: "503",
        message: "Database unavailable. Please try again later."
      }
    });
  }
});

app.get("/", (req, res) => res.send("Hello from X Server"));

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);


// Enhanced error handler with detailed logging
app.use((err, req, res, next) => {
  console.error("Unhandled error:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
  });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      code: String(statusCode),
      message: err.message || "A server error has occurred"
    }
  });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () =>
      console.log("Server is up and running on PORT:", ENV.PORT)
    );
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

// Only start server if not in Vercel serverless environment
if (process.env.NODE_ENV !== 'production') {
  startServer();
}

export default app;