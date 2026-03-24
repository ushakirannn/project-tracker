# Project Knowledge & Sprint Tracking System

An internal project management system designed for small tech teams to track projects, sprints, tasks, releases, and discussions — replacing informal verbal tracking with a single source of truth.

## What It Solves

- **CEO view**: "What is happening in the company right now?"
- **Developer view**: "What tasks am I working on in this sprint?"
- **Historical view**: "What features were released previously and why?"

## Features

- **Dashboard** — Real-time stats, active sprints, my tasks, upcoming deadlines, recent activity
- **Projects** — CRUD with status tracking (active/on-hold/completed/archived), repo links, production URLs
- **Tasks** — Full lifecycle management with status, priority, category, assignee, deadline extensions, attachments, tags
- **Sprints** — Two sprints per month, planning → active → completed lifecycle
- **Releases** — Version tracking with changelogs tied to sprints
- **Discussions** — Project-based threads with comments, create tasks directly from discussions
- **Activity Timeline** — Automatic audit log of all changes across the system
- **Global Search** — Full-text search across projects, tasks, discussions, releases
- **Roadmap** — Planning with status override capability and target dates
- **Metrics** — Project metric tracking with snapshot history and percentage change

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 21 + TypeScript |
| Backend | Node.js + Express 5 |
| Database | MongoDB (Mongoose) |
| Auth | Google OAuth 2.0 + JWT |

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Google OAuth credentials (from [Google Cloud Console](https://console.cloud.google.com/))

## Setup & Run

### 1. Backend

```bash
cd project-tracker/server

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI, Google OAuth credentials, and JWT secret

# Start server
npm run dev
```

Server runs at `http://localhost:5000`

### 2. Frontend

```bash
cd project-tracker/client

# Install dependencies
npm install

# Start dev server
ng serve
```

App opens at `http://localhost:4200`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GOOGLE_CALLBACK_URL` | OAuth callback URL (e.g. `http://localhost:5000/api/auth/google/callback`) |
| `CLIENT_URL` | Frontend URL (e.g. `http://localhost:4200`) |

## API Endpoints

| Route | Description |
|-------|-------------|
| `GET /api/health` | Health check |
| `/api/auth/*` | Google OAuth login, callback, current user, logout |
| `/api/projects/*` | CRUD for projects |
| `/api/tasks/*` | CRUD for tasks with filters (status, priority, assignee, sprint, project, tags) |
| `/api/sprints/*` | CRUD for sprints, get current active sprint |
| `/api/releases/*` | CRUD for releases, by project |
| `/api/discussions/*` | CRUD for discussions, comments, create task from discussion |
| `/api/activities/*` | Activity timeline, entity-specific activities |
| `/api/dashboard/*` | Stats, project overview, my tasks, upcoming deadlines |
| `/api/search?q=` | Global full-text search |
| `/api/roadmap/*` | Roadmap items with status override |
| `/api/metrics/*` | Project metrics and snapshots |

## Project Structure

```
project-tracker/
├── client/                     # Angular frontend
│   └── src/app/
│       ├── core/               # Guards, interceptors, models, services
│       ├── features/           # Feature modules
│       │   ├── auth/           # Google login + callback
│       │   ├── dashboard/      # Dashboard with stats
│       │   ├── projects/       # Project list, detail, form
│       │   ├── tasks/          # Task list, board, detail, form
│       │   ├── sprints/        # Sprint list, detail, form
│       │   ├── releases/       # Release list, detail, form
│       │   ├── discussions/    # Discussion threads + comments
│       │   ├── activity/       # Activity timeline
│       │   └── search/         # Global search
│       └── shared/             # Header, sidebar, status badge, etc.
├── server/                     # Express backend
│   └── src/
│       ├── config/             # DB, passport, env config
│       ├── controllers/        # Route handlers (11 controllers)
│       ├── middleware/          # Auth, activity logging, error handler
│       ├── models/             # Mongoose schemas (11 models)
│       └── routes/             # API routes (11 route files)
└── shared/                     # Shared TypeScript types
```

## Auth Flow

1. User clicks "Sign in with Google"
2. Redirects to Google OAuth consent screen
3. Google callback creates/finds user in MongoDB
4. Backend generates 7-day JWT token
5. Token stored in localStorage, sent in Authorization header
6. Role-based access: `developer`, `manager`, `ceo`

## Database Models

- **User** — name, email, googleId, avatar, role
- **Project** — name, description, status, owner, repo/prod links
- **Task** — title, status, priority, category, assignee, sprint, deadline, attachments, tags
- **Sprint** — name, dates, status (planning/active/completed)
- **Release** — project, sprint, version, changes
- **Discussion** — project, title, content, linked task
- **Comment** — discussion thread replies
- **Activity** — audit log with entity tracking and metadata
- **RoadmapItem** — project planning with status override
- **ProjectMetric / MetricSnapshot** — metric tracking with change calculation
