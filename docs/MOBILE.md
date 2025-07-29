# Mobile App Documentation

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React Native" width="80" height="80"/>
  <img src="https://github.com/expo/expo/raw/main/packages/expo/resources/expo-icon.png" alt="Expo" width="80" height="80"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width="80" height="80"/>
</div>

## Overview

The mobile app is built with React Native and Expo, providing a cross-platform social media experience similar to Twitter/X. It features modern UI design with NativeWind (Tailwind CSS), secure authentication with Clerk, and efficient state management with TanStack Query.

## 🏗️ Architecture

```
mobile/
├── app/                    # File-based routing (Expo Router)
│   ├── (auth)/            # Authentication screens
│   │   ├── index.tsx      # Sign in/up screen
│   │   └── _layout.tsx    # Auth layout
│   ├── (tabs)/            # Main app tabs
│   │   ├── index.tsx      # Home feed
│   │   ├── search.tsx     # Search users/posts
│   │   ├── notification.tsx # Notifications
│   │   ├── messages.tsx   # Direct messages
│   │   ├── profile.tsx    # User profile
│   │   └── _layout.tsx    # Tab navigation
│   └── _layout.tsx        # Root layout
├── components/             # Reusable UI components
│   ├── PostCard.tsx       # Individual post display
│   ├── PostComposer.tsx   # Create new post
│   ├── PostsList.tsx      # Posts feed list
│   ├── CommentsModal.tsx  # Comments modal
│   ├── EditProfileModal.tsx # Profile editing
│   └── NotificationCard.tsx # Notification item
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
├── data/                   # Static data and constants
├── assets/                 # Images, fonts, icons
│   ├── images/            # App images and icons
│   └── fonts/             # Custom fonts
└── package.json
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio

### Installation Steps

1. **Navigate to mobile directory**:
   ```bash
   cd mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on specific platforms**:
   ```bash
   npm run ios        # iOS simulator
   npm run android    # Android emulator
   npm run web        # Web browser
   ```

## 📱 Development Workflow

### Development Commands
```bash
npm start          # Start Expo development server
npm run android    # Run on Android emulator/device
npm run ios        # Run on iOS simulator/device
npm run web        # Run in web browser
npm run lint       # Run ESLint
npm run reset-project # Reset to blank project
```

### Development Server Options
When you run `npm start`, you'll see options to:
- Press `a` - Open on Android
- Press `i` - Open on iOS simulator
- Press `w` - Open in web browser
- Press `r` - Reload app
- Press `m` - Toggle menu

## 🎨 UI & Styling

### NativeWind (Tailwind CSS)
The app uses NativeWind for styling, which brings Tailwind CSS to React Native:

```tsx
// Example component with NativeWind
import { View, Text } from 'react-native';

export function PostCard() {
  return (
    <View className="bg-white p-4 mb-2 rounded-lg shadow-sm border border-gray-200">
      <Text className="text-lg font-semibold text-gray-900">
        Post content here
      </Text>
    </View>
  );
}
```

### Theme Configuration
The app uses a consistent color scheme:
- Primary: `#1DA1F2` (Twitter blue)
- Secondary: `#657786` (Gray)
- Background: `#FFFFFF` (White)
- Border: `#E1E8ED` (Light gray)

### Typography
- System fonts with fallbacks
- Consistent font sizes and weights
- Proper line heights for readability

## 🧭 Navigation Structure

### File-based Routing (Expo Router)
The app uses Expo Router for navigation with file-based routing:

```
app/
├── _layout.tsx           # Root layout with providers
├── (auth)/              # Authentication group
│   ├── _layout.tsx      # Auth-specific layout
│   └── index.tsx        # Sign in/up screen
└── (tabs)/              # Main app group
    ├── _layout.tsx      # Tab navigation layout
    ├── index.tsx        # Home tab (/)
    ├── search.tsx       # Search tab (/search)
    ├── notification.tsx # Notifications (/notification)
    ├── messages.tsx     # Messages (/messages)
    └── profile.tsx      # Profile (/profile)
```

