# AI-Assisted Appointment Booking System

A simplified end-to-end SaaS-style web application that includes an AI-assisted chatbot for appointment scheduling.

## Overview

This project demonstrates:

- Clean frontend/backend separation
- Practical REST API design
- PostgreSQL data modeling
- JWT-based authentication
- AI integration using Mistral API
- Structured conversational booking workflow

---

## 🏗 High-Level Architecture

### System Overview

```
Frontend (React + Vite + Tailwind)
           ↓
Backend (Node.js + Express)
           ↓
PostgreSQL Database
           ↓
Mistral AI API
```

### Backend Architecture

The backend follows a clean layered architecture:

```
Routes
  ↓
Controllers
  ↓
Services (Business Logic)
  ↓
Database Layer (PostgreSQL)
```

**Key Principles:**

- Clear separation of concerns
- Business logic isolated in service layer
- AI logic separated from booking logic
- Database-level integrity enforcement
- Centralized error handling
- JWT-protected routes

### Frontend Architecture

Built using:

- **React** (Vite)
- **Tailwind CSS**
- **Context API** for global auth state
- **API abstraction layer**

**Project Structure:**

```
src/
├── api/          → API service layer
├── components/   → Reusable UI components
├── context/      → Auth state management
├── pages/        → Route-level pages
└── lib/          → Utility functions
```

The frontend is designed as a lightweight SaaS-style interface with:

- Chat UI
- Booking form
- Appointment management
- Authentication screens

---

## 🤖 AI Integration

### AI Capabilities

AI is used for:

- Intent detection
- Interpreting appointment-related queries
- Formatting backend responses in a professional manner

### Important Architectural Decision

The AI **does NOT**:

- Make booking decisions
- Modify database state
- Invent availability

**All business logic is handled by backend services.** The AI only assists with language interpretation and formatting. This ensures predictable system behavior and safe AI usage.

---

## 🗄 Database Design

### PostgreSQL Schema

The database includes the following tables:

- `users`
- `user_profiles`
- `appointments`
- `chat_sessions`
- `chat_messages`

### Key Design Decisions

- **Partial unique index** prevents double booking
- **Foreign key constraints** enforce integrity
- **Indexed appointment dates** for fast lookups
- **Chat messages stored per session** for session isolation
- **Booking cancellation window** enforced in service layer

The schema is normalized and designed for SaaS-style extensibility.

---

## 🔐 Authentication

### Implementation

Authentication is implemented using:

- **Bcrypt** password hashing
- **JWT access tokens** (1-hour expiration)
- **Middleware-based** route protection

### Supported Features

- Register
- Login
- View profile
- Update profile

This implementation satisfies the assessment requirement of basic JWT authentication.

---

## 💬 Core Workflow

### 1. User Authentication

User registers or logs in to receive a JWT.

### 2. Start Chat Session

User initiates a chat session.

### 3. Availability Check

Users can:

- Ask conversationally
- Use structured booking form

Backend checks availability using 30-minute slots between **9 AM–5 PM UTC**.

### 4. Appointment Booking

If slot is available:

- Appointment is created
- Unique DB constraint prevents double booking

### 5. Cancellation

Users may cancel within **2 hours** of booking creation.

---

## ⚙️ How to Run the Project Locally

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd project-root
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
JWT_SECRET=your_secret_key
MISTRAL_API_KEY=your_mistral_key
MISTRAL_MODEL=mistral-small-latest
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=appointment_booking
DB_PORT=5432
DB_SSL=false
```

Run the backend:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Database Setup

1. Install PostgreSQL
2. Create database
3. Run provided schema SQL file

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🎯 Key Design Decisions & Tradeoffs

### 1. AI Boundary Enforcement

**Decision:** AI does not control business logic.

**Reason:** Ensures deterministic backend behavior and prevents hallucinated bookings.

### 2. Slot-Based Scheduling

**Decision:** Fixed 30-minute intervals between 9 AM–5 PM UTC.

**Reason:** Simplifies scheduling logic while demonstrating domain modeling.

### 3. Database-Level Double Booking Protection

**Decision:** Use partial unique index on appointment_date.

**Reason:** Database integrity > application-only validation.

### 4. Service Layer Separation

**Decision:** Controllers are thin. Business logic lives in services.

**Reason:** Improves testability and maintainability.

### 5. Rate Limiting on Chat

**Decision:** Limit chat messages per 15 minutes.

**Reason:** Prevents abuse of AI endpoint.

---

## ⚠️ Assumptions

- Single business context (no multi-tenancy implemented)
- All users operate in UTC time for scheduling
- Email-based password recovery is not implemented
- Real-time chat implemented via request-response model (not WebSockets)

---

## 🚧 Known Limitations

- No email verification
- No password reset email delivery
- No role-based authorization beyond basic user role
- No calendar UI visualization
- No horizontal scaling setup
- Chat memory limited to session history

These were intentionally scoped out to focus on core AI-assisted booking workflow.

---

## 🧠 Evaluation Focus Alignment

This project demonstrates:

- API clarity and consistency
- Secure JWT authentication
- Practical AI integration
- Clean database modeling
- Clear service boundaries
- Structured conversational UX
- SaaS-style architecture thinking

---

## 📌 Future Improvements

- Multi-tenant support
- Timezone-aware booking
- Email notifications
- WebSocket real-time chat
- Admin dashboard
- Rescheduling feature
- Background job queue for AI processing

---

## 🎓 Conclusion

This project was built to demonstrate practical full-stack engineering skills, clean architecture, and responsible AI integration within a SaaS-style application.

The focus was on clarity, maintainability, and realistic product-level implementation rather than production-scale complexity.

---
