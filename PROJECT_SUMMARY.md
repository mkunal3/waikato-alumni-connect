# Project Summary - Waikato Alumni Connect

## Overview

Waikato Alumni Connect is a full-stack mentoring platform that connects Waikato University students with alumni mentors. The platform facilitates meaningful mentorship relationships through a structured match-making process with admin oversight.

## Key Features

### For Students
- Register with student ID and Waikato email
- Complete comprehensive profile (academic, personal, professional)
- Browse available alumni mentors (after approval)
- Request matches with cover letters
- View active mentor relationships
- Upload CV metadata

### For Alumni
- Register with invitation code
- Create mentor profile with skills and expertise
- View pending match requests (admin-approved)
- Accept or decline match requests
- View active mentees
- Manage profile information

### For Admins
- Approve/reject student registrations
- Review and approve match requests
- View all students, alumni, and matches
- Manage alumni invitation codes
- Access comprehensive dashboard with statistics
- Filter and sort user lists

## Technology Stack

### Frontend
- React 18.3.1 with TypeScript
- Vite for build tooling
- React Router for navigation
- Radix UI components
- Lucide React icons

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL database
- Prisma ORM
- JWT authentication
- bcryptjs for password hashing

See `TECHNICAL_STACK.md` for complete details.

## Getting Started

### Quick Setup
1. Install dependencies: `npm install` in both `backend/` and `frontend/`
2. Configure database: Create `.env` in `backend/` with `DATABASE_URL`
3. Run migrations: `npx prisma migrate deploy`
4. Generate Prisma client: `npx prisma generate`
5. Start backend: `npm run dev` in `backend/`
6. Start frontend: `npm run dev` in `frontend/`

See `SETUP_GUIDE.md` for detailed instructions.

## Workflow Overview

1. **Student Registration**: Register → Login → Edit Profile → Wait for Admin Approval
2. **Student Match Request**: Browse Mentors → Request Match → Admin Approves → Alumni Accepts → Active Match
3. **Alumni Registration**: Register with Invitation Code → Auto-Approved → View Requests → Accept/Decline

See `WORKFLOW_GUIDE.md` for complete workflow details.

## System Architecture Notes

### Registration Flow
- Students: No email verification required, immediate login after registration, admin approval required for mentor browsing
- Alumni: Invitation code required, auto-approved upon registration, full access immediately

### Match Process
- Two-step approval workflow: Admin approves → Alumni accepts
- Cover letter required for all match requests (minimum 100 characters)

### Approval Status
- Students: Start with "pending" status, can log in and edit profile but cannot browse mentors until approved
- Alumni: Auto-approved upon registration

### Database Schema
- `User` model: Comprehensive profile fields for students, alumni, and admins
- `Match` model: Tracks match lifecycle (pending → confirmed → accepted)
- `InvitationCode` model: Manages alumni registration invitation codes
- `Message` model: Stores chat messages between matched students and alumni

## Testing Accounts (from seed)

After running `npm run seed` in backend:
- **Admin**: email: `admin@test.com`, password: `admin123`
- **Test Student**: email: `student@test.com`, password: `student123`
- **Test Alumni**: email: `alumni@test.com`, password: `alumni123`
- **Invitation Code**: `TEST-ALUMNI-2025`

## Project Structure

```
waikato-alumni-connect/
├── backend/          # Express API server
├── frontend/         # React application
├── TECHNICAL_STACK.md    # Technology details
├── SETUP_GUIDE.md        # Setup instructions
├── WORKFLOW_GUIDE.md     # User workflows
└── PROJECT_SUMMARY.md    # This file
```

## Production Deployment Requirements

1. Configure SMTP for email notifications (optional)
2. Set up production database (PostgreSQL)
3. Configure CORS for production domains
4. Set strong JWT_SECRET environment variable
5. Enable HTTPS for all connections
6. Set up file storage for CV uploads (currently supports metadata and file storage)
7. Configure error monitoring/logging
8. Set up database backup procedures

## Documentation

- Technical details: See `TECHNICAL_STACK.md`
- Setup instructions: See `SETUP_GUIDE.md`
- Workflow details: See `WORKFLOW_GUIDE.md`
- API documentation: See `frontend/BACKEND_API_DOCUMENTATION.md`

