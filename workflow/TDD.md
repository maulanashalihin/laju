# Technical Design Document (TDD)

**Project:** JemputJodoh.id
**Version:** 1.0
**Date:** January 2026

---

## 1. System Architecture

### 1.1 Architecture Overview

JemputJodoh.id follows a **monolithic architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Browser    │  │   Browser    │  │   Browser    │  │
│  │  (User App)  │  │  (Admin App) │  │  (Wali View) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼─────────────────┼─────────────────┼──────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                    ┌───────▼────────┐
                    │   Inertia.js   │
                    │   (Frontend)   │
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │ HyperExpress   │
                    │   (Backend)    │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌──────▼───────┐  ┌───────▼────────┐
│  BetterSQLite3 │  │   Redis      │  │   AWS S3      │
│   (Database)   │  │   (Cache)    │  │   (Storage)   │
└────────────────┘  └──────────────┘  └────────────────┘
```

### 1.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Server** | HyperExpress | v6.17.3 | High-performance HTTP server |
| **Frontend** | Svelte 5 | v5.41.3 | Reactive UI with runes |
| **Frontend** | Inertia.js | v2.2.10 | SPA without API |
| **Styling** | TailwindCSS | v3.4.17 | Utility-first CSS |
| **Database** | BetterSQLite3 | - | Embedded SQL database |
| **ORM** | Knex | v3.1.0 | Query builder & migrations |
| **Validation** | Zod | v4.3.5 | Schema validation |
| **Build** | Vite | v5.4.10 | Fast build tool |
| **Templates** | Eta | - | SSR templates |
| **TypeScript** | TypeScript | v5.6.3 | Backend type safety |

### 1.3 Design Patterns

- **MVC Pattern**: Controllers handle requests, Views render responses
- **Repository Pattern**: DB service abstracts database operations
- **Middleware Pattern**: Request/response processing pipeline
- **Service Layer**: Business logic separation
- **Factory Pattern**: Command generators

---

## 2. Database Schema

### 2.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    users    │       │  profiles   │       │  guardians  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)     │       │ id (PK)     │
│ email       │  └───▶│ user_id (FK)│       │ user_id (FK)│
│ password    │       │ name        │       │ name        │
│ phone       │       │ gender      │       │ phone       │
│ role        │       │ age         │       │ otp_code    │
│ status      │       │ location    │       │ verified_at │
│ created_at  │       │ ktp_url     │       │ created_at  │
│ updated_at  │       │ selfie_url  │       │ updated_at  │
└─────────────┘       │ bio         │       └─────────────┘
                      │ religion    │
                      │ education   │
                      │ occupation  │
                      │ income      │
                      │ vision      │
                      │ criteria    │
                      │ created_at  │
                      │ updated_at  │
                      └─────────────┘
                            │
                            │
┌─────────────┐       ┌────▼─────┐       ┌─────────────┐
│  tickets    │       │proposals │       │relationships│
├─────────────┤       ├──────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)  │       │ id (PK)     │
│ user_id (FK)│◀──────│ sender_id│◀──────│ user_a_id   │
│ balance     │       │ receiver_id│     │ user_b_id   │
│ created_at  │       │ status   │       │ proposal_id │
│ updated_at  │       │ message  │       │ status      │
└─────────────┘       │ ai_analysis│      │ taaruf_started_at│
                      │ created_at│      │ khitbah_started_at│
                      │ updated_at│      │ ended_at    │
                      └──────────┘       │ married_at  │
                                         │ created_at  │
                                         │ updated_at  │
                                         └─────────────┘
                                               │
                                               │
┌─────────────┐       ┌─────────────┐       │
│ transactions│       │    chats    │       │
├─────────────┤       ├─────────────┤       │
│ id (PK)     │       │ id (PK)     │       │
│ user_id (FK)│◀──────│ relationship_id(FK) │
│ package     │       │ sender_id   │       │
│ tickets     │       │ message     │       │
│ amount      │       │ created_at  │       │
│ payment_method│     │ updated_at  │       │
│ status      │       └─────────────┘       │
│ created_at  │                              │
│ updated_at  │                              │
└─────────────┘                              │
                                             │
┌─────────────┐       ┌─────────────┐       │
│ notifications│      │    reports  │       │
├─────────────┤       ├─────────────┤       │
│ id (PK)     │       │ id (PK)     │       │
│ user_id (FK)│       │ reporter_id │       │
│ type        │       │ reported_id │       │
│ title       │       │ reason      │       │
│ message     │       │ status      │       │
│ read        │       │ created_at  │       │
│ created_at  │       │ updated_at  │       │
└─────────────┘       └─────────────┘       │
                                             │
┌─────────────┐       ┌─────────────┐       │
│ password_reset_tokens │ email_verification_tokens │
├─────────────┤       ├─────────────┤       │
│ id (PK)     │       │ id (PK)     │       │
│ user_id (FK)│       │ user_id (FK)│       │
│ token       │       │ token       │       │
│ expires_at  │       │ expires_at  │       │
│ created_at  │       │ created_at  │       │
└─────────────┘       └─────────────┘       │
                                             │
┌─────────────┐       ┌─────────────┐       │
│   sessions  │       │  uploads    │       │
├─────────────┤       ├─────────────┤       │
│ id (PK)     │       │ id (PK)     │       │
│ user_id (FK)│       │ user_id (FK)│       │
│ token       │       │ filename    │       │
│ ip_address  │       │ path        │       │
│ user_agent  │       │ size        │       │
│ expires_at  │       │ type        │       │
│ created_at  │       │ created_at  │       │
└─────────────┘       └─────────────┘       └─────────────┘
```

