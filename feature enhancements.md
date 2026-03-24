# Feature Enhancements for Internal Project Tracker

We already have a working internal project tracker with the following modules:

* Dashboard
* Projects
* Tasks
* Sprints
* Releases
* Discussions
* Activity Timeline

Now we want to improve usability and add several important features to make the tool more effective for daily use.

Do NOT change existing architecture drastically. Extend the current system.

The following new features must be implemented.

---

# 1. Dashboard: Project Status Overview

## Goal

Allow the CEO and team to quickly understand the status of all projects.

## Feature

Add a new section in the Dashboard called:

"Projects Overview"

This section should display all projects with the following information:

Project Name
Status
Open Tasks
Current Sprint
Last Release Version

Example layout:

GRE App
Status: Active
Open Tasks: 6
Current Sprint: March Sprint 1
Last Release: v1.3

SAT App
Status: In Progress
Open Tasks: 4
Current Sprint: March Sprint 1
Last Release: v2.0

## UI

Use a simple table or card list.

Columns:

Project Name | Status | Open Tasks | Current Sprint | Last Release

Status should be color coded:

Green = Active
Yellow = At Risk
Red = Delayed
Grey = Completed

## Backend Changes

Projects should include:

status

Possible values:

active
at_risk
delayed
completed

---

# 2. Dashboard: My Tasks Widget

## Goal

Allow each developer to instantly see tasks assigned to them.

## Feature

Add a new dashboard widget called:

"My Tasks"

It should show all tasks assigned to the currently logged in user.

Fields to display:

Task Title
Project Name
Priority
Status
Deadline

Example:

Fix GRE login bug
Project: GRE App
Priority: High
Status: In Progress
Deadline: Mar 12

Tasks should be sorted by:

1. Priority
2. Deadline

Clicking a task should open the task detail page.

## Backend

Use existing task field:

assignedTo

Filter tasks where:

assignedTo = logged in user

---

# 3. Dashboard: Upcoming Deadlines

## Goal

Help the team track approaching deadlines.

## Feature

Add a dashboard widget called:

"Upcoming Deadlines"

Show tasks with deadlines within the next 7 days.

Fields:

Task Title
Project
Assigned Developer
Deadline

Example:

SAT analytics feature
Project: SAT App
Assigned: Usha
Deadline: Mar 14

Sort by deadline ascending.

Highlight deadlines:

Red = overdue
Orange = due in 2 days
Normal = due later

---

# 4. Sprint Board (Kanban)

## Goal

Allow visual management of sprint tasks.

## Feature

Inside the Sprint Detail page, create a Kanban board.

Columns:

Planned
In Progress
Blocked
Testing
Completed

Each column should display tasks with that status.

Tasks should appear as draggable cards.

Each card should show:

Task Title
Assigned Developer
Priority
Deadline

## Interaction

Users should be able to drag a task card from one column to another.

Example:

Dragging task from "Planned" to "In Progress" should automatically update:

task.status = "in_progress"

Update backend via API call.

---

# 5. Task Priority Visualization

## Goal

Make critical tasks visually identifiable.

## Feature

Add priority color indicators in all task lists.

Priority levels:

High
Medium
Low

Display as colored badge.

Example colors:

High = Red
Medium = Orange
Low = Grey

This should appear in:

Task List
Task Card
Sprint Board

---

# 6. Task Tags

## Goal

Allow tasks to be categorized with flexible labels.

## Feature

Add optional tags field to tasks.

Example tags:

frontend
backend
ui
performance
urgent

Tasks can have multiple tags.

## Backend

Add new field:

tags: string[]

Example:

tags: ["frontend", "ui"]

## UI

Show tags as small label badges.

Add filtering option:

Filter tasks by tag.

---

# 7. Project Health Indicator

## Goal

Allow leadership to quickly understand project risk.

## Feature

Each project should include a "Health" indicator.

Values:

on_track
at_risk
delayed

## UI

Display colored indicator:

Green = On Track
Yellow = At Risk
Red = Delayed

Show this in:

Project List
Project Overview
Dashboard Project Overview

---

# 8. Global Quick Task Creation

## Goal

Allow very fast task creation.

## Feature

Add a global button in the top navigation bar:

"+ Create Task"

Clicking opens a modal.

Fields required:

Title
Project
Assigned Developer
Priority
Sprint (optional)
Deadline (optional)

Description should be optional.

The task should be created immediately after submission.

Redirect user to task detail page.

---

# 9. Small UX Improvements

Improve usability with the following changes:

Add icons to sidebar navigation
Add hover states for cards
Add smooth drag animations in Kanban board
Improve spacing between dashboard cards

Use modern UI styling.

---

# Implementation Notes

Use the existing stack:

Frontend: Angular
Backend: Node.js + Express
Database: MongoDB

Do not rewrite existing logic unless required.

Focus on extending the current architecture cleanly.

Ensure the following:

* Efficient API usage
* Proper error handling
* Clean component structure
* Responsive UI
* Consistent status naming
