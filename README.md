# DoToday - Modern Collaborative Task & Project Management

A high-performance, full-stack collaborative task and workspace management application built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, **Firebase Authentication**, and **Cloud Firestore**.

Designed with modern component architecture, real-time database subscriptions, smooth dark/light theme switching, and a frictionless **Guest Exploration Mode** that allows visitors to tour the app before signing in.

---

## 🚀 Key Features

### 1. Guest Exploration & Frictionless Onboarding
- **Instant Preview**: Visitors can immediately explore the dashboard, Kanban board, project workspaces, calendar, and analytics without having to log in first.
- **Contextual Auth Interception**: When a guest attempts to create, update, delete, or comment, a non-intrusive Google Authentication modal appears seamlessly.
- **Enterprise Google OAuth 2.0**: One-click Google sign-in with automatic profile synchronization to Cloud Firestore. Zero passwords to store or manage.

### 2. Task Management & Productivity
- **Complete Task Lifecycle**: Create, edit, assign, prioritize, and toggle completion with instant UI feedback.
- **Priority & Status Tracking**: Classify by `LOW`, `MEDIUM`, and `HIGH` priority with visual color badges; progress through `TODO`, `IN_PROGRESS`, and `COMPLETED`.
- **Due Date Tracking**: Automated overdue detection and "Due Today" badges.
- **Dynamic Search & Multi-Field Sorting**: Search across task titles, descriptions, and tags; sort by deadline, priority, created date, or title.

### 3. Interactive Kanban Board
- **Three-Stage Workflow**: Dedicated columns for `To Do`, `In Progress`, and `Completed`.
- **Drag & Drop**: Native drag-and-drop task status updates with persistent Firestore synchronization.
- **Quick Shift Controls**: Responsive directional controls for rapid status progression on desktop and mobile devices.

### 4. Collaborative Projects & Workspaces
- **Project Isolation**: Group tasks by project with custom color themes, descriptions, and milestones.
- **Member Delegation**: Assign tasks to team members with visual avatar identifiers and initials.
- **Threaded Discussions**: Add comments and notes to specific tasks with relative timestamps.
- **Audit Trails**: Live activity stream capturing task creations, status transitions, assignments, and updates.

### 5. Analytics & Calendar
- **Real-Time KPIs**: Total tasks, completion rate, overdue warnings, high-priority counts, and tasks due today.
- **Interactive Calendar View**: Month-by-month grid displaying scheduled tasks and deadlines.
- **Theme Support**: Seamless dark mode and light mode toggling with persistent preferences.
- **PWA Ready**: Complete high-resolution favicon suite and Web App Manifest (`site.webmanifest`).

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend UI** | React 19 + TypeScript | Component-based, fully type-safe user interface |
| **Bundler & Tooling** | Vite 6 | Lightning-fast HMR and optimized production bundling |
| **Styling** | Tailwind CSS | Modern utility-first styling with dark mode support |
| **Icons** | Lucide React | High-performance SVG iconography |
| **Authentication** | Firebase Auth | Secure OAuth 2.0 Google sign-in & session management |
| **Database** | Cloud Firestore | Real-time NoSQL cloud database with document security |
| **Deployment** | Vercel / Netlify / Render | Edge-optimized static hosting with automated CI/CD |

---

## 📐 Project Structure