### Navigation Features
- **Tab Navigation**: Bottom tabs for main app sections
- **Stack Navigation**: Nested navigation within tabs
- **Authentication Flow**: Automatic redirect based on auth state
- **Deep Linking**: Support for custom URL schemes

## 🔐 Authentication

### Clerk Integration
The app uses Clerk for authentication with the following features:

```tsx
// Authentication setup in _layout.tsx
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      {/* App content */}
    </ClerkProvider>
  );
}
```

### Authentication States
- **Signed Out**: Shows authentication screens
- **Signed In**: Shows main app with tabs
- **Loading**: Shows loading state during auth check

### Authentication Flow
1. User opens app
2. Clerk checks for existing session
3. If authenticated → Main app
4. If not authenticated → Auth screens
5. After sign-in → Sync user data with backend

## 📊 State Management

### TanStack Query (React Query)
Used for server state management:

```tsx
// Example: Fetching posts
import { useQuery } from '@tanstack/react-query';

function useGetPosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('/api/posts');
      return response.json();
    },
  });
}
```

### Key Query Patterns
- **Posts**: Fetch, create, like, delete posts
- **Users**: User profiles, follow/unfollow
- **Comments**: Post comments, create/delete
- **Notifications**: User notifications

### Caching Strategy
- Automatic background refetching
- Optimistic updates for likes/follows
- Cache invalidation on mutations
- Offline support with cached data

## 🎯 Core Features

### 1. Home Feed
- **File**: `app/(tabs)/index.tsx`
- **Features**:
  - Infinite scroll of posts
  - Pull-to-refresh
  - Post composer
  - Like/comment interactions

### 2. Search
- **File**: `app/(tabs)/search.tsx`
- **Features**:
  - User search functionality
  - Recent searches
  - Search suggestions

### 3. Notifications
- **File**: `app/(tabs)/notification.tsx`
- **Features**:
  - Real-time notifications
  - Like, comment, follow notifications
  - Mark as read functionality

### 4. Messages
- **File**: `app/(tabs)/messages.tsx`
- **Features**:
  - Direct messaging interface
  - Conversation list
  - Message threads

### 5. Profile
- **File**: `app/(tabs)/profile.tsx`
- **Features**:
  - User profile display
  - Edit profile modal
  - User's posts list
  - Follow/unfollow buttons

## 🧩 Key Components

### PostCard Component
Displays individual posts in the feed:

```tsx
// components/PostCard.tsx
interface PostCardProps {
  post: {
    id: string;
    content: string;
    image?: string;
    user: User;
    likes: string[];
    comments: Comment[];
    createdAt: string;
  };
}

export function PostCard({ post }: PostCardProps) {
  // Component implementation
}
```

**Features**:
- User avatar and name
- Post content with image support
- Like and comment buttons
- Timestamp display
- Menu for post actions

### PostComposer Component
Create new posts:

```tsx
// components/PostComposer.tsx
interface PostComposerProps {
  onPostCreated?: () => void;
}

export function PostComposer({ onPostCreated }: PostComposerProps) {
  // Component implementation
}
```

**Features**:
- Text input with character count
- Image picker integration
- Post button with loading state
- Character limit validation

### CommentsModal Component
Display and manage post comments:

```tsx
// components/CommentsModal.tsx
interface CommentsModalProps {
  postId: string;
  isVisible: boolean;
  onClose: () => void;
}

export function CommentsModal({ postId, isVisible, onClose }: CommentsModalProps) {
  // Component implementation
}
```

**Features**:
- Modal presentation
- Comments list
- Add new comment
- Delete own comments

## 📸 Image Handling

### Expo Image Picker
Used for selecting images from device:

```tsx
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled) {
    setImage(result.assets[0].uri);
  }
};
```

### Image Optimization
- Automatic resizing for uploads
- Cloudinary integration for storage
- Optimized loading with placeholders
- Support for various image formats

