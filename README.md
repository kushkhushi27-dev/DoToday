# TaskFlow - Collaborative Task Management System

A production-grade, full-stack collaborative task management application built with **React 19**, **TypeScript**, **Vite**, **Firebase/Firestore**, **Firebase Authentication**, and **Vercel** for serverless deployment.

Designed with clean component architecture, real-time database updates, modern security patterns (Firebase Auth), and optimized for rapid deployment to Vercel & Render.

---

## 🚀 Key Features

### 1. User Authentication & Authorization
- **Session-Based Authentication**: Secure stateful session management with HTTP-only cookies and CSRF protection.
- **BCrypt Encryption**: Passwords securely hashed with BCrypt (10 rounds).
- **Role-Based Access Control (RBAC)**: Fine-grained authorization using `ROLE_USER` and `ROLE_ADMIN`.
- **Dual Credential Login**: Users can sign in using either their username or email address.
- **Pre-seeded Demo Accounts**: 1-click test credentials on login page for instant preview.

### 2. Task Management
- **Task Lifecycle**: Create, update, view, and delete tasks with instant status toggling.
- **Priority Matrix**: `LOW`, `MEDIUM`, and `HIGH` priority classifications with color-coded badges.
- **Workflow Statuses**: `TODO`, `IN_PROGRESS`, and `COMPLETED` states with automated completion timestamps.
- **Deadlines & Overdue Detection**: Due dates with automatic overdue calculations and "Due Today" highlights.
- **Rich Search & Filters**: Filter tasks dynamically by keyword (title/description/tags), priority, workflow status, and project.
- **Multi-Field Sorting**: Sort tasks by deadline (ASC/DESC), priority, created date, or title.

### 3. Collaborative Projects
- **Team Workspaces**: Create initiatives with custom color accents, goals, and descriptions.
- **Member Management**: Add team members via username or email with project roles (`LEAD`, `MEMBER`).
- **Task Delegation**: Assign tasks to team members with visual avatar identifiers.
- **Interactive Discussions**: Threaded comments on tasks with relative timestamps and author initials.
- **Audit Trails & Activity Logs**: Full historical log tracking task creation, assignments, completions, and member updates.

### 4. Interactive Kanban Board
- **Three-Stage Columns**: Visual columns for `To Do`, `In Progress`, and `Completed`.
- **Drag & Drop**: Native HTML5 drag-and-drop integrated with background status update APIs (`PATCH /api/tasks/{id}/status`).
- **Quick Shift Controls**: Responsive directional controls for instant keyboard/touch status transitions.
- **Project Filter**: Focus the board on individual projects or view across all accessible workspaces.

### 5. Analytics & Dashboard Metrics
- **Real-Time KPIs**: Total tasks, completed tasks, pending tasks, overdue tasks, high-priority tasks, and tasks due today.
- **Progress Gauge**: Visual progress bar showing percentage completion across active projects.
- **High Priority Action Queue**: Direct access to urgent tasks requiring immediate attention.
- **Live Activity Stream**: Real-time audit feed of recent team actions.

### 6. REST API Endpoints
Comprehensive RESTful API for external client integration:
- `GET /api/tasks` — List tasks with search, filter, and sort parameters
- `POST /api/tasks` — Create new task (JSON payload with validation)
- `GET /api/tasks/{id}` — Retrieve detailed task DTO
- `PUT /api/tasks/{id}` — Update existing task
- `PATCH /api/tasks/{id}/status` — Update task status
- `DELETE /api/tasks/{id}` — Delete task
- `GET /api/tasks/{id}/comments` — List comments for task
- `POST /api/tasks/{id}/comments` — Add comment to task
- `GET /api/projects` — List accessible projects
- `POST /api/projects` — Create new project
- `POST /api/projects/{id}/members` — Add member to project
- `GET /api/dashboard/stats` — Retrieve analytics and metrics payload

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + TypeScript | Modern, type-safe UI framework |
| **Build Tool** | Vite | Lightning-fast frontend bundler |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Icons** | Lucide Icons | Clean SVG vector iconography |
| **Backend** | Firebase | Serverless, fully managed cloud platform |
| **Database** | Firestore (NoSQL) | Scalable, real-time cloud database |
| **Authentication** | Firebase Auth | Built-in user authentication & session management |
| **Hosting** | Vercel | Global edge-optimized static hosting |
| **Deployment** | Render / Firebase Hosting | Backend-as-a-service alternatives |

---

## 📐 Architecture Overview

