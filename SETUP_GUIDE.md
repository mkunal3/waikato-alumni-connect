# Setup Guide

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn** package manager
- **Git** (for cloning the repository)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd waikato-alumni-connect
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Database Configuration

Create a PostgreSQL database:

```sql
CREATE DATABASE waikato_connect;
```

Create `.env` file in `backend/` directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/waikato_connect"
JWT_SECRET="your-random-secret-key-here-minimum-32-characters"
```

**Important**: Replace `username`, `password`, and `your-random-secret-key-here` with your actual values.

### 4. Run Database Migrations

```bash
cd backend
npx prisma migrate deploy
```

This will apply all database migrations and create the necessary tables.

### 5. Seed Database (Optional)

```bash
cd backend
npm run seed
```

This creates:
- An admin user (email: `admin@test.com`, password: `admin123`)
- A test student (email: `student@test.com`, password: `student123`)
- A test alumni (email: `alumni@test.com`, password: `alumni123`)
- An invitation code: `TEST-ALUMNI-2025`

### 6. Generate Prisma Client

```bash
cd backend
npx prisma generate
```

### 7. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file in `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:4000
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Backend server will start on `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:3000`

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the dist/ folder using a web server (nginx, Apache, etc.)
```

## First-Time Setup Checklist

- [ ] Install Node.js and PostgreSQL
- [ ] Clone repository
- [ ] Run `npm install` in both `backend/` and `frontend/` directories
- [ ] Create PostgreSQL database
- [ ] Create `backend/.env` with database URL and JWT secret
- [ ] Run database migrations (`npx prisma migrate deploy`)
- [ ] Generate Prisma client (`npx prisma generate`)
- [ ] (Optional) Seed database with test data
- [ ] Create `frontend/.env.local` with API base URL
- [ ] Start backend server (`npm run dev` in `backend/`)
- [ ] Start frontend server (`npm run dev` in `frontend/`)
- [ ] Access application at `http://localhost:3000`

## Troubleshooting

### Database Connection Issues

1. Verify PostgreSQL is running:
   ```bash
   psql -U username -d postgres
   ```

2. Check DATABASE_URL in `.env` matches your PostgreSQL configuration

3. Ensure database exists:
   ```sql
   \l  -- List databases in psql
   ```

### Port Already in Use

If port 4000 (backend) or 3000 (frontend) is already in use:

**Backend**: Change port in `backend/src/index.ts`:
```typescript
const PORT = 4001; // Change from 4000
```

**Frontend**: Change port in `frontend/vite.config.ts` or use:
```bash
npm run dev -- --port 3001
```

### Prisma Client Not Generated

If you see "PrismaClient is not generated" errors:

```bash
cd backend
npx prisma generate
```

### Migration Issues

If migrations fail:

```bash
cd backend
npx prisma migrate reset  # WARNING: This will delete all data
npx prisma migrate deploy
```

Or manually check migration status:
```bash
npx prisma migrate status
```

## Environment-Specific Configuration

### Development
- Uses console logging for email verification codes
- No SMTP configuration required
- Local PostgreSQL database

### Production
- Requires SMTP configuration for email sending
- Use production-grade PostgreSQL database
- Set strong JWT_SECRET
- Configure proper CORS settings
- Use HTTPS for all connections

## Additional Setup for Email Functionality (Optional)

If you want to enable real email sending in production:

1. Choose an email service provider (SendGrid, AWS SES, Mailgun, etc.)
2. Get SMTP credentials
3. Add to `backend/.env`:
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=your-api-key
   SMTP_FROM=noreply@waikato-connect.ac.nz
   ```
4. Restart backend server

Without SMTP configuration, verification codes will be logged to the console in development mode.