```
DoToday/
├── public/                  # Static assets & PWA suite
│   ├── favicon.svg          # Modern SVG icon
│   ├── favicon.ico          # Legacy multi-res ICO
│   ├── favicon-96x96.png    # High-DPI favicon
│   ├── apple-touch-icon.png # iOS home screen icon
│   └── site.webmanifest     # PWA manifest
├── src/
│   ├── components/          # Modular React components
│   │   ├── ActivityView.tsx     # Recent activity logs feed
│   │   ├── AnalyticsView.tsx    # Productivity charts & KPIs
│   │   ├── AuthModal.tsx        # Contextual Google login modal
│   │   ├── CalendarView.tsx     # Calendar schedule view
│   │   ├── DashboardView.tsx    # Main KPI dashboard
│   │   ├── Header.tsx           # Global app navigation & user profile
│   │   ├── KanbanBoard.tsx      # Drag-and-drop Kanban workflow
│   │   ├── ProjectList.tsx      # Project workspaces grid
│   │   ├── Sidebar.tsx          # Collapsible navigation drawer
│   │   ├── TaskList.tsx         # Filterable & sortable task table
│   │   └── ...                  # Modals & UI utilities
│   ├── context/             # Global React Context providers
│   │   ├── AuthContext.tsx      # Firebase Auth state & user profile sync
│   │   └── ThemeContext.tsx     # Dark/Light theme state
│   ├── data/                # Mock & fallback demo datasets
│   │   └── guestDemoData.ts     # Curated demo data for Guest Mode
│   ├── lib/                 # Core infrastructure
│   │   └── firebase.ts          # Firebase SDK initialization & validation
│   ├── services/            # Firestore data access services
│   │   └── firestoreService.ts  # CRUD operations for tasks, projects & logs
│   ├── types/               # TypeScript interfaces & domain types
│   ├── App.tsx              # Root app component & state orchestration
│   ├── index.css            # Tailwind directives & theme styles
│   └── main.tsx             # Application entry point
├── .env.example             # Environment configuration template
├── firestore.rules          # Cloud Firestore security rules
├── index.html               # Main HTML document with SEO & PWA tags
├── package.json             # Dependencies and build scripts
├── tsconfig.json            # TypeScript compiler configuration
├── vercel.json              # Vercel deployment routing configuration
└── vite.config.ts           # Vite bundler configuration
```

---

## ⚡ Quick Start & Local Development

### 1. Prerequisites
- **Node.js**: v18.0 or newer (v20+ recommended)
- **npm**: v9 or newer
- **Firebase Account**: Free tier at [firebase.google.com](https://firebase.google.com)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/DoToday.git
cd DoToday
npm install
```

### 3. Configure Environment Variables
Create a local `.env.local` file from the provided template:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Firebase web credentials from the [Firebase Console](https://console.firebase.google.com/) (*Project Settings > General > Your Apps > Web App*):

```env
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=1:your-messaging-sender-id:web:your-web-app-id
```

> [!NOTE]
> `.env.local` is strictly ignored by `.gitignore` to prevent any sensitive API keys or project identifiers from being committed to source control.

### 4. Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000` (or `http://localhost:5173`).

---

## 🔒 Firebase Configuration & Security

### 1. Enable Google Authentication
1. In the Firebase Console, navigate to **Build > Authentication > Sign-in method**.
2. Click **Add new provider** and select **Google**.
3. Enable the provider, select your project support email, and save.
4. Under **Settings > Authorized domains**, ensure your local domain (`localhost`) and production domain (e.g. `your-app.vercel.app`) are listed.

### 2. Firestore Security Rules
The repository includes production-ready Firestore rules in `firestore.rules`.
- Read access is enabled for authenticated users on authorized collections.
- Write access requires authenticated identity matching (`request.auth.uid == resource.data.userId` or project membership).

Deploy the rules using the Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## 🚢 Production Deployment

### Deploying to Vercel (Recommended)
1. Push your repository to GitHub.
2. In [Vercel](https://vercel.com), import your `DoToday` repository.
3. Configure the **Environment Variables** in Vercel with your Firebase configuration keys:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Click **Deploy**. Vercel will build and deploy the app with automatic SSL and global CDN caching.

### Deploying to Firebase Hosting
```bash
npm run build
firebase init hosting
firebase deploy --only hosting
```

---

## 🧪 Build & Linting Verification

Run TypeScript compilation and production packaging:
```bash
# Typecheck TypeScript source
npm run lint

# Build production bundle to dist/
npm run build

# Preview production bundle locally
npm run preview
```