### 2.2 Table Specifications

#### 2.2.1 users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email |
| password | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| phone | VARCHAR(20) | NOT NULL | User phone number |
| role | ENUM | NOT NULL | 'user', 'admin' |
| status | ENUM | NOT NULL | 'pending', 'active', 'suspended' |
| email_verified_at | TIMESTAMP | NULLABLE | Email verification timestamp |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes:**
- `idx_users_email` on `email`
- `idx_users_phone` on `phone`

#### 2.2.2 profiles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| user_id | INTEGER | FK, UNIQUE, NOT NULL | Reference to users.id |
| name | VARCHAR(100) | NOT NULL | Full name (KTP) |
| display_name | VARCHAR(50) | NOT NULL | Display name (for privacy) |
| gender | ENUM | NOT NULL | 'male', 'female' |
| age | INTEGER | NOT NULL | User age |
| marital_status | ENUM | NOT NULL | 'single', 'widowed', 'divorced' |
| location | VARCHAR(100) | NOT NULL | City/Province |
| ktp_url | VARCHAR(500) | NULLABLE | S3 URL for KTP photo |
| selfie_url | VARCHAR(500) | NULLABLE | S3 URL for selfie with KTP |
| bio | TEXT | NULLABLE | Self introduction |
| religion | VARCHAR(50) | NOT NULL | Religion (Islam) |
| education | VARCHAR(100) | NULLABLE | Education level |
| occupation | VARCHAR(100) | NULLABLE | Current occupation |
| income | VARCHAR(50) | NULLABLE | Income range |
| vision | TEXT | NULLABLE | Vision for marriage |
| criteria | TEXT | NULLABLE | Partner criteria |
| height | INTEGER | NULLABLE | Height in cm |
| weight | INTEGER | NULLABLE | Weight in kg |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes:**
- `idx_profiles_user_id` on `user_id`
- `idx_profiles_gender` on `gender`
- `idx_profiles_location` on `location`

#### 2.2.3 guardians (wali)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| user_id | INTEGER | FK, UNIQUE, NOT NULL | Reference to users.id |
| name | VARCHAR(100) | NOT NULL | Guardian name |
| phone | VARCHAR(20) | NOT NULL | Guardian phone (WhatsApp) |
| relationship | VARCHAR(50) | NOT NULL | Relationship to user |
| otp_code | VARCHAR(10) | NULLABLE | OTP for verification |
| otp_expires_at | TIMESTAMP | NULLABLE | OTP expiration |
| verified_at | TIMESTAMP | NULLABLE | Verification timestamp |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes:**
- `idx_guardians_user_id` on `user_id`
- `idx_guardians_phone` on `phone`

#### 2.2.4 tickets

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| user_id | INTEGER | FK, UNIQUE, NOT NULL | Reference to users.id |
| balance | INTEGER | NOT NULL, DEFAULT 0 | Current ticket balance |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes:**
- `idx_tickets_user_id` on `user_id`

