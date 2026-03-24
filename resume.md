# Project Tracker — Session Resume

## Date: 2026-03-10

## What Was Built
A complete Internal Project Tracking System for a small team (3 devs, 1 manager, 1 CEO) across multiple products (GRE, SAT, TOEFL apps). All 9 phases are implemented and working.

## Tech Stack
- **Frontend**: Angular 19+ (standalone components, signals, new control flow)
- **Backend**: Express 5.x + Mongoose 9.x
- **Database**: MongoDB 8.2.5 (local, installed as Windows service)
- **Auth**: Google OAuth via Passport.js + JWT
- **CSS**: Custom design system with CSS variables (no UI framework)

## Project Location
`E:\ENTRYAN\Project Knowledge And Sprint Tracking System\project-tracker\`

## All 9 Phases — COMPLETE
1. **Scaffolding + Auth** — Google OAuth, JWT, login page, sidebar, header, CSS design system
2. **Projects** — CRUD, list with status filters, detail page with 5 tabs (overview, tasks, releases, discussions, activity)
3. **Tasks** — CRUD, 5 filters, table view, kanban board with drag-drop, quick status update
4. **Sprints** — CRUD, auto-prefill dates (2/month), detail with tasks grouped by status, progress bar
5. **Dashboard** — Project stats, task summary, current sprint progress, recent activity feed
6. **Releases** — CRUD, changelog, per-project view, wired into project detail tabs
7. **Discussions** — CRUD, comment threads, "Create Task from Discussion" feature, linked task badge
8. **Activity Timeline** — Global feed, entity type & limit filters, color-coded icons, clickable links
9. **Global Search** — Ctrl+K shortcut, search across all entities, results grouped by type

## How to Run
1. MongoDB should be running (installed as Windows service, auto-starts)
2. Server: `cd project-tracker/server && npm run dev` (port 5000)
3. Client: `cd project-tracker/client && npx ng serve` (port 4200)
4. Open http://localhost:4200

## Google OAuth
- Credentials already configured in `server/.env`
- Client ID: `370309206268-a1uuj4qc4ah67sgaoha3keugbttrppg1.apps.googleusercontent.com`
- Redirect URI: `http://localhost:5000/api/auth/google/callback`

## Key Files
| Purpose | Path |
|---------|------|
| Server entry | `server/src/app.js` |
| Models | `server/src/models/*.js` (User, Project, Task, Sprint, Release, Discussion, Comment, Activity) |
| Controllers | `server/src/controllers/*.controller.js` |
| Routes | `server/src/routes/*.js` |
| Angular routes | `client/src/app/app.routes.ts` |
| Auth service | `client/src/app/core/services/auth.service.ts` |
| CSS tokens | `client/src/styles/_variables.css` |
| Env config | `server/.env` |
| Full plan | `C:\Users\ushak\.claude\plans\federated-mixing-aurora.md` |

## Bugs Fixed During Session
- Login page didn't redirect when already authenticated → added `ngOnInit` check in `login.component.ts`
- Auth callback navigated before user data loaded (race condition) → moved navigation into `loadUser` callback
- Sidebar icons rendered as text labels → replaced with Unicode characters

## What's Next — UI/UX Improvements
User wants to polish the UI tomorrow. Potential areas:
- Sidebar icons (currently Unicode, could upgrade to SVG or icon library)
- Overall visual polish and spacing
- Any UX flows that feel clunky
- Responsive design tweaks
- Whatever the user wants to improve
