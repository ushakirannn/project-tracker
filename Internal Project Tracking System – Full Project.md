# Internal Project Tracking System – Full Project Context

## 1. Problem Context

We are a small technology team consisting of:

* 3 developers
* 1 manager
* 1 CEO

The company works on multiple software products simultaneously.

Current projects include:

* GRE App
* SAT App
* TOEFL App
* SAT Preparation Platform
* Possibly additional internal tools

Currently, project tracking is **very informal and mostly verbal**. Requirements are discussed in meetings, implemented by developers, and released, but there is **no central system that tracks**:

* What projects exist
* What features were released in each version
* What tasks are being worked on
* What is planned for the next sprint
* What discussions or decisions happened
* What bugs were fixed
* What improvements were made

Because of this, the team faces several problems:

### Major Problems

1. **Lack of Visibility**

   * The CEO cannot easily see what is happening across projects.
   * There is no high-level overview of current work.

2. **No Project History**

   * We cannot see what was released in previous versions.
   * There is no release history or changelog.

3. **No Task Tracking**

   * Tasks are assigned verbally.
   * Developers work on tasks without a structured system.

4. **No Sprint Planning Record**

   * We follow **2 sprints per month (15 days each)**.
   * Example:

     * March Sprint 1
     * March Sprint 2
   * But sprint planning is not tracked anywhere.

5. **No Decision Log**

   * Important discussions and product decisions are lost.

6. **No Central Knowledge Hub**

   * There is no single place where someone can understand everything about a project.

---

## 2. Goal of the System

We want to build an **internal project management and knowledge tracking system** that acts as the **single source of truth for all projects**.

The system should answer three key questions:

### CEO View

"What is happening in the company right now?"

### Developer View

"What tasks am I working on in this sprint?"

### Historical View

"What features were released previously and why?"

---

## 3. Core Philosophy

The system should be:

* Simple
* Clear
* Transparent
* Designed for small teams
* Not overly complex like Jira

Everyone in the company can see everything. There are no private tasks or restricted visibility initially.

---

## 4. Main Features

The system will contain the following modules:

1. Authentication
2. Dashboard
3. Projects
4. Tasks
5. Sprints
6. Releases
7. Discussions
8. Activity Timeline
9. Global Search

---

# 5. Authentication

Users must log in.

Simple authentication is sufficient. We can use google authentication. 

All users can view all projects and tasks.

---

# 6. Dashboard

The dashboard provides a **high-level overview of the entire company work**.

This page should allow the CEO or manager to quickly understand:

* What projects exist
* What is currently being worked on
* Current sprint progress
* Recent releases
* Active tasks

### Dashboard Components

**Project Summary**

Example metrics:

Total Projects
Active Projects
Completed Projects

**Sprint Status**

Current Sprint
Tasks Planned
Tasks Completed
Tasks In Progress
Blocked Tasks

**Recent Activity**

Examples:

* TOEFL App v1.3 released
* SAT App analytics feature added
* GRE App bug fix completed

---

# 7. Projects Module

This module lists all company projects.

Example projects:

* GRE App
* SAT App
* TOEFL App
* SAT Prep Platform

Each project contains detailed information.

### Project Fields

Project Name
Description
Owner
Status
Start Date
Repository Link (optional)
Production URL (optional)

---

# 8. Project Detail Page

Each project should function as a **complete knowledge hub**.

The page should contain the following sections:

### Overview

A non-technical explanation of the project.

This section should be understandable by non-technical people such as the CEO.

Example:

Project purpose
Key functionality
Current version
Next planned release

---

### Tasks

All work items related to the project.

Each task contains:

Title
Description
Project
Category
Priority
Assigned Developer
Status
Target Sprint
Start Date
Deadline
Deadline Extension
Attachments
Created By
Created Date

### Task Status

Possible statuses:

Planned
In Progress
Blocked
Testing
Completed

### Task Categories

Feature
Bug
Improvement
Research
Maintenance

Tasks should support filtering by:

* Status
* Sprint
* Assigned Developer
* Category
* Priority

---

### Releases

Every version release of the project should be recorded.

Example release entry:

Version: v1.3
Release Date: March 28

Changes:

* Improved reading UI
* Fixed login bug
* Added analytics feature

This allows the team to track **product evolution over time**.

---

### Discussions

Discussions represent product decisions and feature conversations.

Example:

Discussion Title: AI explanation feature

Content:

CEO suggested adding AI explanations for answers.
Team discussed feasibility.
Decision: Add in April Sprint.

Discussions should support comments.

Tasks can be created directly from discussions.

---

### Activity Timeline

Every change in the system should generate an activity log.

Examples:

User created task
Task status updated
Sprint started
Release created
Discussion added

Example log:

Usha created task "GRE vocabulary feature"
Rahul moved task to In Progress
SAT App v1.4 released

---

# 9. Sprint Management

The team follows **two sprints per month**.

Example sprint structure:

March Sprint 1
March Sprint 2
April Sprint 1
April Sprint 2

Each sprint has:

Name
Start Date
End Date
Status

Inside a sprint we should see:

Planned tasks
Tasks in progress
Blocked tasks
Completed tasks

This allows the team to track sprint execution.

---

# 10. Releases Module

A global releases page should show all releases across projects.

Example list:

TOEFL App v1.3
SAT App v2.1
GRE App v1.4

Each release includes:

Project
Version
Release Date
Release Notes
Changes

---

# 11. Global Search

Search across:

Projects
Tasks
Discussions
Releases

This is important when the system grows.

---

# 12. Database Entities

The system will likely require the following collections:

Users
Projects
Tasks
Sprints
Releases
Discussions
Comments
Activities

Example structure:

### Users

id
name
email
role

### Projects

id
name
description
owner
status
createdAt

### Tasks

id
title
description
projectId
sprintId
assignedTo
status
priority
category
startDate
deadline
deadlineExtension
createdBy
createdAt

### Sprints

id
name
startDate
endDate
status

### Releases

id
projectId
version
releaseDate
description
changes

### Discussions

id
projectId
title
content
createdBy
createdAt

### Comments

id
discussionId
userId
content
createdAt

### Activities

id
userId
action
entityType
entityId
timestamp

---

# 13. Technology Stack

Preferred stack:

Frontend
Angular

Backend
Node.js
Express

Database
MongoDB

Authentication
Google auth

Optional Enhancements:
File uploads for attachments

---

# 14. Design Principles

The system must be:

Simple
Fast
Easy to use
Transparent

Creating tasks must be extremely quick so developers actually use the system.

---

# 15. Long-Term Vision

Although this system is initially built for internal use, it should be designed in a way that it could potentially evolve into a lightweight project management tool for small teams.

However, the primary goal is solving the **internal project tracking problem**.

---

End of specification.