#### 2.2.5 proposals

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| sender_id | INTEGER | FK, NOT NULL | Reference to users.id |
| receiver_id | INTEGER | FK, NOT NULL | Reference to users.id |
| status | ENUM | NOT NULL | 'pending', 'accepted', 'rejected', 'cancelled' |
| message | TEXT | NULLABLE | Proposal message |
| ai_analysis | TEXT | NULLABLE | AI compatibility analysis (JSON) |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes:**
- `idx_proposals_sender_id` on `sender_id`
- `idx_proposals_receiver_id` on `receiver_id`
- `idx_proposals_status` on `status`

#### 2.2.6 relationships

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| user_a_id | INTEGER | FK, NOT NULL | Reference to users.id |
| user_b_id | INTEGER | FK, NOT NULL | Reference to users.id |
| proposal_id | INTEGER | FK, NULLABLE | Reference to proposals.id |
| status | ENUM | NOT NULL | 'taaruf', 'khitbah', 'ended', 'married' |
| taaruf_started_at | TIMESTAMP | NULLABLE | Taaruf start time |
| khitbah_started_at | TIMESTAMP | NULLABLE | Khitbah start time |
| ended_at | TIMESTAMP | NULLABLE | Relationship end time |
| ended_by | INTEGER | FK, NULLABLE | Reference to users.id |
| end_reason | TEXT | NULLABLE | Reason for ending |
| married_at | TIMESTAMP | NULLABLE | Marriage time |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes:**
- `idx_relationships_user_a_id` on `user_a_id`
- `idx_relationships_user_b_id` on `user_b_id`
- `idx_relationships_status` on `status`

#### 2.2.7 chats

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| relationship_id | INTEGER | FK, NOT NULL | Reference to relationships.id |
| sender_id | INTEGER | FK, NOT NULL | Reference to users.id |
| message | TEXT | NOT NULL | Chat message |
| created_at | TIMESTAMP | NOT NULL | Message creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes:**
- `idx_chats_relationship_id` on `relationship_id`
- `idx_chats_sender_id` on `sender_id`
- `idx_chats_created_at` on `created_at`

#### 2.2.8 transactions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| user_id | INTEGER | FK, NOT NULL | Reference to users.id |
| package | VARCHAR(50) | NOT NULL | Package name |
| tickets | INTEGER | NOT NULL | Number of tickets |
| amount | DECIMAL(10,2) | NOT NULL | Transaction amount |
| payment_method | VARCHAR(50) | NOT NULL | Payment method |
| payment_id | VARCHAR(100) | NULLABLE | Payment gateway ID |
| status | ENUM | NOT NULL | 'pending', 'success', 'failed' |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes:**
- `idx_transactions_user_id` on `user_id`
- `idx_transactions_status` on `status`

#### 2.2.9 notifications

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| user_id | INTEGER | FK, NOT NULL | Reference to users.id |
| type | VARCHAR(50) | NOT NULL | Notification type |
| title | VARCHAR(255) | NOT NULL | Notification title |
| message | TEXT | NOT NULL | Notification message |
| data | TEXT | NULLABLE | Additional data (JSON) |
| read | BOOLEAN | NOT NULL, DEFAULT false | Read status |
| created_at | TIMESTAMP | NOT NULL | Record creation time |

**Indexes:**
- `idx_notifications_user_id` on `user_id`
- `idx_notifications_read` on `read`

#### 2.2.10 reports

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | Unique identifier |
| reporter_id | INTEGER | FK, NOT NULL | Reference to users.id |
| reported_id | INTEGER | FK, NOT NULL | Reference to users.id |
| reason | VARCHAR(255) | NOT NULL | Report reason |
| description | TEXT | NULLABLE | Report description |
| status | ENUM | NOT NULL | 'pending', 'reviewed', 'resolved' |
| created_at | TIMESTAMP | NOT NULL | Record creation time |
| updated_at | TIMESTAMP | NOT NULL | Last update time |

**Indexes:**
- `idx_reports_reporter_id` on `reporter_id`
- `idx_reports_reported_id` on `reported_id`
- `idx_reports_status` on `status`

---

## 3. API Endpoints & Routes

### 3.1 Authentication Routes

