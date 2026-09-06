# TaskFlow Deployment Guide

## Quick Start - Deploy to Vercel in 5 Minutes

### Step 1: Create Firebase Project (2 min)
1. Go to [firebase.google.com](https://firebase.google.com)
2. Click "Get Started" → Create Project (name: TaskFlow)
3. Enable Firestore Database (Test Mode, region: us-east1)
4. Enable Authentication (Email/Password)
5. Get Web App credentials from Project Settings

### Step 2: Prepare Environment Variables (1 min)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Step 3: Deploy to Vercel (2 min)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → "New Project"
3. Import Git repository
4. Add environment variables from Step 2
5. Click "Deploy"

**Live at**: `https://taskflow-{username}.vercel.app` ✨

---

## Full Deployment Guide

### Prerequisites
- GitHub account
- Vercel account (free)
- Firebase account (free)
- Node.js 18+

### Database Setup (Firestore)

#### Create Database
```
Firebase Console → Firestore Database → Create Database
- Start Mode: Test Mode (development)
- Region: us-east1 (or nearest)
```

#### Collections Structure
```
firestore/
├── users/
│   └── {userId}
│       ├── id
│       ├── username
│       ├── email
│       ├── role
│       ├── avatar
│       └── createdAt
├── tasks/
│   └── {taskId}
│       ├── title
│       ├── description
│       ├── status
│       ├── priority
│       ├── projectId
│       ├── assignedTo
│       ├── dueDate
│       └── createdAt
├── projects/
│   └── {projectId}
│       ├── name
│       ├── description
│       ├── color
│       ├── members[]
│       └── createdAt
├── comments/
│   └── {commentId}
│       ├── taskId
│       ├── authorId
│       ├── text
│       └── createdAt
└── activities/
    └── {activityId}
        ├── action
        ├── userId
        ├── targetId
        └── timestamp
```

### Security Configuration

#### Enable Production Mode
When ready for production:
1. Firebase Console → Firestore Database → Rules
2. Update to Production Mode rules
3. Deploy with `firebase deploy --only firestore:rules`

#### Firestore Rules
See `firestore.rules` file in project root for security rules.

### Frontend Configuration

#### Environment Variables (Local)
Create `.env.local`:
```
VITE_FIREBASE_API_KEY=your_value
VITE_FIREBASE_AUTH_DOMAIN=your_value
VITE_FIREBASE_PROJECT_ID=your_value
VITE_FIREBASE_STORAGE_BUCKET=your_value
VITE_FIREBASE_MESSAGING_SENDER_ID=your_value
VITE_FIREBASE_APP_ID=your_value
```

#### Environment Variables (Vercel)
Project Settings → Environment Variables → Add each variable

### Deployment Steps

#### Option 1: Vercel (Recommended)
```bash
# 1. Push to GitHub
git push origin main

# 2. Visit vercel.com → New Project → Import GitHub repo
# 3. Add environment variables
# 4. Deploy button → Done!

# Your app is live at: https://taskflow-{username}.vercel.app
```

#### Option 2: Firebase Hosting
```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Initialize (creates firebase.json)
firebase init hosting

# 4. Build
npm run build

# 5. Deploy
firebase deploy

# Your app is live at: https://taskflow-{projectId}.firebaseapp.com
```

#### Option 3: Render (Alternative)
1. Connect GitHub to render.com
2. Create "Static Site" service
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables
6. Deploy

### Post-Deployment Checklist

- [ ] Test login with demo account
- [ ] Test create/edit/delete tasks
- [ ] Test project collaboration
- [ ] Test Kanban drag & drop
- [ ] Verify analytics dashboard
- [ ] Monitor Firestore usage
- [ ] Set up alerts
- [ ] Configure backups

### Troubleshooting

**"Firebase Config Missing"**
- Check environment variables in Vercel project settings
- Restart deployment

**"Firestore Permission Denied"**
- Switch Firestore from Test Mode to Production
- Update security rules if needed

**"Build Fails"**
- Check Node version (18+)
- Run `npm install` locally
- Check for TypeScript errors: `npm run lint`

**"Slow Performance"**
- Vercel automatically optimizes
- Check Firestore indexes
- Consider pagination for large datasets

### Monitoring

#### Vercel Analytics
- Vercel Dashboard → Analytics
- Monitor page speed, traffic, errors

#### Firebase Console
- Usage & Quota page
- Real Firestore database size
- Authentication metrics

### Cost Estimation (Free Tier)

| Service | Free Tier | Typical Usage |
|---------|-----------|---------------|
| **Vercel** | 100 GB bandwidth/mo | ✅ Always free |
| **Firebase Auth** | 50k identities | ✅ Free for demo |
| **Firestore** | 50k reads/day, 20k writes/day | ✅ Free for demo |
| **Firebase Storage** | 1 GB | ✅ Free for demo |

**Total**: $0/month for demo projects

### Scaling to Production

When approaching free tier limits:

1. **Enable Blaze Plan** (Firebase)
   - Pay-per-use pricing
   - Auto-scaling

2. **Add Vercel Pro** (optional)
   - Advanced analytics
   - Priority support

3. **Optimize Firestore**
   - Add indexes
   - Implement pagination
   - Cache frequently accessed data

---

## Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Firebase Docs: [firebase.google.com/docs](https://firebase.google.com/docs)
- React Docs: [react.dev](https://react.dev)

