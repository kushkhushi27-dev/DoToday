# TaskFlow - Collaborative Task Management System

A production-grade, full-stack collaborative task management application built with **Java 17**, **Spring Boot 3**, **Spring Security**, **Spring Data JPA / Hibernate**, **MariaDB / MySQL**, and **Thymeleaf**.

Designed with clean layered software architecture, enterprise security patterns, robust exception handling, and comprehensive automated test suites.

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