| Method | Route | Controller | Middleware | Description |
|--------|-------|------------|------------|-------------|
| GET | `/login` | LoginController | - | Login page |
| POST | `/login` | LoginController | csrf | Login submit |
| GET | `/register` | RegisterController | - | Registration page |
| POST | `/register` | RegisterController | csrf | Registration submit |
| GET | `/logout` | LoginController | auth | Logout |
| GET | `/forgot-password` | PasswordController | - | Forgot password page |
| POST | `/forgot-password` | PasswordController | csrf | Send reset link |
| GET | `/reset-password/:token` | PasswordController | - | Reset password page |
| POST | `/reset-password` | PasswordController | csrf | Reset password submit |
| GET | `/verify-email/:token` | VerificationController | - | Email verification |

### 3.2 User Routes

| Method | Route | Controller | Middleware | Description |
|--------|-------|------------|------------|-------------|
| GET | `/profile` | ProfileController | auth | Profile page |
| POST | `/profile` | ProfileController | auth, csrf | Update profile |
| GET | `/profile/edit` | ProfileController | auth | Edit profile page |
| GET | `/settings` | SettingsController | auth | Settings page |
| POST | `/settings` | SettingsController | auth, csrf | Update settings |

### 3.3 Onboarding Routes

| Method | Route | Controller | Middleware | Description |
|--------|-------|------------|------------|-------------|
| GET | `/onboarding/ktp` | OnboardingController | auth | KTP upload page |
| POST | `/onboarding/ktp` | OnboardingController | auth, csrf | Submit KTP |
| GET | `/onboarding/guardian` | OnboardingController | auth | Guardian registration page |
| POST | `/onboarding/guardian` | OnboardingController | auth, csrf | Submit guardian |
| POST | `/onboarding/guardian/verify` | OnboardingController | auth, csrf | Verify guardian OTP |
| GET | `/onboarding/cv` | OnboardingController | auth | CV creation page |
| POST | `/onboarding/cv` | OnboardingController | auth, csrf | Submit CV |

### 3.4 Discovery Routes

| Method | Route | Controller | Middleware | Description |
|--------|-------|------------|------------|-------------|
| GET | `/search` | SearchController | auth | Search/discovery page |
| GET | `/search/profile/:id` | SearchController | auth | View profile (blurred) |
| GET | `/api/search` | SearchController | auth, inertia | Search API |

### 3.5 Proposal Routes

| Method | Route | Controller | Middleware | Description |
|--------|-------|------------|------------|-------------|
| POST | `/proposals` | ProposalController | auth, csrf | Create proposal |
| GET | `/proposals` | ProposalController | auth | My proposals page |
| GET | `/proposals/:id` | ProposalController | auth | Proposal detail |
| POST | `/proposals/:id/accept` | ProposalController | auth, csrf | Accept proposal |
| POST | `/proposals/:id/reject` | ProposalController | auth, csrf | Reject proposal |

### 3.6 Relationship Routes

| Method | Route | Controller | Middleware | Description |
|--------|-------|------------|------------|-------------|
| GET | `/relationships` | RelationshipController | auth | Relationships list |
| GET | `/relationships/:id` | RelationshipController | auth | Relationship detail |
| POST | `/relationships/:id/khitbah` | RelationshipController | auth, csrf | Request Khitbah |
| POST | `/relationships/:id/khitbah/accept` | RelationshipController | auth, csrf | Accept Khitbah |
| POST | `/relationships/:id/end` | RelationshipController | auth, csrf | End relationship |

### 3.7 Chat Routes

| Method | Route | Controller | Middleware | Description |
|--------|-------|------------|------------|-------------|
| GET | `/relationships/:id/chat` | ChatController | auth | Chat page |
| GET | `/api/relationships/:id/messages` | ChatController | auth, inertia | Get messages |
| POST | `/api/relationships/:id/messages` | ChatController | auth, inertia | Send message |

### 3.8 Ticket Routes

| Method | Route | Controller | Middleware | Description |
|--------|-------|------------|------------|-------------|
| GET | `/tickets` | TicketController | auth | Tickets page |
| GET | `/tickets/topup` | TicketController | auth | Top up page |
| POST | `/api/tickets/purchase` | TicketController | auth, inertia | Purchase tickets |
| GET | `/api/tickets/transactions` | TicketController | auth, inertia | Transaction history |
| POST | `/api/payments/webhook` | TicketController | - | Payment gateway webhook |

### 3.9 Notification Routes

