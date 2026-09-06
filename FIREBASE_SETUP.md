# Firebase Google Auth Setup Guide for DoToday

## Overview
DoToday now uses **Firebase Google Authentication** exclusively. No demo accounts or email/password login is available.

## Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Create Project"**
3. Enter project name: `DoToday`
4. Click **"Continue"**
5. Enable Google Analytics (optional)
6. Select your account and accept terms
7. Click **"Create project"** - wait for provisioning

### 2. Enable Firestore Database

1. In Firebase Console, click **"Firestore Database"** (left sidebar)
2. Click **"Create database"**
3. **Important**: Choose **"Start in Test Mode"** for development
4. Select region: **`us-east1`** (or nearest to you)
5. Click **"Enable"**

### 3. Enable Google Sign-In Authentication

1. Click **"Authentication"** in the left sidebar
2. Click **"Sign-in method"** tab
3. Under "Sign-in providers", click **"Google"**
4. Toggle **"Enable"** to the ON position
5. Enter your **Project support email** (required)
6. Click **"Save"**

### 4. Get Firebase Web Credentials

1. Click **"Project Settings"** ⚙️ (top right)
2. Click the **"General"** tab
3. Scroll down to **"Your apps"** section
4. Click the **Web** icon (`</>`)
5. Register app name: `DoToday` (click Register)
6. Copy the entire `firebaseConfig` object:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5. Configure Environment Variables

1. In the project root, open or create `.env.local` file
2. Copy the Firebase config values:

```bash
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

3. **IMPORTANT**: Never commit `.env.local` to git (it contains secrets!)

### 6. Start the Development Server

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 7. First Login

1. Click **"Sign in with Google"** button
2. A Google sign-in popup will appear
3. Select your Google account
4. Grant permissions for DoToday
5. You'll be automatically logged in and taken to the dashboard
6. Your user profile will be created in Firestore automatically

## Security Rules Setup

For **development** (Test Mode):
- Firestore Database → Rules tab
- Use the default permissive rules (test mode allows all reads/writes)

For **production** (before deploying):
1. Go to Firestore Database → Rules tab
2. Replace with production-safe rules from `firestore.rules` file:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own documents
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Tasks are readable by authenticated users, writable by creator/assignee
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == resource.data.creatorId || 
                      request.auth.uid in resource.data.assigneeIds;
    }
    
    // Similar rules for projects, comments, activities...
  }
}
```

3. Click **"Publish"**

## Troubleshooting

### "Google Sign-in not enabled"
- Go to Firebase Console → Authentication → Sign-in method
- Make sure Google is toggled ON
- Make sure "Project support email" is filled in

### "Error: auth/api-key-not-valid-please-pass-a-valid-api-key"
- Check `.env.local` has correct Firebase credentials
- Make sure `VITE_` prefix is used (Vite requirement)
- Verify credentials haven't been rotated in Firebase Console

### "Blank page after login"
- Check browser console for errors (F12 → Console)
- Make sure Firestore Database is enabled
- Verify `.env.local` file exists and has all 6 credentials

### "User profile not loading"
- Go to Firestore Database → Collections tab
- Check if `users` collection exists
- Make sure Firestore Rules allow reads from authenticated users
- For test mode, ensure default permissive rules are active

## Verification Checklist

Before deploying to Vercel/Render:

- [ ] Firebase project created
- [ ] Firestore Database enabled (Test Mode)
- [ ] Google Sign-in enabled with support email
- [ ] Web app registered and credentials copied
- [ ] `.env.local` file created with all 6 Firebase variables
- [ ] `npm install` completed
- [ ] `npm run dev` works and shows login screen
- [ ] Google Sign-in popup appears when clicking button
- [ ] Can successfully login with Google account
- [ ] Dashboard appears after login
- [ ] User document visible in Firestore → Collections → users

## Next: Deploy to Vercel

Once local development works:

1. Push code to GitHub (make sure `.env.local` is in `.gitignore`)
2. Go to [vercel.com](https://vercel.com) and connect your repo
3. Add environment variables from `.env.local` in Vercel project settings
4. Deploy - your app will be live at `https://dotoday-{username}.vercel.app`

For detailed Vercel deployment: See `DEPLOYMENT_GUIDE.md`
