# API Documentation

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="60" height="60"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express.js" width="60" height="60"/>
  <img src="https://images.clerk.com/static/logo-light-mode-400x400.png" alt="Clerk" width="60" height="60"/>
</div>

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://your-domain.vercel.app`

## Authentication

All protected endpoints require authentication via Clerk. Include the session token in the Authorization header:

```http
Authorization: Bearer <session_token>
```

## Response Format

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

## HTTP Status Codes

- `200` - OK: Request successful
- `201` - Created: Resource created successfully
- `400` - Bad Request: Invalid request data
- `401` - Unauthorized: Authentication required
- `403` - Forbidden: Insufficient permissions
- `404` - Not Found: Resource not found
- `429` - Too Many Requests: Rate limit exceeded
- `500` - Internal Server Error: Server error

---

# 👥 User Endpoints

## Get User Profile
Get a user's public profile information.

**Endpoint**: `GET /api/users/profile/:username`

**Parameters**:
- `username` (string): The username of the user

**Example Request**:
```bash
curl -X GET "http://localhost:5000/api/users/profile/johndoe"
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "_id": "64f8d2a5b123456789abcdef",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "profilePicture": "https://res.cloudinary.com/...",
    "bannerImage": "https://res.cloudinary.com/...",
    "bio": "Software developer passionate about React Native",
    "location": "San Francisco, CA",
    "followers": ["64f8d2a5b123456789abcd01", "64f8d2a5b123456789abcd02"],
    "following": ["64f8d2a5b123456789abcd03"],
    "createdAt": "2023-09-06T10:30:00.000Z"
  }
}
```

## Get Current User
Get the authenticated user's information.

**Endpoint**: `GET /api/users/me` 🔒

**Headers**:
```http
Authorization: Bearer <session_token>
```

**Example Request**:
```bash
curl -X GET "http://localhost:5000/api/users/me" \
  -H "Authorization: Bearer <session_token>"
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "_id": "64f8d2a5b123456789abcdef",
    "clerkId": "user_2abc123def456",
    "email": "john@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "profilePicture": "https://res.cloudinary.com/...",
    "bannerImage": "",
    "bio": "Software developer",
    "location": "San Francisco, CA",
    "followers": [],
    "following": [],
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

## Sync User
Sync user data from Clerk (usually called after sign-up/sign-in).

**Endpoint**: `POST /api/users/sync` 🔒

**Headers**:
```http
Authorization: Bearer <session_token>
Content-Type: application/json
```

**Example Request**:
```bash
curl -X POST "http://localhost:5000/api/users/sync" \
  -H "Authorization: Bearer <session_token>" \
  -H "Content-Type: application/json"
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "_id": "64f8d2a5b123456789abcdef",
    "clerkId": "user_2abc123def456",
    "email": "john@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe"
  },
  "message": "User synced successfully"
}
```

## Update Profile
Update the authenticated user's profile.

**Endpoint**: `PUT /api/users/profile` 🔒

**Headers**:
```http
Authorization: Bearer <session_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "bio": "Updated bio text",
  "location": "New York, NY",
  "profilePicture": "https://res.cloudinary.com/...",
  "bannerImage": "https://res.cloudinary.com/..."
}
```

**Example Request**:
```bash
curl -X PUT "http://localhost:5000/api/users/profile" \
  -H "Authorization: Bearer <session_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated bio text",
    "location": "New York, NY"
  }'
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "_id": "64f8d2a5b123456789abcdef",
    "username": "johndoe",
    "bio": "Updated bio text",
    "location": "New York, NY",
    "updatedAt": "2023-09-06T11:30:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

## Follow/Unfollow User
Follow or unfollow another user.

**Endpoint**: `POST /api/users/follow/:targetUserId` 🔒

**Parameters**:
- `targetUserId` (string): The ID of the user to follow/unfollow

**Headers**:
```http
Authorization: Bearer <session_token>
```

**Example Request**:
```bash
curl -X POST "http://localhost:5000/api/users/follow/64f8d2a5b123456789abcd01" \
  -H "Authorization: Bearer <session_token>"
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "isFollowing": true,
    "followerCount": 15,
    "followingCount": 8
  },
  "message": "User followed successfully"
}
```

---

# 📝 Post Endpoints

## Get All Posts
Get a paginated list of all posts.

**Endpoint**: `GET /api/posts`

**Query Parameters**:
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Posts per page (default: 10)