| Method | Route | Controller | Middleware | Description |
|--------|-------|------------|------------|-------------|
| GET | `/api/notifications` | NotificationController | auth, inertia | Get notifications |
| POST | `/api/notifications/:id/read` | NotificationController | auth, inertia | Mark as read |
| POST | `/api/notifications/read-all` | NotificationController | auth, inertia | Mark all as read |

### 3.10 Admin Routes

| Method | Route | Controller | Middleware | Description |
|--------|-------|------------|------------|-------------|
| GET | `/admin` | AdminDashboardController | auth, admin | Admin dashboard |
| GET | `/admin/users` | AdminUsersController | auth, admin | User management |
| GET | `/admin/users/:id` | AdminUsersController | auth, admin | User detail |
| POST | `/admin/users/:id/verify` | AdminUsersController | auth, admin, csrf | Verify user |
| POST | `/admin/users/:id/suspend` | AdminUsersController | auth, admin, csrf | Suspend user |
| GET | `/admin/relationships` | AdminRelationshipsController | auth, admin | Relationship monitoring |
| GET | `/admin/tickets` | AdminTicketsController | auth, admin | Ticket sales |
| GET | `/admin/reports` | AdminReportsController | auth, admin | Report management |
| POST | `/admin/reports/:id/resolve` | AdminReportsController | auth, admin, csrf | Resolve report |

### 3.11 Wali Routes

| Method | Route | Controller | Middleware | Description |
|--------|-------|------------|------------|-------------|
| GET | `/wali/login` | WaliController | - | Wali login page |
| POST | `/wali/login` | WaliController | csrf | Wali login submit |
| GET | `/wali/dashboard` | WaliController | auth, wali | Wali dashboard |
| GET | `/wali/relationships/:id` | WaliController | auth, wali | View relationship |
| GET | `/wali/relationships/:id/chat` | WaliController | auth, wali | Read-only chat |

---

## 4. Data Models & Flow

### 4.1 User Registration Flow

```
1. User submits registration form
   ↓
2. Validate input (email, password, phone)
   ↓
3. Hash password (bcrypt)
   ↓
4. Create user record (status: pending)
   ↓
5. Send email verification link
   ↓
6. Redirect to email verification page
   ↓
7. User clicks verification link
   ↓
8. Mark email as verified
   ↓
9. Redirect to onboarding (KTP upload)
```

### 4.2 Onboarding Flow

```
1. KTP Upload
   - Upload KTP photo to S3
   - Upload selfie with KTP to S3
   - Store URLs in profile
   - Status: pending_verification
   ↓
2. CV Creation
   - Input biodata, ibadah, vision, criteria
   - Complete profile
   - Status: active
   ↓
3. Give bonus 1 ticket
   - Create ticket record with balance: 1
```

### 4.3 Proposal Flow

```
1. User searches and views profiles
   ↓
2. User clicks "Ajukan Taaruf"
   ↓
3. Check ticket balance (must >= 1)
   ↓
4. Show confirmation modal
   ↓
5. User confirms
   ↓
6. Deduct 1 ticket
   ↓
7. Create proposal record (status: pending)
   ↓
8. Run AI compatibility analysis
   ↓
9. Store AI analysis in proposal
   ↓
10. Send notification to receiver
   ↓
11. Redirect to proposals page
```

### 4.4 Proposal Acceptance Flow

```
1. Receiver views proposal
   ↓
2. Receiver sees AI analysis
   ↓
3. Receiver clicks "Terima"
   ↓
4. Update proposal status to 'accepted'
   ↓
5. Create relationship record (status: taaruf)
   ↓
6. Set taaruf_started_at
   ↓
7. Send notification to both parties
   ↓
8. Send WhatsApp notification to both guardians
   ↓
9. Redirect to relationship detail
```

### 4.5 Chat Flow

```
1. Relationship status is 'taaruf' or higher
   ↓
2. User sends message
   ↓
3. Validate user is part of relationship
   ↓
4. Create chat record
   ↓
5. Send real-time notification to receiver
   ↓
6. Update chat UI
```

### 4.6 Khitbah Flow

```
1. User clicks "Lanjut ke Khitbah"
   ↓
2. Check ticket balance (must >= 10)
   ↓
3. Show confirmation modal
   ↓
4. User confirms
   ↓
5. Create khitbah request (status: pending_khitbah)
   ↓
6. Send notification to partner
   ↓
7. Partner accepts
   ↓
8. Deduct 10 tickets from requester
   ↓
9. Update relationship status to 'khitbah'
   ↓
10. Set khitbah_started_at
   ↓
11. Send WhatsApp notification to both guardians
   ↓
12. Show contact information to both parties
```

