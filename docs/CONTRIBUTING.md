# Contributing Guidelines

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" width="80" height="80"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" width="80" height="80"/>
</div>

## Welcome Contributors! 🎉

Thank you for your interest in contributing to our social media app! This document provides guidelines and information for contributors to help maintain code quality and ensure a smooth collaboration process.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Testing](#testing)
- [Documentation](#documentation)

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors, regardless of background, experience level, or identity.

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment, discrimination, or offensive comments
- Personal attacks or trolling
- Publishing private information without consent
- Any conduct that would be inappropriate in a professional setting

## 🚀 Getting Started

### Prerequisites
Before contributing, ensure you have:
- Node.js 18+ installed
- Git installed and configured
- A GitHub account
- Basic knowledge of React Native, Node.js, and MongoDB

### First-Time Setup

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/social-media-app.git
   cd social-media-app
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/social-media-app.git
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Mobile
   cd ../mobile
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Copy example files and fill in your values
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

## 🛠️ Development Setup

### Backend Development

```bash
cd backend
npm run dev  # Starts development server with hot reload
```

**Environment Variables Required:**
- `MONGO_URI` - MongoDB connection string
- `CLERK_PUBLISHABLE_KEY` - Clerk authentication key
- `CLERK_SECRET_KEY` - Clerk secret key
- `CLOUDINARY_*` - Cloudinary configuration
- `ARCJET_KEY` - Security service key

### Mobile Development

```bash
cd mobile
npm start    # Starts Expo development server
```

**Development Commands:**
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

### Database Setup

#### Option 1: Local MongoDB
```bash
# Install MongoDB locally
brew install mongodb/brew/mongodb-community  # macOS
# or follow MongoDB installation guide for your OS

# Start MongoDB
brew services start mongodb/brew/mongodb-community
```

#### Option 2: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster
3. Get connection string
4. Add to `MONGO_URI` in `.env`

## 📁 Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── server.js       # Entry point
└── package.json
```

### Mobile Structure
```
mobile/
├── app/               # Expo Router pages
├── components/        # Reusable components
├── hooks/            # Custom hooks
├── types/            # TypeScript types
├── utils/            # Utility functions
└── assets/           # Images and fonts
```

## 🎨 Coding Standards

### JavaScript/TypeScript

#### Code Style
- Use ES6+ features
- Prefer `const` and `let` over `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use destructuring when appropriate

```javascript
// Good
const getUserPosts = async (userId) => {
  const posts = await Post.find({ user: userId });
  return posts.map(({ _id, content, createdAt }) => ({
    id: _id,
    content,
    createdAt,
  }));
};

// Avoid
var getUserPosts = function(userId) {
  return Post.find({ user: userId }).then(function(posts) {
    return posts.map(function(post) {
      return {
        id: post._id,
        content: post.content,
        createdAt: post.createdAt
      };
    });
  });
};
```

#### Naming Conventions
- **Variables/Functions**: camelCase (`getUserData`, `isLoading`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_FILE_SIZE`)
- **Components**: PascalCase (`PostCard`, `UserProfile`)
- **Files**: kebab-case for utilities, PascalCase for components

#### TypeScript Guidelines
```typescript
// Define interfaces for props
interface PostCardProps {
  post: {
    id: string;
    content: string;
    user: User;
    createdAt: string;
  };
  onLike: (postId: string) => void;
}

// Use proper return types
const fetchPosts = async (): Promise<Post[]> => {
  const response = await api.get('/posts');
  return response.data;
};
```

### React Native/Expo

#### Component Structure
```tsx
// components/PostCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
  const handleLike = () => {
    onLike(post.id);
  };

  return (
    <View className="bg-white p-4 mb-2 rounded-lg">
      <Text className="text-lg font-semibold">{post.content}</Text>
      <TouchableOpacity onPress={handleLike}>
        <Text className="text-blue-500">Like</Text>
      </TouchableOpacity>
    </View>
  );
}
```

#### Styling Guidelines
- Use NativeWind (Tailwind CSS) for styling
- Keep styles consistent with design system
- Use semantic class names
- Avoid inline styles when possible

### Backend API

#### Route Structure
```javascript
// routes/post.route.js
import express from "express";
import { createPost, getPosts } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getPosts);

// Protected routes
router.post("/", protectRoute, createPost);

export default router;
```

#### Controller Pattern
```javascript
// controllers/post.controller.js
import asyncHandler from "express-async-handler";
import Post from "../models/post.model.js";

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("user", "username firstName lastName profilePicture")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: posts,
  });
});
```

## 📝 Commit Guidelines

### Commit Message Format
Use the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat(auth): add user registration endpoint
fix(mobile): resolve login button not responding
docs: update API documentation for posts endpoint
style(backend): format code with prettier
refactor(mobile): extract user profile logic to custom hook
test(api): add unit tests for user controller
chore: update dependencies to latest versions
```