## 🔔 Push Notifications

### Setup (Future Enhancement)
The app is prepared for push notifications:

```tsx
// Future implementation
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
```

## 🎭 Icons & Assets

### Expo Vector Icons
Using Feather icons for consistent design:

```tsx
import { Feather } from '@expo/vector-icons';

// Usage in components
<Feather name="home" size={24} color="#1DA1F2" />
<Feather name="heart" size={20} color="#657786" />
<Feather name="message-circle" size={20} color="#657786" />
```

### Custom Assets
- App icon and splash screen
- Adaptive icons for Android
- Favicon for web version

## 🔧 Configuration Files

### app.json
Main Expo configuration:

```json
{
  "expo": {
    "name": "mobile",
    "slug": "mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.jpg",
    "scheme": "mobile",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "plugins": [
      "expo-router",
      ["expo-splash-screen", {
        "image": "./assets/images/splash-icon.jpg",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "black"
      }]
    ]
  }
}
```

### tsconfig.json
TypeScript configuration with strict settings:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🧪 Testing

### Testing Setup (Recommended)
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react-native jest
```

### Test Structure
```
__tests__/
├── components/
│   ├── PostCard.test.tsx
│   └── PostComposer.test.tsx
├── hooks/
│   └── useAuth.test.tsx
└── utils/
    └── helpers.test.tsx
```

## 🚀 Build & Deployment

### Development Builds
```bash
# Create development build
npx eas build --profile development --platform all
```

### Production Builds
```bash
# Create production build
npx eas build --profile production --platform all
```

### App Store Deployment
```bash
# Submit to app stores
npx eas submit --platform all
```

### Web Deployment
```bash
# Export for web
npx expo export --platform web
```

## 🔍 Debugging

### Expo Dev Tools
- **Metro bundler**: Shows bundle status and logs
- **Device logs**: Real-time device logging
- **Network inspector**: Monitor API calls
- **Performance monitor**: Track app performance

### React Native Debugger
For advanced debugging:
1. Install React Native Debugger
2. Enable remote debugging in dev menu
3. Use Redux DevTools for state inspection

### Common Debug Commands
```bash
# Clear Metro cache
npx expo start --clear

# Reset project
npm run reset-project

# Check for issues
npx expo doctor
```

## 📱 Platform-Specific Features

### iOS Specific
- Native iOS navigation feel
- iOS-style alerts and modals
- Support for iOS gestures
- App Store compliance

### Android Specific
- Material Design components
- Android back button handling
- Adaptive icons
- Google Play compliance

### Web Specific
- Responsive design
- Browser navigation
- SEO optimization
- Progressive Web App features

## 🔄 State Persistence

### Secure Store
For sensitive data storage:

```tsx
import * as SecureStore from 'expo-secure-store';

// Store sensitive data
await SecureStore.setItemAsync('userToken', token);

// Retrieve sensitive data
const token = await SecureStore.getItemAsync('userToken');
```

### AsyncStorage Alternative
For non-sensitive data, consider using AsyncStorage or MMKV for better performance.

## 🌐 Offline Support

### Future Enhancements
- Offline post drafts
- Cached content viewing
- Sync when online
- Offline indicators

## 📈 Performance Optimization

### Current Optimizations
- Image lazy loading
- FlatList for efficient scrolling
- Query caching with TanStack Query
- Optimized bundle size

### Monitoring
- Use Flipper for performance monitoring
- Monitor bundle size with `npx expo install --fix`
- Profile with React DevTools

## 🔐 Security Considerations

### Data Security
- Secure token storage with Expo SecureStore
- API communication over HTTPS
- Input validation and sanitization
- No sensitive data in logs

### Privacy
- User consent for permissions
- Data minimization
- Secure image uploads
- Privacy policy compliance

---

For backend integration details, see [BACKEND.md](BACKEND.md).
For API documentation, see [API.md](API.md).