### 4.7 Ticket Purchase Flow

```
1. User selects package
   ↓
2. Redirect to payment gateway
   ↓
3. User completes payment
   ↓
4. Payment gateway sends webhook
   ↓
5. Create transaction record (status: success)
   ↓
6. Add tickets to user balance
   ↓
7. Send notification to user
```

---

## 5. Privacy & Security

### 5.1 Privacy Levels by Relationship Status

| Data | Stranger | Pending | Taaruf | Khitbah | Married |
|------|----------|---------|--------|---------|---------|
| Photo (face) | Blur (100%) | Blur (100%) | Clear | Clear | Clear |
| Name | Code/Samran | Code/Samran | Nickname | Real Name | Real Name |
| Chat | Locked | Locked | Unlocked | Unlocked | Unlocked |
| WhatsApp | Hidden | Hidden | Hidden | Visible | Visible |
| Guardian Name | Hidden | Hidden | Visible | Visible | Visible |
| Guardian Phone | Hidden | Hidden | Hidden | Visible | Visible |

### 5.2 Security Measures

#### 5.2.1 Authentication
- Password hashing with bcrypt (cost factor: 10)
- Session-based authentication
- CSRF protection on all POST requests
- Rate limiting on auth endpoints (5 requests/minute)

#### 5.2.2 Authorization
- Role-based access control (user, admin, wali)
- Middleware checks for protected routes
- User ownership validation for data access

#### 5.2.3 Data Protection
- Input validation with Zod schemas
- SQL injection prevention via Knex parameterized queries
- XSS prevention via Eta template escaping
- File upload validation (type, size)

#### 5.2.4 Privacy Controls
- Photo blur using CSS `blur(8px)` filter
- Anti-screenshot protection (screen capture API)
- Watermarking on unblurred photos
- Read-only chat access for guardians

#### 5.2.5 Rate Limiting
- Auth endpoints: 5 req/min
- API endpoints: 60 req/min
- Search endpoints: 30 req/min

---

## 6. AI Compatibility Analysis

### 6.1 Analysis Logic

The AI compatibility analysis evaluates potential matches based on:

1. **Demographic Compatibility**
   - Age difference (ideal: 0-10 years)
   - Location proximity

2. **Religious Alignment**
   - Religious practice level
   - Prayer frequency
   - Religious knowledge

3. **Values & Vision**
   - Marriage vision similarity
   - Life goals alignment
   - Family planning preferences

4. **Lifestyle Factors**
   - Education level match
   - Income compatibility
   - Occupation stability

5. **Criteria Matching**
   - How well each meets the other's criteria
   - Deal-breaker flags

### 6.2 Analysis Output Structure

```json
{
  "compatibility_score": 85,
  "strengths": [
    "Visi pernikahan yang sejalan",
    "Latar belakang pendidikan yang serupa",
    "Lokasi domisili berdekatan"
  ],
  "potential_concerns": [
    "Perbedaan usia cukup jauh (12 tahun)",
    "Perbedaan pendapatan yang signifikan"
  ],
  "recommendations": [
    "Diskusikan rencana keuangan sejak awal",
    "Pastikan visi masa depan sudah sinkron"
  ],
  "key_points": [
    "Keduanya aktif beribadah",
    "Memiliki nilai keluarga yang kuat"
  ]
}
```

---

## 7. Notification System

### 7.1 Notification Types

| Type | Trigger | Recipients |
|------|---------|------------|
| `proposal_received` | New proposal | Receiver |
| `proposal_accepted` | Proposal accepted | Sender |
| `proposal_rejected` | Proposal rejected | Sender |
| `chat_message` | New chat message | Receiver |
| `khitbah_requested` | Khitbah request | Partner |
| `khitbah_accepted` | Khitbah accepted | Requester |
| `relationship_ended` | Relationship ended | Both parties |
| `ticket_purchased` | Tickets purchased | User |
| `profile_verified` | Profile verified | User |

### 7.2 Notification Channels

1. **In-App Notifications**
   - Stored in database
   - Real-time updates via polling/WebSocket
   - Dropdown UI with badge counter

2. **WhatsApp Notifications**
   - Guardian notifications for status changes
   - Important alerts (Taaruf started, Khitbah started)
   - Using WhatsApp Business API