**Example Request**:
```bash
curl -X GET "http://localhost:5000/api/posts?page=1&limit=10"
```

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8d2a5b123456789abcdef",
      "user": {
        "_id": "64f8d2a5b123456789abcd01",
        "username": "johndoe",
        "firstName": "John",
        "lastName": "Doe",
        "profilePicture": "https://res.cloudinary.com/..."
      },
      "content": "Just built an amazing React Native app! 🚀",
      "image": "https://res.cloudinary.com/...",
      "likes": ["64f8d2a5b123456789abcd02"],
      "comments": ["64f8d2a5b123456789abcd03"],
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Get Single Post
Get a specific post by ID.

**Endpoint**: `GET /api/posts/:postId`

**Parameters**:
- `postId` (string): The ID of the post

**Example Request**:
```bash
curl -X GET "http://localhost:5000/api/posts/64f8d2a5b123456789abcdef"
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "_id": "64f8d2a5b123456789abcdef",
    "user": {
      "_id": "64f8d2a5b123456789abcd01",
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe",
      "profilePicture": "https://res.cloudinary.com/..."
    },
    "content": "Just built an amazing React Native app! 🚀",
    "image": "https://res.cloudinary.com/...",
    "likes": ["64f8d2a5b123456789abcd02"],
    "comments": ["64f8d2a5b123456789abcd03"],
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

## Get User Posts
Get all posts by a specific user.

**Endpoint**: `GET /api/posts/user/:username`

**Parameters**:
- `username` (string): The username of the user

**Query Parameters**:
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Posts per page (default: 10)

**Example Request**:
```bash
curl -X GET "http://localhost:5000/api/posts/user/johndoe?page=1&limit=5"
```

## Create Post
Create a new post.

**Endpoint**: `POST /api/posts` 🔒

**Headers**:
```http
Authorization: Bearer <session_token>
Content-Type: multipart/form-data
```

**Form Data**:
- `content` (string, optional): Post text content (max 280 characters)
- `image` (file, optional): Image file to upload

**Example Request**:
```bash
curl -X POST "http://localhost:5000/api/posts" \
  -H "Authorization: Bearer <session_token>" \
  -F "content=Just built an amazing React Native app! 🚀" \
  -F "image=@/path/to/image.jpg"
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "_id": "64f8d2a5b123456789abcdef",
    "user": "64f8d2a5b123456789abcd01",
    "content": "Just built an amazing React Native app! 🚀",
    "image": "https://res.cloudinary.com/...",
    "likes": [],
    "comments": [],
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  },
  "message": "Post created successfully"
}
```

## Like/Unlike Post
Like or unlike a post.

**Endpoint**: `POST /api/posts/:postId/like` 🔒

**Parameters**:
- `postId` (string): The ID of the post to like/unlike

**Headers**:
```http
Authorization: Bearer <session_token>
```

**Example Request**:
```bash
curl -X POST "http://localhost:5000/api/posts/64f8d2a5b123456789abcdef/like" \
  -H "Authorization: Bearer <session_token>"
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "isLiked": true,
    "likeCount": 5
  },
  "message": "Post liked successfully"
}
```

## Delete Post
Delete a post (only by post author).

**Endpoint**: `DELETE /api/posts/:postId` 🔒

**Parameters**:
- `postId` (string): The ID of the post to delete

**Headers**:
```http
Authorization: Bearer <session_token>
```

**Example Request**:
```bash
curl -X DELETE "http://localhost:5000/api/posts/64f8d2a5b123456789abcdef" \
  -H "Authorization: Bearer <session_token>"
```

**Example Response**:
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

# 💬 Comment Endpoints

## Get Post Comments
Get all comments for a specific post.

**Endpoint**: `GET /api/comments/post/:postId`

**Parameters**:
- `postId` (string): The ID of the post

**Example Request**:
```bash
curl -X GET "http://localhost:5000/api/comments/post/64f8d2a5b123456789abcdef"
```

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8d2a5b123456789abcd03",
      "user": {
        "_id": "64f8d2a5b123456789abcd02",
        "username": "janedoe",
        "firstName": "Jane",
        "lastName": "Doe",
        "profilePicture": "https://res.cloudinary.com/..."
      },
      "post": "64f8d2a5b123456789abcdef",
      "content": "Great work! 👏",
      "likes": [],
      "createdAt": "2023-09-06T11:00:00.000Z",
      "updatedAt": "2023-09-06T11:00:00.000Z"
    }
  ]
}
```

## Create Comment
Create a comment on a post.

**Endpoint**: `POST /api/comments/post/:postId` 🔒

**Parameters**:
- `postId` (string): The ID of the post to comment on

**Headers**:
```http
Authorization: Bearer <session_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "content": "Great work! 👏"
}
```