```
src/
├── components/          # React components (UI views)
├── config/              # Firebase configuration
├── services/            # Firebase services (auth, Firestore)
│   ├── authService.ts   # Authentication logic
│   └── firestoreService.ts  # Database operations
├── data/                # Mock data for development/demo
├── types/               # TypeScript type definitions
├── App.tsx              # Main application component
├── main.tsx             # React entry point
└── index.css            # Global styles
```

---

## 🔑 Pre-seeded Demo Accounts

For local development, demo accounts are created automatically. For production, users register via the signup form.

| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin@taskflow.com` | `Admin@123` |
| **Backend Engineer** | `john@taskflow.com` | `User@123` |
| **Product Manager** | `sarah@taskflow.com` | `User@123` |
| **Quality Analyst** | `david@taskflow.com` | `User@123` |

---

## ⚡ Setup & Run Instructions

### Local Development

#### 1. Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account (free tier available at [firebase.google.com](https://firebase.google.com))

#### 2. Firebase Project Setup

1. **Create a Firebase Project**:
   - Go to [Google Cloud Console](https://console.firebase.google.com)
   - Click "Create Project" and name it "TaskFlow"

2. **Enable Firestore Database**:
   - In Firebase Console, select "Firestore Database"
   - Click "Create database"
   - Start in **Test Mode** (for development only)
   - Select a region (e.g., `us-east1`)

3. **Enable Authentication**:
   - Go to "Authentication" → "Sign-in method"
   - Enable **Email/Password**

4. **Get Project Credentials**:
   - Go to Project Settings ⚙️ → "General"
   - Scroll to "Your apps" and click the Web (`</>`) option
   - Copy your config object

#### 3. Environment Variables

Create a `.env.local` file in the project root:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### 4. Install Dependencies & Run

```bash
# Install npm dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

### Deployment to Vercel

#### 1. Connect GitHub Repository

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign up/login
3. Click "New Project" → "Import Git Repository"
4. Select your TaskFlow repository

#### 2. Set Environment Variables in Vercel

1. In Vercel Project Settings → "Environment Variables"
2. Add all Firebase credentials:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

#### 3. Deploy

- Vercel automatically deploys on every git push
- Your app will be live at: `https://taskflow-{your-account}.vercel.app`

---

### Alternative: Deploy to Render or Firebase Hosting

#### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init

# Deploy
firebase deploy
```

#### Render

1. Create account at [render.com](https://render.com)
2. Connect GitHub repo
3. Create "Static Site" service
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Add environment variables
7. Deploy

---

## 🔐 Firestore Security Rules

The project includes `firestore.rules` with security rules:
- Users can only access/modify their own data
- Projects require member authorization
- Tasks are protected with creator/assignee checks
- Comments are read-only for non-authors

**Deploy rules to production:**

```bash
firebase deploy --only firestore:rules
```

---

## 📝 Key Differences from Spring Boot Version

| Aspect | Spring Boot | Firebase/Vercel |
|---|---|---|
| **Backend** | Java server | Serverless functions |
| **Database** | MySQL/MariaDB | Firestore (NoSQL) |
| **Deployment** | Render + Backend setup | Vercel (fronted) + Firebase (backend) |
| **Authentication** | Spring Security | Firebase Auth |
| **Cost** | Server rental | Pay-per-use (usually free tier covers demo) |
| **Scalability** | Manual | Auto-scaling |

---

## 🚀 Production Checklist

- [ ] Enable Firebase security rules (move to Production mode)
- [ ] Set up Firebase backup & restore
- [ ] Configure domain name
- [ ] Enable HTTPS (automatic on Vercel & Firebase)
- [ ] Set up monitoring & alerts
- [ ] Configure email verification
- [ ] Add password reset flow
- [ ] Implement activity logging

---

## ⚡ Setup & Run Instructions - Local Development

### 1. Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account (free tier available at [firebase.google.com](https://firebase.google.com))

### 2. Firebase Project Setup

1. **Create a Firebase Project**:
   - Go to [Google Cloud Console](https://console.firebase.google.com)
   - Click "Create Project"
   - Name it "TaskFlow" and create

2. **Enable Firestore Database**:
   - In Firebase Console, select "Firestore Database"
   - Click "Create database"
   - Start in **Test Mode** (for development)
   - Select a region (e.g., `us-east1`)

3. **Enable Authentication**:
   - Go to "Authentication" → "Sign-in method"
   - Enable **Email/Password**

4. **Get Project Credentials**:
   - Go to Project Settings ⚙️ → "General"
   - Scroll to "Your apps" and select Web (`</>`)
