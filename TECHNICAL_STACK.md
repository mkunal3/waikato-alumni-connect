# Technical Stack

## Frontend

### Core Technologies
- **React 18.3.1** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite 6.3.5** - Build tool and development server
- **React Router DOM 7.10.1** - Client-side routing

### UI Components
- **Radix UI** - Headless UI component library
  - Used for: Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu, Select, Tabs, Tooltip, etc.
- **Lucide React 0.487.0** - Icon library
- **Tailwind CSS** (via class-variance-authority) - Utility-first CSS framework

### State Management
- **React Context API** - For authentication and language settings
- **React Hooks** - useState, useEffect for local component state

### Styling
- Inline styles (current implementation)
- Component-based styling approach

## Backend

### Core Technologies
- **Node.js** - Runtime environment
- **Express 5.1.0** - Web application framework
- **TypeScript** - Type-safe JavaScript
- **ts-node-dev** - Development server with hot reload

### Database
- **PostgreSQL** - Relational database
- **Prisma 6.19.0** - ORM (Object-Relational Mapping)
  - Database migrations
  - Type-safe database client
  - Schema management

### Authentication & Security
- **JWT (jsonwebtoken 9.0.3)** - Token-based authentication
- **bcryptjs 3.0.3** - Password hashing

### Email Service (Optional)
- **Nodemailer 6.10.1** - Email sending (currently using console fallback for development)
- Supports SMTP configuration for production email sending

### Additional Libraries
- **CORS** - Cross-Origin Resource Sharing middleware

## Development Tools

### Backend
- **ts-node** - TypeScript execution for Node.js
- **ts-node-dev** - Development server with watch mode
- **TypeScript 5.9.3** - Type checking and compilation

### Frontend
- **@vitejs/plugin-react-swc** - Fast React plugin for Vite
- **ESLint** (if configured) - Code linting

## Project Structure

```
waikato-alumni-connect/
├── backend/              # Backend API server
│   ├── src/
│   │   ├── auth/        # Authentication routes (login, register)
│   │   ├── routes/      # API routes (admin, student, mentor, match, profile)
│   │   ├── services/    # Business logic (email service)
│   │   ├── middleware/  # Auth middleware
│   │   └── prisma.ts    # Prisma client
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   ├── migrations/    # Database migrations
│   │   └── seed.ts        # Database seeding
│   └── package.json
│
├── frontend/            # React frontend application
│   ├── src/
│   │   ├── pages/      # Page components (dashboards, profiles, etc.)
│   │   ├── components/ # Reusable UI components
│   │   ├── config/     # Configuration (API endpoints, content, styles)
│   │   ├── contexts/   # React contexts (Auth, Language)
│   │   └── types/      # TypeScript type definitions
│   └── package.json
│
└── README.md
```

## Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/database_name"

# JWT
JWT_SECRET="your-secret-key-here"

# Email (Optional - for production email sending)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM=noreply@waikato-connect.ac.nz
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:4000
```

## Port Configuration

- **Frontend**: http://localhost:3000 (default Vite port)
- **Backend**: http://localhost:4000

## Database Models

### User
- Students, Alumni, Admins
- Profile information (academic, professional, personal)
- Approval status (pending/approved/rejected)

### Match
- Student-Alumni mentor relationships
- Status tracking (pending/confirmed/accepted)
- Cover letter from student
- Match score and reasons

### EmailVerification
- Verification codes for email validation (currently not required for student registration)
- 10-minute expiration

### InvitationCode
- Alumni registration invitation codes
- Active/inactive status

## API Architecture

### Authentication Routes
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile

### Student Routes
- `GET /student/mentors` - List available mentors
- `POST /student/cv` - Upload CV metadata
- `GET /student/cv` - Get CV metadata

### Mentor Routes
- `GET /mentor/pending-requests` - Get pending match requests
- `GET /mentor/mentees` - Get active mentees
- `POST /mentor/requests/:requestId/accept` - Accept match request
- `POST /mentor/requests/:requestId/decline` - Decline match request

### Match Routes
- `POST /match/request` - Student requests a match
- `POST /match/:matchId/approve` - Admin approves match
- `POST /match/:matchId/reject` - Admin rejects match
- `GET /match/my` - Get current user's match

### Admin Routes
- `GET /admin/statistics` - Dashboard statistics
- `GET /admin/students/pending` - Pending student approvals
- `GET /admin/students` - All students
- `GET /admin/alumni` - All alumni
- `GET /admin/matches` - All matches
- `POST /admin/students/:id/approve` - Approve student
- `POST /admin/students/:id/reject` - Reject student
- `GET /admin/invitation-code` - Get active invitation code
- `POST /admin/invitation-code` - Create new invitation code

### Profile Routes
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

## Development Workflow

1. **Backend Development**
   ```bash
   cd backend
   npm install
   npm run dev  # Starts server on port 4000
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm install
   npm run dev  # Starts dev server on port 3000
   ```

3. **Database Migrations**
   ```bash
   cd backend
   npx prisma migrate dev  # Create new migration
   npx prisma migrate deploy  # Apply migrations
   npx prisma generate  # Regenerate Prisma client
   ```

4. **Database Seeding**
   ```bash
   cd backend
   npm run seed  # Seed database with initial data
   ```

## Production Considerations

1. **Email Configuration**: Configure SMTP settings in `.env` for production email sending
2. **JWT Secret**: Use a strong, random JWT secret in production
3. **Database**: Use a managed PostgreSQL database in production
4. **Environment Variables**: Never commit `.env` files to version control
5. **Build Process**: Frontend should be built (`npm run build`) and served via a web server
6. **CORS**: Configure CORS properly for production domains