**Example Request**:
```bash
curl -X POST "http://localhost:5000/api/comments/post/64f8d2a5b123456789abcdef" \
  -H "Authorization: Bearer <session_token>" \
  -H "Content-Type: application/json" \
  -d '{"content": "Great work! 👏"}'
```

**Example Response**:
```json
{
  "success": true,
  "data": {
    "_id": "64f8d2a5b123456789abcd03",
    "user": "64f8d2a5b123456789abcd02",
    "post": "64f8d2a5b123456789abcdef",
    "content": "Great work! 👏",
    "likes": [],
    "createdAt": "2023-09-06T11:00:00.000Z",
    "updatedAt": "2023-09-06T11:00:00.000Z"
  },
  "message": "Comment created successfully"
}
```

## Delete Comment
Delete a comment (only by comment author).

**Endpoint**: `DELETE /api/comments/:commentId` 🔒

**Parameters**:
- `commentId` (string): The ID of the comment to delete

**Headers**:
```http
Authorization: Bearer <session_token>
```

**Example Request**:
```bash
curl -X DELETE "http://localhost:5000/api/comments/64f8d2a5b123456789abcd03" \
  -H "Authorization: Bearer <session_token>"
```

**Example Response**:
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

# 🔔 Notification Endpoints

## Get User Notifications
Get all notifications for the authenticated user.

**Endpoint**: `GET /api/notifications` 🔒

**Headers**:
```http
Authorization: Bearer <session_token>
```

**Query Parameters**:
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Notifications per page (default: 20)
- `unread` (boolean, optional): Filter unread notifications only

**Example Request**:
```bash
curl -X GET "http://localhost:5000/api/notifications?unread=true" \
  -H "Authorization: Bearer <session_token>"
```

**Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8d2a5b123456789abcd04",
      "from": {
        "_id": "64f8d2a5b123456789abcd02",
        "username": "janedoe",
        "firstName": "Jane",
        "lastName": "Doe",
        "profilePicture": "https://res.cloudinary.com/..."
      },
      "to": "64f8d2a5b123456789abcd01",
      "type": "like",
      "post": {
        "_id": "64f8d2a5b123456789abcdef",
        "content": "Just built an amazing React Native app! 🚀"
      },
      "comment": null,
      "read": false,
      "createdAt": "2023-09-06T11:30:00.000Z"
    }
  ]
}
```

## Mark Notifications as Read
Mark notifications as read.

**Endpoint**: `POST /api/notifications/mark-read` 🔒

**Headers**:
```http
Authorization: Bearer <session_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "notificationIds": ["64f8d2a5b123456789abcd04", "64f8d2a5b123456789abcd05"]
}
```

**Example Request**:
```bash
curl -X POST "http://localhost:5000/api/notifications/mark-read" \
  -H "Authorization: Bearer <session_token>" \
  -H "Content-Type: application/json" \
  -d '{"notificationIds": ["64f8d2a5b123456789abcd04"]}'
```

**Example Response**:
```json
{
  "success": true,
  "message": "Notifications marked as read"
}
```

---

# 🔧 Testing the API

## Using cURL
All the examples above use cURL commands that you can run directly in your terminal.

## Using Postman
1. Import the API endpoints into Postman
2. Set up environment variables for base URL and auth token
3. Create a collection for organized testing

## Using JavaScript/Fetch
```javascript
// Example: Get all posts
const response = await fetch('http://localhost:5000/api/posts');
const data = await response.json();

// Example: Create a post (authenticated)
const createPost = await fetch('http://localhost:5000/api/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${sessionToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    content: 'Hello from the API!'
  })
});
```

---

# 📊 Rate Limits

The API implements rate limiting via Arcjet:

- **General API calls**: 100 requests per minute per IP
- **Authentication endpoints**: 10 requests per minute per IP
- **Post creation**: 5 posts per minute per user
- **Comment creation**: 20 comments per minute per user

When rate limits are exceeded, you'll receive a `429 Too Many Requests` response.

---

# 🐛 Common Error Responses

## Authentication Error
```json
{
  "success": false,
  "error": "Unauthorized",
  "details": {
    "message": "Authentication token is required"
  }
}
```

## Validation Error
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "field": "content",
    "message": "Content cannot exceed 280 characters"
  }
}
```

## Resource Not Found
```json
{
  "success": false,
  "error": "Post not found",
  "details": {
    "postId": "64f8d2a5b123456789abcdef"
  }
}
```

## Rate Limit Exceeded
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "details": {
    "retryAfter": 60,
    "limit": 100,
    "window": "1 minute"
  }
}
```

---

**Legend**: 🔒 = Protected endpoint (requires authentication)