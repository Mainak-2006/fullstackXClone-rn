# Deployment Guide

<div align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="60" height="60"/>
  <img src="https://github.com/expo/expo/raw/main/packages/expo/resources/expo-icon.png" alt="Expo" width="60" height="60"/>
  <img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png" alt="Vercel" width="60" height="60"/>
</div>

## Overview

This guide covers deployment strategies for both the backend API and mobile application. The backend is designed for Vercel deployment, while the mobile app can be deployed to app stores or as a web application.

## 🔧 Pre-Deployment Checklist

### Environment Variables
Ensure all required environment variables are configured:

#### Backend (.env)
```env
# Production values
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/social-media
CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLOUDINARY_CLOUD_NAME=your_production_cloud_name
CLOUDINARY_API_KEY=your_production_api_key
CLOUDINARY_API_SECRET=your_production_api_secret
ARCJET_KEY=ajkey_production_...
```

#### Mobile App
Update `app.json` for production:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "privacy": "public",
    "platforms": ["ios", "android", "web"]
  }
}
```

### Security Checklist
- [ ] All API keys are production keys (not test keys)
- [ ] Database is secured with proper authentication
- [ ] CORS is configured for production domains
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Secrets are not committed to version control

---

# 🚀 Backend Deployment

## Vercel Deployment (Recommended)

### 1. Prepare for Deployment

```bash
cd backend
npm install --production
```

### 2. Vercel Configuration

The `vercel.json` file is already configured:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 3. Deploy to Vercel

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd backend
vercel

# For production deployment
vercel --prod
```

#### Option B: GitHub Integration
1. Connect your GitHub repository to Vercel
2. Import the project
3. Set root directory to `backend`
4. Configure environment variables
5. Deploy automatically on push

### 4. Configure Environment Variables

In Vercel Dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add all required variables:
   - `MONGO_URI`
   - `CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `ARCJET_KEY`

### 5. Custom Domain (Optional)

```bash
# Add custom domain
vercel domains add yourdomain.com
vercel domains add api.yourdomain.com
```

## Alternative Deployment Options

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway deploy
```

### Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGO_URI=your_mongo_uri
heroku config:set CLERK_SECRET_KEY=your_clerk_key

# Deploy
git push heroku main
```

### DigitalOcean App Platform

1. Connect GitHub repository
2. Select `backend` folder as source
3. Configure environment variables
4. Deploy

---

# 📱 Mobile App Deployment

## Expo Application Services (EAS)

### 1. Setup EAS

```bash
cd mobile
npm install -g @expo/cli
npm install -g eas-cli

# Login to Expo
eas login

# Initialize EAS
eas build:configure
```

### 2. Configure Build Profiles

Create `eas.json`:

```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "resourceClass": "m1-medium"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m1-medium"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 3. Build for Production

```bash
# Build for all platforms
eas build --platform all --profile production

# Build for specific platform
eas build --platform ios --profile production
eas build --platform android --profile production
```

### 4. Submit to App Stores

#### iOS App Store
```bash
# Submit to App Store Connect
eas submit --platform ios

# You'll need:
# - Apple Developer Account ($99/year)
# - App Store Connect app record
# - App icons and screenshots
```

#### Google Play Store
```bash
# Submit to Google Play
eas submit --platform android

# You'll need:
# - Google Play Developer Account ($25 one-time)
# - Google Play Console app record
# - App icons and screenshots
```

## Web Deployment

### 1. Export for Web

```bash
cd mobile
npx expo export --platform web
```

### 2. Deploy to Vercel

```bash
# Deploy web build to Vercel
cd dist
vercel

# Or configure in vercel.json
```

### 3. Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd dist
netlify deploy --prod
```

---

# 🌍 Environment-Specific Configurations

## Development Environment

```bash
# Backend
cd backend
npm run dev

# Mobile
cd mobile
npm start
```

## Staging Environment

### Backend Staging
```bash
# Deploy to staging branch
vercel --target staging
```

### Mobile Staging
```bash
# Build preview version
eas build --platform all --profile preview
```

## Production Environment

### Backend Production
- Deployed on Vercel with production environment variables
- Custom domain configured
- MongoDB Atlas production cluster
- Production Clerk keys

### Mobile Production
- Built with EAS production profile
- Submitted to app stores
- Production API endpoints configured

---

# 📊 Monitoring & Analytics

## Backend Monitoring

### Vercel Analytics
- Built-in performance monitoring
- Error tracking
- Usage analytics

### External Services
```bash
# Add Sentry for error tracking
npm install @sentry/node

# Add logging service
npm install winston
```

## Mobile App Analytics

### Expo Analytics
```bash
# Install Expo Analytics
npx expo install expo-analytics-segment
```

### Firebase Analytics
```bash
# Install Firebase
npx expo install @react-native-firebase/app
npx expo install @react-native-firebase/analytics
```

---

# 🔄 CI/CD Pipeline

## GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./backend

  build-mobile:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Setup Expo
        uses: expo/expo-github-action@v7
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - name: Build app
        run: |
          cd mobile
          npm install
          eas build --platform all --non-interactive
```

---

# 🐛 Troubleshooting

## Common Backend Issues

### Vercel Function Timeout
```javascript
// Increase timeout in vercel.json
{
  "functions": {
    "src/server.js": {
      "maxDuration": 30
    }
  }
}
```

### Environment Variables Not Loading
```bash
# Check environment variables
vercel env ls

# Add missing variables
vercel env add VARIABLE_NAME
```

### Database Connection Issues
```javascript
// Add connection retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
```

## Common Mobile Issues

### Build Failures
```bash
# Clear cache and rebuild
npx expo install --fix
eas build --clear-cache --platform all
```

### Expo CLI Issues
```bash
# Update Expo CLI
npm install -g @expo/cli@latest

# Clear Expo cache
npx expo install --fix
```

### App Store Rejection
- Ensure app follows platform guidelines
- Test on physical devices
- Provide proper app metadata
- Include privacy policy

---

# 📋 Post-Deployment Checklist

## Backend
- [ ] API endpoints are accessible
- [ ] Database connections work
- [ ] Authentication is functional
- [ ] File uploads work (Cloudinary)
- [ ] Rate limiting is active
- [ ] Error monitoring is set up
- [ ] Custom domain is configured (if applicable)

## Mobile App
- [ ] App builds successfully
- [ ] Authentication works with production API
- [ ] Image uploads function correctly
- [ ] Push notifications work (if implemented)
- [ ] App store metadata is complete
- [ ] App follows platform guidelines
- [ ] Analytics are tracking

## General
- [ ] All environment variables are set
- [ ] Secrets are secure
- [ ] Monitoring is active
- [ ] Backup systems are in place
- [ ] Documentation is updated
- [ ] Team has access to deployment tools

---

# 🔄 Maintenance & Updates

## Regular Maintenance Tasks

### Weekly
- Monitor error logs
- Check performance metrics
- Review security alerts

### Monthly
- Update dependencies
- Review usage analytics
- Optimize performance

### Quarterly
- Security audit
- Backup verification
- Disaster recovery testing

## Update Process

### Backend Updates
```bash
# Test locally first
npm run dev

# Deploy to staging
vercel --target staging

# Deploy to production
vercel --prod
```

### Mobile App Updates
```bash
# Increment version in app.json
# Build new version
eas build --platform all --profile production

# Submit update
eas submit --platform all
```

---

For more specific deployment scenarios or troubleshooting, refer to:
- [Backend Documentation](BACKEND.md)
- [Mobile Documentation](MOBILE.md)
- [API Documentation](API.md)