### Commit Best Practices
- Keep commits atomic (one logical change per commit)
- Write clear, descriptive commit messages
- Reference issues when applicable (`fixes #123`)
- Avoid committing sensitive information

## 🔄 Pull Request Process

### Before Creating a PR

1. **Sync with upstream**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/user-profile-enhancement
   ```

3. **Make your changes and test**
   ```bash
   # Make changes
   npm test  # Run tests
   npm run lint  # Check code style
   ```

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat(profile): add bio editing functionality"
   ```

### Creating the Pull Request

1. **Push to your fork**
   ```bash
   git push origin feature/user-profile-enhancement
   ```

2. **Create PR on GitHub**
   - Use the PR template
   - Provide clear title and description
   - Link related issues
   - Add screenshots for UI changes

### PR Template
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots of UI changes.

## Related Issues
Closes #123
```

### Review Process

1. **Automated Checks**
   - All tests must pass
   - Code must pass linting
   - No merge conflicts

2. **Code Review**
   - At least one maintainer approval required
   - Address all review comments
   - Keep discussions constructive

3. **Merge**
   - Squash and merge for feature branches
   - Rebase and merge for hotfixes

## 🐛 Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Bug Description**
Clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen.

**Actual Behavior**
What actually happens.

**Environment**
- OS: [e.g., iOS 16, Android 12]
- App Version: [e.g., 1.0.0]
- Device: [e.g., iPhone 14, Pixel 6]

**Screenshots**
Add screenshots if applicable.
```

### Issue Labels
- `bug`: Something isn't working
- `enhancement`: New feature or improvement
- `documentation`: Documentation related
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `priority: high/medium/low`: Issue priority

## 💡 Feature Requests

### Feature Request Template
```markdown
**Feature Description**
Clear description of the proposed feature.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other context, mockups, or examples.
```

### Feature Development Process
1. Create feature request issue
2. Discuss with maintainers
3. Get approval before starting work
4. Create feature branch
5. Implement with tests
6. Submit pull request

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test                    # Run all tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:coverage      # With coverage report
```

### Mobile Testing
```bash
cd mobile
npm test                   # Run Jest tests
npm run test:e2e          # End-to-end tests (if configured)
```

### Testing Guidelines
- Write tests for new features
- Maintain test coverage above 80%
- Test both happy path and edge cases
- Use descriptive test names

```javascript
// Good test example
describe('User Authentication', () => {
  it('should return user data when login is successful', async () => {
    const userData = { email: 'test@example.com', password: 'password123' };
    const result = await loginUser(userData);
    
    expect(result.success).toBe(true);
    expect(result.data.email).toBe(userData.email);
  });

  it('should return error when credentials are invalid', async () => {
    const invalidData = { email: 'test@example.com', password: 'wrong' };
    const result = await loginUser(invalidData);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid credentials');
  });
});
```

## 📚 Documentation

### Documentation Standards
- Keep documentation up-to-date with code changes
- Use clear, concise language
- Include code examples
- Add screenshots for UI features

### Types of Documentation
1. **Code Comments**: For complex logic
2. **README Files**: For setup and usage
3. **API Documentation**: For endpoints
4. **Architecture Docs**: For system design

### Writing Guidelines
```javascript
/**
 * Creates a new post with optional image upload
 * @param {Object} postData - The post data
 * @param {string} postData.content - Post text content (max 280 chars)
 * @param {File} [postData.image] - Optional image file
 * @param {string} userId - ID of the user creating the post
 * @returns {Promise<Object>} Created post object
 * @throws {ValidationError} When content exceeds character limit
 */
export const createPost = async (postData, userId) => {
  // Implementation
};
```

## 🏆 Recognition

### Contributor Levels
- **First-time Contributors**: Welcome package and guidance
- **Regular Contributors**: Recognition in releases
- **Maintainers**: Code review and merge permissions
- **Core Team**: Project direction and architecture decisions

### How to Become a Maintainer
1. Consistent quality contributions
2. Help with code reviews
3. Assist other contributors
4. Demonstrate understanding of project goals
5. Nomination by existing maintainers

## 🤝 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord/Slack**: Real-time chat (if available)
- **Email**: For sensitive matters

### Mentorship Program
New contributors can request mentorship for:
- Understanding the codebase
- Learning best practices
- Getting first PR merged
- Career guidance in open source

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (ISC License).

---

## Quick Reference

### Common Commands
```bash
# Setup
git clone <your-fork>
cd social-media-app
npm install

# Development
npm run dev        # Backend
npm start          # Mobile

# Testing
npm test
npm run lint

# Contributing
git checkout -b feature/my-feature
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

### Useful Links
- [Project Repository](https://github.com/your-org/social-media-app)
- [Issue Tracker](https://github.com/your-org/social-media-app/issues)
- [Discussions](https://github.com/your-org/social-media-app/discussions)
- [Documentation](./README.md)

---

Thank you for contributing! Every contribution, no matter how small, helps make this project better. 🚀