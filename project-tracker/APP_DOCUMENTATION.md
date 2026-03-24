# Project Tracker — Complete Feature & Usage Documentation

An internal project management system built for a small team (developers, manager, CEO) managing multiple products. Built with Angular 19+ frontend, Express 5 backend, and MongoDB.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Authentication](#2-authentication)
3. [Dashboard](#3-dashboard)
4. [Projects](#4-projects)
5. [Tasks](#5-tasks)
6. [Sprints](#6-sprints)
7. [Releases](#7-releases)
8. [Discussions](#8-discussions)
9. [Roadmap](#9-roadmap)
10. [Project Metrics](#10-project-metrics)
11. [Activity Timeline](#11-activity-timeline)
12. [Global Search](#12-global-search)
13. [Data Model Reference](#13-data-model-reference)

---

## 1. Getting Started

### Prerequisites

- **MongoDB** running locally on port 27017 (installed as a Windows service)
- **Google OAuth** credentials configured in `server/.env`
- **Node.js** installed

### Running the Application

Start the backend server:

```
cd server
npm run dev
```

Server runs on **http://localhost:5000**

Start the frontend:

```
cd client
npx ng serve
```

Client runs on **http://localhost:4200**

### Tech Stack

| Layer    | Technology                       |
|----------|----------------------------------|
| Frontend | Angular 19+ (standalone components, signals, new control flow) |
| Backend  | Express 5.x + Mongoose 9.x      |
| Database | MongoDB 8.2.5                    |
| Auth     | Google OAuth 2.0 + JWT           |
| CSS      | Custom design system with CSS variables (no UI framework) |

---

## 2. Authentication

### Google OAuth Login

The app uses Google OAuth 2.0 for authentication. There are no local username/password accounts.

**How to log in:**

1. Open the app at `http://localhost:4200`
2. Click **"Sign in with Google"** on the login page
3. Select your Google account
4. You are redirected to the dashboard

**How it works behind the scenes:**

- The login button redirects to `server/api/auth/google`
- Google authenticates the user and returns to the callback URL
- The server creates or finds the user in MongoDB, generates a JWT token
- The token is stored as an HTTP cookie
- The frontend reads the user info and stores it in the `AuthService`

**User roles:** Each user has a role — `developer`, `manager`, or `ceo`. Roles are informational and displayed in the sidebar.

**Logging out:** Click the **Logout** button at the bottom of the sidebar. This clears the JWT cookie and redirects to the login page.

**Session persistence:** If you're already logged in and visit the login page, you are automatically redirected to the dashboard.

---

## 3. Dashboard

The dashboard is the home page after login. It provides a high-level overview of everything happening across your projects.

### Welcome Header

Displays a personalized greeting: "Welcome back, [Your Name]"

### Stats Grid (Top Row)

Four clickable stat cards:

| Card | Shows | Clicks to |
|------|-------|-----------|
| Total Projects | Count of all projects | Projects list |
| Active Projects | Projects with status "active" | Projects list (filtered) |
| Total Tasks | Count of all tasks | Tasks list |
| Blocked Tasks | Tasks with status "blocked" | Tasks list (filtered) |

### Projects Overview Table

A table showing all projects with key information at a glance:

| Column | Description |
|--------|-------------|
| Project | Project name (clickable, navigates to project detail) |
| Status | Color-coded badge (Active = green, On Hold = amber, Completed = gray) |
| Current Focus | The manually set focus text for the project (truncated to 2 lines) |
| Open Tasks | Count of non-completed tasks (blue if > 0) |
| Current Sprint | Name of the currently active sprint |
| Last Release | Version number of the most recent release |

### My Tasks Widget

Shows all tasks assigned to the logged-in user that are not yet completed.

- Sorted by priority (critical first) then by deadline
- Each task shows: title, project name, status, priority badge, deadline
- Priority badges are color-coded: critical (dark red), high (red), medium (orange), low (gray)
- Click any task to navigate to its detail page

### Upcoming Deadlines Widget

Shows tasks with deadlines within the next 7 days.

- Sorted by deadline (soonest first)
- Shows task title, project, assignee, deadline date
- Color coding: overdue = red, due within 2 days = orange

### Upcoming Roadmap Items Widget

Shows roadmap items from all projects that have a start date within the next 30 days and are not yet completed.

- Each item shows: project name, initiative title, status badge, task progress (completed/total), target date
- Click an item to navigate to the project page
- Status badges: Planned (gray), In Progress (blue), Completed (green), Delayed (red)

### Current Sprint Widget

Shows the active sprint with:

- Sprint name and date range
- Progress bar with percentage
- Mini stats: Planned, In Progress, Blocked, Done counts
- "View" button to navigate to sprint detail

### Task Summary Widget

A breakdown of all tasks by status with color-coded dots:

- Planned (gray)
- In Progress (blue)
- Blocked (red)
- Testing (amber)
- Completed (green)

### Recent Activity Widget

Shows the last 15 activities across the entire system:

- Entity type icon (PRJ, TSK, SPR, REL, DSC, CMT)
- User name, action, entity name
- Timestamp

---

## 4. Projects

### Projects List Page

**URL:** `/projects`

Displays all projects as cards in a responsive grid layout.

**Filter buttons** at the top filter by status:
- All (default)
- Active
- On Hold
- Completed
- Archived

Each project card shows:
- Project name
- Status badge
- Description (truncated to 2 lines)
- Meta info: Owner name, task count, creation date

Click a card to view the project detail page.

**"+ New Project"** button in the header navigates to the project creation form.

### Project Form (Create / Edit)

**URL:** `/projects/new` or `/projects/:id/edit`

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Project Name | Text | Yes | Name of the project |
| Description | Textarea | No | What this project is about |
| Owner | Dropdown | Yes | Select from team members |
| Status | Dropdown | Yes | active, on-hold, completed, archived |
| Start Date | Date picker | No | When the project started |
| Repository Link | URL | No | Git repository URL |
| Production URL | URL | No | Live app URL |
| Current Focus | Textarea | No | What the team is currently working on |

### Project Detail Page

**URL:** `/projects/:id`

**Header:** Project name, status badge, Edit and Delete buttons.

**7 Tabs:**

#### Overview Tab

- **Current Focus Card:** Shows the team's current focus with inline editing. Click "Edit Focus" to modify, then Save/Cancel. Blue left border for visual emphasis.
- **Active Roadmap Initiative Card:** Automatically shows the roadmap item with status "in_progress" for this project. Displays title, description, status badge, task progress, and target date. Click "View Roadmap" to switch to the Roadmap tab.
- **About Card:** Project description.
- **Details Card:** Owner, status, start date, created date, repository link, production URL.

#### Tasks Tab

Lists all tasks belonging to this project. Each task shows title, category, assignee, priority badge, and status badge. Click any task to navigate to its detail page.

**"+ Add Task"** button creates a new task pre-filled with this project.

#### Releases Tab

Lists all releases for this project. Each release shows version, release date, and description.

**"+ Add Release"** creates a new release pre-filled with this project.

#### Discussions Tab

Lists all discussions for this project. Each discussion shows title, author, date, and a "Has Task" badge if a task was created from it.

**"+ New Discussion"** creates a discussion pre-filled with this project.

#### Metrics Tab

Manage key performance indicators (KPIs) for the project.

**"+ Add Metric"** opens an inline form to define a new metric:
- Metric Name (e.g., "Signups")
- Unit (e.g., "users/day")

The metrics table shows:

| Column | Description |
|--------|-------------|
| Metric | Name of the metric |
| Unit | Measurement unit |
| Current Value | Latest recorded value |
| Previous Value | Previous recorded value |
| Change | Percentage change (green = positive, red = negative) |
| Release | Which release the values came from |

Each metric can be edited or deleted.

Metric values are recorded when creating/editing releases (see [Releases](#7-releases)).

#### Roadmap Tab

See [Roadmap](#9-roadmap) section for full details.

#### Activity Tab

Shows all activity log entries related to this project. Each entry shows: user name, action, entity name, and timestamp.

### Deleting a Project

Click "Delete" in the project header. A confirmation modal appears warning that the action cannot be undone. Click "Delete" to confirm or "Cancel" to abort.

---

## 5. Tasks

### Task List Page

**URL:** `/tasks`

A full-width table showing all tasks with filtering capabilities.

**Filters (top bar):**

| Filter | Type | Options |
|--------|------|---------|
| Project | Dropdown | All projects + "All Projects" default |
| Status | Dropdown | planned, in-progress, blocked, testing, completed |
| Priority | Dropdown | low, medium, high, critical |
| Category | Dropdown | feature, bug, improvement, research, maintenance |
| Tags | Text input | Type a tag name to filter |

**Table columns:**

| Column | Description |
|--------|-------------|
| Title | Task title (truncated with ellipsis if too long) |
| Project | Project name |
| Status | Status badge |
| Priority | Priority badge |
| Category | Feature, bug, etc. |
| Assignee | Assigned user name or "Unassigned" (italic) |
| Tags | Color-coded tag badges |
| Deadline | Due date |

Click any row to navigate to the task detail page.

### Task Board (Kanban View)

**URL:** `/tasks/board`

A 5-column Kanban board showing all tasks organized by status.

**Columns:** Planned | In Progress | Blocked | Testing | Completed

Each column has:
- Color-coded dot header
- Task count badge
- Draggable task cards

**Task cards show:**
- Title
- Project name
- Assignee

**Project filter** dropdown at the top to filter by project.

**Drag and drop:** Drag a card from one column to another to update its status. Uses optimistic UI — the card moves immediately and rolls back if the server update fails.

### Task Form (Create / Edit)

**URL:** `/tasks/new` or `/tasks/:id/edit`

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Task Title | Text | Yes | What needs to be done |
| Description | Textarea | No | Detailed description |
| Project | Dropdown | No | Select project or "Miscellaneous" |
| Assigned To | Dropdown | No | Select team member or "Unassigned" |
| Status | Dropdown | Yes | planned, in-progress, blocked, testing, completed |
| Priority | Dropdown | Yes | low, medium, high, critical |
| Category | Dropdown | No | feature, bug, improvement, research, maintenance |
| Roadmap Initiative | Dropdown | No | Only appears when a project is selected and has roadmap items |
| Sprint | Dropdown | No | Assign to a sprint |
| Start Date | Date picker | No | When work begins |
| Deadline | Date picker | No | When it's due |
| Tags | Tag input | No | Press Enter or comma to add tags |

**Smart pre-fill:** The form reads query parameters to pre-fill:
- `?project=ID` — Pre-selects the project
- `?sprint=ID` — Pre-selects the sprint
- `?roadmapItem=ID` — Pre-selects the roadmap initiative

**Roadmap linking:** When you select a project, the "Roadmap Initiative" dropdown loads with that project's roadmap items. Selecting one links the task to that initiative.

**Tags:** Type a tag and press Enter or comma to add it. Tags appear as chips that can be removed with the X button.

### Task Detail Page

**URL:** `/tasks/:id`

**Header:** Task title with Edit and Delete actions.

**Quick Status Update:** A row of 5 status buttons. Click any status to instantly update the task. The active status is highlighted.

**Layout:** Two-column grid.

- **Left column:** Description
- **Right column:** Details sidebar showing all task metadata (project, status, priority, category, assignee, sprint, roadmap item, dates, tags, created by)

**Delete:** Confirmation modal before deletion.

### Quick Task Creation (Global)

From **any page**, click the **"+ Create Task"** button in the header bar to open a quick creation modal.

**Quick task modal fields:**
- Task Title (required)
- Project (optional — defaults to "Miscellaneous")
- Assign To (optional)
- Priority (defaults to Medium)
- Sprint (optional)
- Deadline (optional)

After creation, the page reloads to reflect the new task. The modal closes automatically.

---

## 6. Sprints

### Sprint List Page

**URL:** `/sprints`

Displays sprints as cards in a responsive grid.

**Filter buttons:** All, Planning, Active, Completed

Each card shows:
- Sprint name
- Status badge
- Date range (start — end)
- Duration info

**"+ New Sprint"** button to create a sprint.

### Sprint Form (Create / Edit)

**URL:** `/sprints/new` or `/sprints/:id/edit`

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Sprint Name | Text | Yes | e.g., "March Sprint 1" |
| Start Date | Date picker | Yes | Sprint start |
| End Date | Date picker | Yes | Sprint end |
| Status | Dropdown | Yes | planning, active, completed |

**Auto-prefill:** When creating a new sprint, start/end dates are automatically calculated for a 2-week sprint cycle (2 sprints per month).

### Sprint Detail Page

**URL:** `/sprints/:id`

**Header:** Sprint name, status badge, and action buttons:
- **+ Add Task** — Creates a new task pre-assigned to this sprint
- **Edit** — Edit sprint details
- **Delete** — Delete sprint (with confirmation)

**Sprint Info:** Date range display.

**Stats Row (4 cards):**
- Total tasks
- Completed (green)
- In Progress (blue)
- Blocked (red)

**Progress Bar:** Visual progress with percentage.

**View Toggle:** Switch between Board and List views.

#### Board View (Kanban)

4 columns: Planned, In Progress, Blocked/Testing, Completed

Each card shows:
- Task title
- Project name
- Priority badge
- Assignee
- Deadline (if set)

**Drag and drop** to change task status. Optimistic UI with rollback on failure.

#### List View

Tasks grouped by status. Each group shows a header with count. Tasks display title, project, priority, and assignee.

---

## 7. Releases

### Release List Page

**URL:** `/releases`

Displays releases as cards sorted by date.

**Project filter** dropdown to filter by project.

Each card shows:
- Version number (e.g., "v1.3")
- Project name badge
- Release date
- Description (if set)
- Change items as green badges (first few, with "+N more" overflow)

### Release Form (Create / Edit)

**URL:** `/releases/new` or `/releases/:id/edit`

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Project | Dropdown | Yes | Which project this release belongs to |
| Version | Text | Yes | Version string (e.g., "v1.3") |
| Release Date | Date picker | Yes | When the release happened |
| Description | Textarea | No | Release summary |
| Changes | Textarea | No | One change per line — becomes a changelog list |

**Metric Impact Section:**

When you select a project that has defined metrics, a "Metric Impact" section appears below the main form. For each metric:

| Field | Description |
|-------|-------------|
| Previous Value | The value before this release |
| Current Value | The value after this release |
| % Change | Auto-calculated and displayed as a badge (green = up, red = down) |

These metric snapshots are saved alongside the release and appear in the project's Metrics tab and the release detail page.

### Release Detail Page

**URL:** `/releases/:id`

Shows full release details:
- Version, project, release date
- Description
- Changelog (list of changes)
- **Metric Impact table** (if metrics were recorded): metric name, unit, previous value, current value, percentage change with color coding

---

## 8. Discussions

### Discussion List Page

**URL:** `/discussions`

Displays discussions as cards.

**Project filter** dropdown to filter by project.

Each card shows:
- Title
- Project badge
- Content preview (truncated to 2 lines)
- Footer: author, date, comment count
- "Has Task" badge if a task was created from the discussion

### Discussion Form (Create / Edit)

**URL:** `/discussions/new` or `/discussions/:id/edit`

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Project | Dropdown | Yes | Which project this discussion belongs to |
| Title | Text | Yes | Discussion title |
| Content | Textarea | Yes | Full discussion content |

### Discussion Detail Page

**URL:** `/discussions/:id`

**Header:** Discussion title with action buttons:
- **Create Task** — Creates a task from this discussion (only if no task linked yet)
- **View Linked Task** — Navigate to the linked task (if one exists)
- **Edit / Delete**

**Discussion body:** Full content display with metadata (project link, author, date).

**Comments section:**
- List of all comments with author name, date, and content
- **Post Comment** form at the bottom with a textarea and submit button

**Creating a task from a discussion:**
1. Click "Create Task"
2. A modal appears with a pre-filled title
3. Edit the title if needed, then click "Create"
4. The task is created and linked to the discussion
5. A "Has Task" badge appears on the discussion

---

## 9. Roadmap

The Roadmap feature allows you to plan and track high-level strategic initiatives for each project. Roadmap items represent **major initiatives** — they are higher level than individual tasks but more concrete than a long-term vision.

### Accessing the Roadmap

Navigate to any project's detail page and click the **Roadmap** tab.

### Creating a Roadmap Item

1. Click **"+ Add Roadmap Item"**
2. Fill in the form:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Title | Text | Yes | Initiative name (e.g., "Lead Magnet Improvements") |
| Description | Textarea | No | What this initiative involves |
| Priority | Dropdown | Yes | low, medium, high, critical |
| Start Date | Date picker | No | When work is planned to begin |
| Target Date | Date picker | No | Expected completion date |

3. Click **"Create"**

### Roadmap Card Display

Each roadmap item appears as a card showing:

- **Title** — Initiative name
- **Status badge** — Planned (gray), In Progress (blue), Completed (green), Delayed (red)
- **Priority badge** — Color-coded by level
- **Override badge** — Yellow "Override" tag if status was manually set
- **Date range** — Start date – Target date
- **Task count** — "N tasks (M done)"
- **Related sprints** — Automatically derived from linked tasks' sprint assignments
- **Progress bar** — Visual completion based on linked tasks

### Automatic Status Derivation (Single Source of Truth)

This is the core design principle. Roadmap item status is **automatically computed** from linked tasks:

| Condition | Derived Status |
|-----------|---------------|
| All linked tasks completed | **Completed** |
| Any linked task blocked | **Delayed** |
| Any linked task in-progress or testing | **In Progress** |
| No tasks started (all planned) | **Planned** |
| No linked tasks | Uses stored status |

**Date-based activation:** If a roadmap item's status is "Planned" and today's date is past the start date, it automatically displays as "In Progress" (computed on read, no cron jobs).

### Manual Status Override

Sometimes you need to manually set a status that differs from the auto-derived one.

**To override:**
1. Use the "Override Status" dropdown on the roadmap card
2. Select the desired status
3. The status is now locked (yellow "Override" badge appears)

**To clear override:**
1. Click the **"Clear Override"** button
2. Status returns to automatic derivation from linked tasks

The override is **sticky** — it persists until you explicitly clear it.

### Linking Tasks to Roadmap Items

Tasks are linked to roadmap items via the `roadmapItem` field on the task. There are two ways to link:

**From the roadmap card:**
1. Click **"+ Link New Task"** on any roadmap card
2. This opens the task creation form pre-filled with the project and roadmap item

**From the task form:**
1. Create or edit any task
2. Select a project
3. The **"Roadmap Initiative"** dropdown appears (only if the project has roadmap items)
4. Select the initiative to link

### Viewing Linked Tasks

Click **"Show Tasks (N)"** on any roadmap card to expand the linked task list. Each task shows:
- Title (clickable — navigates to task detail)
- Status badge
- Assignee name

Click **"Hide Tasks"** to collapse.

### Dashboard Integration

The dashboard shows an **"Upcoming Roadmap Items"** widget that automatically displays roadmap items from all projects with start dates within the next 30 days. Each item shows the project name, title, status, task progress, and target date.

### Project Overview Integration

On the project detail Overview tab, if any roadmap item has status "in_progress", it automatically appears as an **"Active Roadmap Initiative"** card below the Current Focus card. This card shows the initiative title, description, status, task progress, and target date.

---

## 10. Project Metrics

Track key performance indicators (KPIs) for each project and measure how they change over time.

### Defining Metrics

1. Go to a project's detail page
2. Click the **Metrics** tab
3. Click **"+ Add Metric"**
4. Enter:
   - **Metric Name** — e.g., "Daily Active Users", "Signups", "Conversion Rate"
   - **Unit** — e.g., "users/day", "%", "count"
5. Click **"Add"**

Metrics can be edited or deleted from the metrics table.

### Recording Metric Values

There are **two ways** to record metric values:

#### Method 1: Directly from the Metrics Tab

1. Go to the project's **Metrics** tab
2. Click **"Record"** next to any metric
3. An inline form expands with:
   - **Previous Value** — Pre-filled with the last known current value
   - **Current Value** — Enter the new value
   - **Note** (optional) — e.g., "Weekly check", "After A/B test"
   - **% Change** — Auto-calculated live as you type
4. Click **"Save Value"**

This creates a standalone snapshot not tied to any release. Useful for tracking metrics on a regular basis (weekly, after experiments, etc.).

#### Method 2: Through the Release Form

1. Create or edit a release
2. Select a project that has defined metrics
3. The **"Metric Impact"** section appears at the bottom
4. For each metric, enter the previous and current values
5. These snapshots are tied to the release

The percentage change is calculated server-side with edge case handling (division by zero, etc.).

### Viewing Metrics

**Metrics tab table** shows each metric with:

| Column | Description |
|--------|-------------|
| Metric | Metric name |
| Unit | Measurement unit |
| Current Value | Latest recorded value |
| Previous Value | Value before the latest recording |
| Change | Percentage change badge (green = up, red = down, gray = neutral) |
| Source | Either the release version (e.g., "v1.3") or the note from a manual entry |

**Action buttons per metric:**
- **Record** — Record a new value directly
- **History** — Expand to see all historical snapshots
- **Edit** — Edit metric name/unit
- **Delete** — Remove metric and all its snapshots

### Snapshot History

Click **"History"** on any metric to expand a timeline of all recorded values:

| Column | Description |
|--------|-------------|
| Date | When the snapshot was recorded |
| Previous | Previous value at that time |
| Current | Current value at that time |
| Change | Percentage change |
| Source | Release version or manual note |

This gives you a complete history of how the metric has evolved over time, regardless of whether values were recorded via releases or manually.

**Release Detail page** also shows a "Metric Impact" table for snapshots tied to that specific release.

---

## 11. Activity Timeline

**URL:** `/activity`

A global feed of all actions performed across the entire system.

### Filters

| Filter | Options |
|--------|---------|
| Entity Type | All, Projects, Tasks, Sprints, Releases, Discussions, Comments |
| Limit | 25, 50, 100 items |

Changing a filter immediately reloads the timeline.

### Activity Entry Display

Each entry shows:
- **Icon** — Color-coded by entity type (PRJ, TSK, SPR, REL, DSC, CMT)
- **User name** — Who performed the action
- **Action** — created, updated, deleted
- **Entity name** — Clickable link to the entity (routes based on type)
- **Metadata** — If a field was changed, shows: field name: old value → new value
- **Timestamp**

### What Gets Logged

Activity is automatically logged for:
- Creating, updating, or deleting any entity (project, task, sprint, release, discussion, roadmap item)
- Status changes on tasks (including which status it changed from/to)
- Task reassignments
- Comments on discussions

---

## 12. Global Search

### Triggering Search

Three ways to open search:
1. Click the **Search** bar in the header
2. Press **Ctrl+K** from any page
3. Navigate directly to `/search`

### Using Search

1. Type your query in the search box
2. Press **Enter** or click the search button
3. Results appear grouped by entity type

### Result Groups

| Group | Shows | Links to |
|-------|-------|----------|
| Projects | Name, description, status badge | Project detail |
| Tasks | Title, project name, status badge | Task detail |
| Discussions | Title, project name, date | Discussion detail |
| Releases | Version, project name, date | Release detail |

Results are powered by MongoDB full-text indexes on title, description, version, and content fields.

### Empty State

If no results match, a "No results found" message is displayed.

---

## 13. Data Model Reference

### Project

| Field | Type | Required | Default |
|-------|------|----------|---------|
| name | String | Yes | — |
| description | String | No | — |
| owner | User ref | Yes | — |
| status | Enum | Yes | active |
| currentFocus | String | No | '' |
| startDate | Date | No | — |
| repoLink | String | No | — |
| prodUrl | String | No | — |
| createdBy | User ref | Yes | — |

**Status options:** active, on-hold, completed, archived

### Task

| Field | Type | Required | Default |
|-------|------|----------|---------|
| title | String | Yes | — |
| description | String | No | — |
| project | Project ref | No | — |
| sprint | Sprint ref | No | — |
| assignedTo | User ref | No | — |
| status | Enum | Yes | planned |
| priority | Enum | Yes | medium |
| category | Enum | No | — |
| roadmapItem | RoadmapItem ref | No | — |
| startDate | Date | No | — |
| deadline | Date | No | — |
| deadlineExtension | Object | No | — |
| tags | String[] | No | [] |
| attachments | Object[] | No | [] |
| createdBy | User ref | Yes | — |

**Status options:** planned, in-progress, blocked, testing, completed
**Priority options:** low, medium, high, critical
**Category options:** feature, bug, improvement, research, maintenance

### Sprint

| Field | Type | Required | Default |
|-------|------|----------|---------|
| name | String | Yes | — |
| startDate | Date | Yes | — |
| endDate | Date | Yes | — |
| status | Enum | Yes | planning |

**Status options:** planning, active, completed

### Release

| Field | Type | Required | Default |
|-------|------|----------|---------|
| project | Project ref | Yes | — |
| version | String | Yes | — |
| releaseDate | Date | Yes | — |
| description | String | No | — |
| changes | String[] | No | [] |
| createdBy | User ref | Yes | — |

### Discussion

| Field | Type | Required | Default |
|-------|------|----------|---------|
| project | Project ref | Yes | — |
| title | String | Yes | — |
| content | String | Yes | — |
| createdBy | User ref | Yes | — |
| linkedTask | Task ref | No | — |

### Comment

| Field | Type | Required | Default |
|-------|------|----------|---------|
| discussion | Discussion ref | Yes | — |
| user | User ref | Yes | — |
| content | String | Yes | — |

### RoadmapItem

| Field | Type | Required | Default |
|-------|------|----------|---------|
| project | Project ref | Yes | — |
| title | String | Yes | — |
| description | String | No | — |
| status | Enum | Yes | planned |
| isStatusOverridden | Boolean | No | false |
| priority | Enum | Yes | medium |
| startDate | Date | No | — |
| targetDate | Date | No | — |
| createdBy | User ref | Yes | — |

**Status options:** planned, in_progress, completed, delayed
**Priority options:** low, medium, high, critical

**Derived fields (computed on read, not stored):**
- `linkedTasks` — Tasks with `roadmapItem` pointing to this item
- `taskCount` — Number of linked tasks
- `completedTaskCount` — Number of linked tasks with status "completed"
- `relatedSprints` — Sprints derived from linked tasks' sprint assignments

### ProjectMetric

| Field | Type | Required | Default |
|-------|------|----------|---------|
| project | Project ref | Yes | — |
| metricName | String | Yes | — |
| metricUnit | String | No | — |

### MetricSnapshot

| Field | Type | Required | Default |
|-------|------|----------|---------|
| metric | ProjectMetric ref | Yes | — |
| release | Release ref | No | — |
| previousValue | Number | Yes | — |
| currentValue | Number | Yes | — |
| percentageChange | Number | No | Auto-calculated |
| note | String | No | — |

### Activity

| Field | Type | Required | Default |
|-------|------|----------|---------|
| user | User ref | Yes | — |
| action | String | Yes | — |
| entityType | Enum | Yes | — |
| entityId | ObjectId | Yes | — |
| entityName | String | No | — |
| metadata | Object | No | — |
| timestamp | Date | No | Date.now |

**Entity type options:** project, task, sprint, release, discussion, comment, roadmap

### User

| Field | Type | Required | Default |
|-------|------|----------|---------|
| name | String | Yes | — |
| email | String | Yes | — |
| googleId | String | Yes | — |
| avatar | String | No | — |
| role | Enum | No | developer |

**Role options:** developer, manager, ceo

---

## Navigation Reference

### Sidebar

| Icon | Label | URL |
|------|-------|-----|
| ⊞ | Dashboard | /dashboard |
| ◇ | Projects | /projects |
| ☑ | Tasks | /tasks |
| ⏱ | Sprints | /sprints |
| ⬆ | Releases | /releases |
| ♘ | Discussions | /discussions |
| ↺ | Activity | /activity |

### Header Bar

| Element | Action |
|---------|--------|
| + Create Task | Opens quick task creation modal |
| Search (Ctrl+K) | Navigates to global search |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+K | Open global search |

---

## API Routes Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/auth/google | Initiate Google OAuth |
| GET | /api/auth/google/callback | OAuth callback |
| GET | /api/auth/me | Get current user |
| GET | /api/auth/users | List all users |
| POST | /api/auth/logout | Logout |
| GET/POST | /api/projects | List / Create projects |
| GET/PUT/DELETE | /api/projects/:id | Get / Update / Delete project |
| GET/POST | /api/tasks | List / Create tasks |
| GET | /api/tasks/project/:projectId | Tasks by project |
| GET/PUT/DELETE | /api/tasks/:id | Get / Update / Delete task |
| PUT | /api/tasks/:id/status | Quick status update |
| GET/POST | /api/sprints | List / Create sprints |
| GET/PUT/DELETE | /api/sprints/:id | Get / Update / Delete sprint |
| GET/POST | /api/releases | List / Create releases |
| GET | /api/releases/project/:projectId | Releases by project |
| GET/PUT/DELETE | /api/releases/:id | Get / Update / Delete release |
| GET/POST | /api/discussions | List / Create discussions |
| GET | /api/discussions/project/:projectId | Discussions by project |
| GET/PUT/DELETE | /api/discussions/:id | Get / Update / Delete discussion |
| POST | /api/discussions/:id/create-task | Create task from discussion |
| GET/POST | /api/discussions/:id/comments | List / Add comments |
| GET | /api/activities | List activities (with filters) |
| GET | /api/search | Full-text search |
| GET | /api/dashboard/stats | Dashboard statistics |
| GET | /api/dashboard/projects-overview | Projects overview table data |
| GET | /api/dashboard/my-tasks | Tasks assigned to current user |
| GET | /api/dashboard/upcoming-deadlines | Tasks due within 7 days |
| GET | /api/dashboard/recent | Recent activity (15 items) |
| GET/POST | /api/metrics | List / Create project metrics |
| GET/PUT/DELETE | /api/metrics/:id | Get / Update / Delete metric |
| GET | /api/metrics/project/:projectId/latest | Latest metric values |
| POST | /api/metrics/snapshots | Create standalone snapshot |
| GET | /api/metrics/metric/:metricId/history | Snapshot history for a metric |
| GET | /api/roadmap/upcoming | Upcoming roadmap items (30 days) |
| GET | /api/roadmap/project/:projectId | Roadmap items by project |
| GET/PUT/DELETE | /api/roadmap/:id | Get / Update / Delete roadmap item |
| POST | /api/roadmap | Create roadmap item |
| PUT | /api/roadmap/:id/override-status | Manual status override |
| PUT | /api/roadmap/:id/clear-override | Clear status override |
