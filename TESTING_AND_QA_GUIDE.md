# Waikato Alumni Connect - Testing & QA Guide

## Project Overview
- **Backend**: Express.js REST API (Port 4000) - TypeScript
- **Frontend**: React + Vite - TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Current Status**: Development phase

---

## Table of Contents
1. [Backend Testing](#backend-testing)
2. [Frontend Testing](#frontend-testing)
3. [Integration Testing](#integration-testing)
4. [Common Issues & Solutions](#common-issues--solutions)
5. [QA Checklist](#qa-checklist)

---

## Backend Testing

### Setup Backend
```bash
cd backend
npm install
```

### Start Backend Development Server
```bash
npm run dev
```
✅ Server should run on `http://localhost:4000`

### Database Setup (if first time)
```bash
# Apply migrations
npx prisma migrate dev

# Seed database (optional)
npm run seed

# View database GUI
npx prisma studio
```

### API Endpoint Testing

#### 1. **Health Check**
```bash
curl http://localhost:4000/
```
✅ Expected: Should return a health check response

#### 2. **User Registration** - `/auth/register` (POST)
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'
```

**Test Cases:**
- ✅ Valid registration → Should return `201` with user data
- ❌ Missing required fields → Should return `400`
- ❌ Invalid email format → Should return `400`
- ❌ Duplicate email → Should return `400`
- ❌ Invalid role (not student/alumni/admin) → Should return `400`

**Important**: New users always have `approvalStatus: "pending"`

#### 3. **User Login** - `/auth/login` (POST)
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Test Cases:**
- ✅ Correct credentials → Should return `200` with JWT token
- ❌ Wrong password → Should return `401`
- ❌ Non-existent email → Should return `401`
- ❌ Missing fields → Should return `400`

#### 4. **Get All Users** - `/users` (GET)
```bash
curl http://localhost:4000/users
```

✅ Should return array of all users

### Backend Type Safety Check
```bash
cd backend
npm run build
```
✅ Should compile without TypeScript errors

---

## Frontend Testing

### Setup Frontend
```bash
cd frontend
npm install
```

### Start Frontend Development Server
```bash
npm run dev
```
✅ Application should open at `http://localhost:5173`

### Frontend Testing Checklist

**Verify:**
- [ ] Page loads without console errors
- [ ] All UI components render correctly
- [ ] Forms are accessible (labels, placeholders visible)
- [ ] Responsive design works on different screen sizes
- [ ] Navigation between pages works

### Frontend Build Check
```bash
npm run build
```
✅ Should build without errors and create `dist/` folder

---

## Integration Testing

### Full System Test Flow

#### 1. **Start Both Servers**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

#### 2. **Test Registration Flow**
1. Open `http://localhost:5173`
2. Navigate to registration/signup page
3. Fill in form:
   - Name: "Test Alumni"
   - Email: "testalumni@example.com"
   - Password: "secure123"
   - Role: "alumni"
4. Click Submit
5. Verify:
   - [ ] No error messages
   - [ ] User created in backend (check with `npx prisma studio`)
   - [ ] Appropriate success/feedback message shown

#### 3. **Test Login Flow**
1. Use credentials from registration
2. Login
3. Verify:
   - [ ] JWT token received
   - [ ] User redirected to appropriate dashboard
   - [ ] User info displayed correctly

#### 4. **Test Database Consistency**
```bash
npx prisma studio
```
- [ ] Verify user records match what was registered
- [ ] Check `approvalStatus` is "pending" for new users
- [ ] Check `createdAt` timestamps are recent

---

## Common Issues & Solutions

### Issue 1: Backend Port Already in Use
**Error**: `Error: listen EADDRINUSE :::4000`
**Solution**:
```bash
# Find process on port 4000
netstat -ano | findstr :4000

# Kill it (replace PID)
taskkill /PID <PID> /F

# Or use different port by modifying backend src/index.ts
```

### Issue 2: Database Connection Failed
**Error**: `PrismaClientInitializationError`
**Solution**:
- [ ] Check PostgreSQL is running
- [ ] Verify `.env` file has correct DATABASE_URL
- [ ] Try: `npx prisma migrate reset`

### Issue 3: Frontend Can't Connect to Backend
**Error**: CORS errors or network failures
**Solution**:
- [ ] Verify backend is running on `http://localhost:4000`
- [ ] Check frontend is making requests to correct URL
- [ ] CORS should be enabled in backend (check `src/index.ts`)

### Issue 4: TypeScript Compilation Errors
**Error**: `error TS2...`
**Solution**:
```bash
cd backend
npm run build
```
Check error messages and fix type mismatches

### Issue 5: Node Modules Issues
**Solution**:
```bash
# Clear and reinstall
rm -r node_modules
rm package-lock.json
npm install
```

---

## QA Checklist

### Pre-Release QA

#### Backend API
- [ ] All endpoints return correct status codes
- [ ] Error messages are consistent
- [ ] No sensitive data in error responses
- [ ] Password hashing works (bcryptjs with 10 rounds)
- [ ] Database operations don't have N+1 queries
- [ ] Environment variables properly used
- [ ] TypeScript builds without errors

#### Frontend
- [ ] No console errors on page load
- [ ] All pages render properly
- [ ] Forms validate input correctly
- [ ] API calls show loading states
- [ ] Error messages display appropriately
- [ ] Mobile responsiveness verified
- [ ] Build completes successfully

#### Integration
- [ ] Registration → Login → Dashboard works end-to-end
- [ ] Data persists in database
- [ ] JWT token validation works
- [ ] Unauthorized requests rejected properly
- [ ] Cross-origin requests work (CORS)

#### Database
- [ ] Migrations applied cleanly
- [ ] Data relationships intact
- [ ] No orphaned records
- [ ] Indexes on frequently queried columns
- [ ] Timestamps are accurate

### Performance Checks
- [ ] Backend responds in < 200ms for simple queries
- [ ] Frontend page load < 3 seconds
- [ ] No memory leaks in frontend (check DevTools)
- [ ] Database query performance acceptable

---

## Testing Tools

### Browser DevTools
- **Network Tab**: Check API requests/responses
- **Console**: View errors and warnings
- **Application Tab**: Check localStorage/cookies for tokens

### Postman
- Download: https://www.postman.com/downloads/
- Import endpoints and test manually

### cURL
- Built-in command-line tool for API testing
- Use examples provided in this guide

### Prisma Studio
```bash
npx prisma studio
```
- Visual database browser
- Add/edit/delete records easily

---

## Things to Watch For

⚠️ **Critical Issues to Report**:
- Unhandled errors causing crashes
- Data not saving to database
- CORS blocking legitimate requests
- Password hashing failures
- Missing required validations
- Type errors in TypeScript

⚠️ **Important but Non-Critical**:
- UI alignment issues
- Slow performance
- Inconsistent error messages
- Missing error handling in edge cases

---

## Next Steps for Issues Found

When you find an issue:
1. **Document it clearly** with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages/screenshots
   - Which endpoint/component affected
2. **Run diagnostics**:
   - Check console for errors
   - Verify backend is running
   - Check database with `npx prisma studio`
3. **Tell me**:
   - Issue description
   - Reproduction steps
   - Error details
   - I'll fix without changing architecture

---

**Happy Testing! 🧪**
