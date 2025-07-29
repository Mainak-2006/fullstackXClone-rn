# Social Media App (X Clone)

A full-stack social media application built with React Native (Expo) for mobile and Node.js/Express for the backend. This Twitter/X-like platform allows users to share posts, follow other users, and engage with content through likes and comments.

## 🏗️ Architecture

This project follows a monorepo structure with two main components:

```
├── backend/          # Node.js/Express API server
├── mobile/           # React Native/Expo mobile app
└── docs/            # Documentation (API, deployment, etc.)
```

## ✨ Features

### Core Features
- **User Authentication** - Secure auth with Clerk
- **Post Creation** - Share text and images (280 character limit)
- **Social Interactions** - Like, comment, and share posts
- **User Profiles** - Customizable profiles with bio, location, and images
- **Follow System** - Follow/unfollow users to curate your feed
- **Real-time Notifications** - Get notified about interactions
- **Search Functionality** - Discover users and content
- **Direct Messaging** - Private conversations between users

### Advanced Features
- **Image Upload** - Cloudinary integration for media storage
- **Rate Limiting** - Arcjet protection against abuse
- **Cross-platform** - iOS, Android, and web support
- **Modern UI** - Clean, responsive design with NativeWind (Tailwind CSS)

## 🛠️ Tech Stack

### Mobile App (React Native/Expo)
- **Framework**: React Native with Expo SDK 53
- **Routing**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **State Management**: TanStack Query for server state
- **Authentication**: Clerk for user management
- **UI Components**: Custom components with Expo Vector Icons

### Backend API (Node.js)
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Clerk Express SDK
- **File Upload**: Multer + Cloudinary
- **Security**: Arcjet for rate limiting and protection
- **Deployment**: Vercel-ready configuration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB database
- Expo CLI (for mobile development)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd social-media-app
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with required variables
cp .env.example .env
# Fill in your environment variables

npm run dev
```

### 3. Mobile App Setup
```bash
cd mobile
npm install

# Start the Expo development server
npm start
```

## 📱 Mobile Development

The mobile app uses Expo with React Native and supports:
- iOS development (requires Xcode on macOS)
- Android development (requires Android Studio)
- Web development (runs in browser)

### Key Commands
```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run in web browser
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/social-media
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ARCJET_KEY=ajkey_...
```

### Mobile (app.json / Expo configuration)
The mobile app is configured through `app.json` and uses Clerk for authentication with the same publishable key.

## 📊 Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/         # Database and environment configuration
│   ├── controllers/    # Request handlers for each resource
│   ├── middleware/     # Auth, upload, and security middleware
│   ├── models/         # MongoDB schemas (User, Post, Comment, etc.)
│   ├── routes/         # API route definitions
│   └── server.js       # Main application entry point
├── package.json
└── vercel.json        # Deployment configuration
```

### Mobile Structure
```
mobile/
├── app/               # File-based routing (Expo Router)
│   ├── (auth)/       # Authentication screens
│   ├── (tabs)/       # Main app navigation tabs
│   └── _layout.tsx   # Root layout with providers
├── components/        # Reusable UI components
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── assets/           # Images, fonts, and static assets
└── package.json
```

## 🔗 API Endpoints

The backend provides RESTful APIs for:

- **Users**: `/api/users` - User management and profiles
- **Posts**: `/api/posts` - Create, read, update, delete posts
- **Comments**: `/api/comments` - Comment on posts
- **Notifications**: `/api/notifications` - User notifications

For detailed API documentation, see [docs/API.md](docs/API.md).

## 🚢 Deployment

### Backend Deployment (Vercel)
The backend is configured for Vercel deployment with `vercel.json`. Simply connect your repository to Vercel and set environment variables.

### Mobile App Deployment
Use Expo's EAS Build service for creating production builds:
```bash
npx eas build --platform all
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For detailed contributing guidelines, see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md).

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [documentation](docs/)
2. Search existing [GitHub issues](../../issues)
3. Create a new issue with detailed information

## 🎯 Roadmap

- [ ] Real-time messaging with WebSocket
- [ ] Push notifications
- [ ] Advanced search with filters
- [ ] Story/ephemeral content feature
- [ ] Dark mode support
- [ ] Accessibility improvements
- [ ] Performance optimizations

---

Built with ❤️ using React Native, Node.js, and modern web technologies.