# Workify Platform API Integration Documentation

This document defines the RESTful endpoints required to power the frontend interface for the Workify Job Platform (servicing both Employers and Job Seekers). This is meant for the Backend AI to consume and implement.

## Base URL
`/api/v1`

---

## 1. Authentication & Profile
**Base Path:** `/auth` & `/users`

| Method | Endpoint | Description | Payload / Expected Response |
|--------|----------|-------------|-----------------------------|
| `POST` | `/auth/login` | Authenticate user (Employee/Employer) | Req: `{ email, password }` <br/> Res: `{ token, userRole }` |
| `POST` | `/auth/register` | Register new user | Req: `{ email, password, role, name }` |
| `GET`  | `/users/me` | Get current user profile details | Res: `{ id, role, profileData }` |
| `PUT`  | `/users/me` | Update (Company Profile / Seeker details) | Req: Settings data (Avatar, Location, Industry) |

---

## 2. Jobs (Employer Side)
**Base Path:** `/employer/jobs`

| Method | Endpoint | Description | Payload / Expected Response |
|--------|----------|-------------|-----------------------------|
| `GET`  | `/employer/jobs` | Get all jobs posted by this employer | Query params: `?status=active\|draft\|closed` |
| `POST` | `/employer/jobs` | Create a new job post | Req: `{ title, category: 'Corporate'\|'Casual', type, location, salary, description, isUrgent }` |
| `PUT`  | `/employer/jobs/:id` | Update job details | Req: Partial Job Object |
| `DELETE`| `/employer/jobs/:id` | Drop a job posting | Res: Status 200/204 |

---

## 3. Applications / CRM Pipeline (Employer Side)
**Base Path:** `/employer/applications`

| Method | Endpoint | Description | Payload / Expected Response |
|--------|----------|-------------|-----------------------------|
| `GET`  | `/employer/applications` | List candidate applications (Pipeline) | Res: `[{ id, applicantName, jobTitle, stage, ... }]` |
| `PUT`  | `/employer/applications/:id/stage`| Move candidate to a new stage | Req: `{ stage: "applied"\|"screening"\|"interview"\|"offer"\|"hired"\|"rejected" }` |
| `PUT`  | `/employer/applications/:id/note` | Save employer private CRM notes | Req: `{ note: string }` |

---

## 4. Find Talent / Headhunting (Employer Side)
**Base Path:** `/employer/talent`

| Method | Endpoint | Description | Payload / Expected Response |
|--------|----------|-------------|-----------------------------|
| `GET`  | `/employer/talent` | Search all job seekers | Query params: `?search=X&location=Y&role=Z` |
| `POST` | `/employer/talent/invite` | Send direct interview invite to seeker | Req: `{ seekerId, message }` |

---

## 5. Job Search & Discovery (Job Seeker Side)
**Base Path:** `/seeker/jobs`

| Method | Endpoint | Description | Payload / Expected Response |
|--------|----------|-------------|-----------------------------|
| `GET`  | `/seeker/jobs` | Search open job posts | Query params: `?type=contract\|daily&location=X&query=Y` |
| `GET`  | `/seeker/jobs/:id` | Get specific job details | Res: `{ title, description, company, salary... }` |
| `POST` | `/seeker/jobs/:id/apply` | Apply to a job | Req: `{ resumeId, optionalCoverLetter }` |

---

## 6. Application Tracking (Job Seeker Side)
**Base Path:** `/seeker/applications`

| Method | Endpoint | Description | Payload / Expected Response |
|--------|----------|-------------|-----------------------------|
| `GET`  | `/seeker/applications` | List applications applied to by this user | Res: `[{ jobId, title, company, currentStage, dateApplied }]` |

---

## 7. Notifications
**Base Path:** `/notifications`

| Method | Endpoint | Description | Payload / Expected Response |
|--------|----------|-------------|-----------------------------|
| `GET`  | `/notifications` | Get notifications for the current user | Res: `[{ id, type, title, message, read }]` |
| `PUT`  | `/notifications/:id/read` | Mark specific notification as read | Res: Status 200 |
| `PUT`  | `/notifications/read-all`| Mark all notifications as read | Res: Status 200 |
| `DELETE`| `/notifications/:id` | Remove a notification | Res: Status 204 |

---

## 8. Messages
**Base Path:** `/messages`

| Method | Endpoint | Description | Payload / Expected Response |
|--------|----------|-------------|-----------------------------|
| `GET`  | `/messages/conversations` | List active chat threads | Res: `[{ id, participantName, lastMessage, unreadCount }]` |
| `GET`  | `/messages/:conversationId` | Get messages in a thread | Res: `[{ id, senderId, text, timestamp }]` |
| `POST` | `/messages/:conversationId` | Send a new message | Req: `{ text }` |

---

## 9. Bookmarks & Saved Items (Both Roles)
**Base Path:** `/bookmarks`

| Method | Endpoint | Description | Payload / Expected Response |
|--------|----------|-------------|-----------------------------|
| `GET`  | `/bookmarks/jobs` | Get saved jobs (Seeker) | Res: `[{ jobId, jobTitle... }]` |
| `GET`  | `/bookmarks/profiles` | Get saved profiles (Employer) | Res: `[{ seekerId, name... }]` |
| `POST` | `/bookmarks` | Bookmark an item | Req: `{ entityType: "job"\|"profile", entityId }` |
| `DELETE`| `/bookmarks/:id` | Remove bookmark | Res: Status 204 |

---

## 10. Blogs (Generic Content)
**Base Path:** `/blogs`

| Method | Endpoint | Description | Payload / Expected Response |
|--------|----------|-------------|-----------------------------|
| `GET`  | `/blogs` | Retrieve latest articles | Query params: `?category=X` |
| `GET`  | `/blogs/:id` | Get single article detail | Res: Article details. |