---

## 8. File Storage

### 8.1 Storage Structure

```
storage/
├── uploads/
│   ├── ktp/
│   │   └── {user_id}/{filename}
│   ├── selfie/
│   │   └── {user_id}/{filename}
│   └── profiles/
│       └── {user_id}/{filename}
```

### 8.2 File Upload Rules

- **KTP**: Max 5MB, JPG/PNG only
- **Selfie**: Max 5MB, JPG/PNG only
- **Profile Photo**: Max 2MB, JPG/PNG only
- **Validation**: Check file type, size, dimensions
- **Naming**: UUID-based filenames for security

---

## 9. Payment Integration

### 9.1 Payment Gateway

Using payment gateway (e.g., Xendit, Midtrans) for ticket purchases.

### 9.2 Payment Flow

```
1. User selects package
   ↓
2. Create transaction record (status: pending)
   ↓
3. Generate payment link
   ↓
4. Redirect to payment page
   ↓
5. User completes payment
   ↓
6. Payment gateway sends webhook
   ↓
7. Verify webhook signature
   ↓
8. Update transaction status
   ↓
9. Add tickets to user balance
   ↓
10. Send confirmation notification
```

### 9.3 Webhook Security

- Verify webhook signature
- Check transaction status
- Prevent duplicate processing
- Log all webhook events

---

## 10. Performance Considerations

### 10.1 Database Optimization

- Indexes on frequently queried columns
- Query optimization with Knex
- Connection pooling

### 10.2 Caching Strategy

- Redis for session storage
- Cache user profiles (5 min TTL)
- Cache search results (2 min TTL)
- Cache notification counts (1 min TTL)

### 10.3 Frontend Optimization

- Code splitting with Vite
- Lazy loading for images
- Debounced search input
- Optimized bundle size

---

## 11. Deployment Architecture

### 11.1 Production Environment

```
┌─────────────────┐
│   Load Balancer │
└────────┬────────┘
         │
    ┌────▼────┐
    │  Nginx  │
    └────┬────┘
         │
    ┌────▼────────────────────┐
    │   Application Server    │
    │   (Node.js + HyperExpress)│
    └────┬────────────────────┘
         │
    ┌────▼────┐  ┌───────┐  ┌──────────┐
    │ SQLite  │  │ Redis │  │   S3     │
    └─────────┘  └───────┘  └──────────┘
```

### 11.2 Environment Variables

```env
# App
APP_NAME=JemputJodoh
APP_ENV=production
APP_URL=https://jemputjodoh.id
APP_PORT=5555

# Database
DB_PATH=./storage/database.sqlite

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS S3
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_REGION=ap-southeast-1
AWS_BUCKET=jemputjodoh-uploads

# Payment Gateway
PAYMENT_API_KEY=xxx
PAYMENT_SECRET_KEY=xxx

# WhatsApp API
WA_API_KEY=xxx
WA_PHONE_NUMBER=xxx

# Session
SESSION_SECRET=xxx
SESSION_EXPIRY=86400

# Mail
MAIL_HOST=smtp.resend.com
MAIL_PORT=587
MAIL_USER=resend
MAIL_KEY=xxx
```

---

## 12. Testing Strategy

### 12.1 Unit Tests

- Controller logic
- Service functions
- Validation schemas
- Utility functions

### 12.2 Integration Tests

- API endpoints
- Database operations
- Authentication flow
- Payment webhooks

### 12.3 E2E Tests

- User registration flow
- Onboarding flow
- Proposal flow
- Chat functionality
- Ticket purchase flow

---

## 13. Monitoring & Logging

### 13.1 Logging

- Application logs (info, warning, error)
- Access logs
- Error tracking
- Performance metrics

### 13.2 Monitoring

- Server health checks
- Database performance
- Response time monitoring
- Error rate tracking

---

## 14. Future Enhancements

### 14.1 Planned Features

- Video call integration for Taaruf
- Background verification service
- AI-powered matching suggestions
- Mobile app (React Native)
- Multi-language support (Indonesia, English)

### 14.2 Technical Improvements

- WebSocket for real-time chat
- CDN for static assets
- Database migration to PostgreSQL (for scaling)
- Microservices architecture (for future scaling)

---

*This Technical Design Document serves as the blueprint for implementing JemputJodoh.id with the Laju framework.*