# Backend Documentation

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="80" height="80"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express.js" width="80" height="80"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" width="80" height="80"/>
  <img src="https://images.clerk.com/static/logo-light-mode-400x400.png" alt="Clerk" width="80" height="80"/>
</div>

## Overview

The backend is a RESTful API built with Node.js and Express.js, providing endpoints for user management, posts, comments, and notifications. It uses MongoDB for data persistence and integrates with Clerk for authentication, Cloudinary for image storage, and Arcjet for security.

## 🏗️ Architecture

```
backend/
├── src/
│   ├── config/         # Configuration files
│   │   ├── db.js      # MongoDB connection
│   │   └── env.js     # Environment variables
│   ├── controllers/    # Business logic handlers
│   │   ├── user.controller.js
│   │   ├── post.controller.js
│   │   ├── comment.controller.js
│   │   └── notification.controller.js
│   ├── middleware/     # Express middleware
│   │   ├── auth.middleware.js    # Authentication
│   │   ├── upload.middleware.js  # File upload
│   │   └── arcjet.middleware.js  # Security
│   ├── models/         # MongoDB schemas
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   ├── comment.model.js
│   │   └── notification.model.js
│   ├── routes/         # API route definitions
│   │   ├── user.route.js
│   │   ├── post.route.js
│   │   ├── comment.route.js
│   │   └── notification.route.js
│   └── server.js       # Application entry point
├── package.json
├── package-lock.json
└── vercel.json        # Deployment configuration
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB database (local or cloud)
- Cloudinary account (for image uploads)
- Clerk account (for authentication)
- Arcjet account (for security)

### Installation Steps

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Environment Variables section)

5. **Start development server**:
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/social-media
# or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/social-media

# Authentication (Clerk)
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# File Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security (Arcjet)
ARCJET_KEY=ajkey_...
```

### How to Get These Keys

1. **MongoDB**: 
   - Local: Install MongoDB locally or use MongoDB Atlas
   - Cloud: Create account at [MongoDB Atlas](https://cloud.mongodb.com)

2. **Clerk**: 
   - Create account at [Clerk.dev](https://clerk.dev)
   - Create new application
   - Copy keys from dashboard

3. **Cloudinary**: 
   - Create account at [Cloudinary](https://cloudinary.com)
   - Find keys in dashboard settings

4. **Arcjet**: 
   - Create account at [Arcjet](https://arcjet.com)
   - Create new project and copy key

## 📊 Data Models

### User Model
```javascript
{
  clerkId: String (unique),      // Clerk user ID
  email: String (unique),        // User email
  firstName: String,             // First name
  lastName: String,              // Last name
  username: String (unique),     // Username
  profilePicture: String,        // Cloudinary URL
  bannerImage: String,           // Cloudinary URL
  bio: String (max 160 chars),   // User bio
  location: String,              // User location
  followers: [ObjectId],         // Array of user IDs
  following: [ObjectId],         // Array of user IDs
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```javascript
{
  user: ObjectId (ref: User),    // Post author
  content: String (max 280),     // Post text content
  image: String,                 // Cloudinary URL
  likes: [ObjectId],             // Array of user IDs who liked
  comments: [ObjectId],          // Array of comment IDs
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  user: ObjectId (ref: User),    // Comment author
  post: ObjectId (ref: Post),    // Parent post
  content: String (max 280),     // Comment text
  likes: [ObjectId],             // Array of user IDs who liked
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Model
```javascript
{
  from: ObjectId (ref: User),    // User who triggered notification
  to: ObjectId (ref: User),      // User receiving notification
  type: String,                  // 'follow', 'like', 'comment'
  post: ObjectId (ref: Post),    // Related post (optional)
  comment: ObjectId (ref: Comment), // Related comment (optional)
  createdAt: Date,
  updatedAt: Date
}
```

## 🛣️ API Routes

### Base URL
- Development: `http://localhost:5000`
- Production: Your deployed URL

### Authentication
All protected routes require authentication via Clerk. Include the session token in the Authorization header:
```
Authorization: Bearer <session_token>
```

### User Routes (`/api/users`)

#### Public Routes
- `GET /profile/:username` - Get user profile by username

#### Protected Routes
- `POST /sync` - Sync user data from Clerk
- `GET /me` - Get current user data
- `PUT /profile` - Update user profile
- `POST /follow/:targetUserId` - Follow/unfollow a user

### Post Routes (`/api/posts`)

#### Public Routes
- `GET /` - Get all posts (paginated)
- `GET /:postId` - Get specific post
- `GET /user/:username` - Get posts by user

#### Protected Routes
- `POST /` - Create new post (supports image upload)
- `POST /:postId/like` - Like/unlike a post
- `DELETE /:postId` - Delete a post

### Comment Routes (`/api/comments`)

#### Public Routes
- `GET /post/:postId` - Get comments for a post

#### Protected Routes
- `POST /post/:postId` - Create comment on post
- `DELETE /:commentId` - Delete a comment

### Notification Routes (`/api/notifications`)

#### Protected Routes
- `GET /` - Get user notifications
- `POST /mark-read` - Mark notifications as read

## 🔐 Middleware

### Authentication Middleware (`auth.middleware.js`)
- Validates Clerk session tokens
- Attaches user information to request object
- Protects routes requiring authentication

### Upload Middleware (`upload.middleware.js`)
- Handles multipart/form-data for file uploads
- Integrates with Multer for file processing
- Supports image uploads to Cloudinary

### Arcjet Middleware (`arcjet.middleware.js`)
- Provides rate limiting and security features
- Protects against DDoS and abuse
- Configurable limits per endpoint

## 🔄 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": {
    // Additional error details
  }
}
```

### Pagination Response
```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables**:
   - Go to Vercel dashboard
   - Add all environment variables from your `.env` file

### Manual Deployment

1. **Build for production**:
   ```bash
   npm install --production
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

## 🔧 Development Scripts

```bash
npm run dev      # Start development server with auto-reload
npm start        # Start production server
npm test         # Run tests (if implemented)
npm run lint     # Run linting (if configured)
```

## 📝 Database Setup

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/social-media`

### MongoDB Atlas (Cloud)
1. Create account at MongoDB Atlas
2. Create cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string

## 🔒 Security Features

### Rate Limiting
- Implemented via Arcjet middleware
- Configurable limits per endpoint
- Protection against abuse and DDoS

### Input Validation
- Content length limits (280 characters for posts/comments)
- Email validation
- Username format validation

### Authentication
- Clerk-based authentication
- JWT token validation
- Protected route middleware

## 🐛 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server errors

## 📊 Monitoring & Logging

### Development Logging
- Console logging for development
- Error tracking and stack traces

### Production Monitoring
- Consider integrating with services like:
  - Vercel Analytics
  - Sentry for error tracking
  - MongoDB Atlas monitoring

## 🔄 API Versioning

Current API version: `v1`
- All routes are prefixed with `/api/`
- Future versions can be added as `/api/v2/`

---

For API endpoint examples and testing, see [API.md](API.md).