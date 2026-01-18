# Deployment Checklist

## Pre-Deployment

- [ ] All code changes committed and pushed to GitHub
- [ ] Database migrations are up to date
- [ ] Environment variables documented in `.env.example` files
- [ ] Dockerfile tested locally (optional)
- [ ] No sensitive data in code (API keys, passwords, etc.)

## Backend Deployment (Railway)

### Step 1: Create Railway Account
- [ ] Sign up at https://railway.app with GitHub
- [ ] Authorize Railway to access your GitHub repositories

### Step 2: Create Project
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your repository

### Step 3: Add PostgreSQL Database
- [ ] Click "+ New" in project
- [ ] Select "Database" -> "PostgreSQL"
- [ ] Wait for database to be created
- [ ] Copy the `DATABASE_URL` from database service variables

### Step 4: Deploy Backend Service
- [ ] Click "+ New" -> "GitHub Repo" (or add service)
- [ ] Select the same repository
- [ ] In service settings, set Root Directory to `backend`
- [ ] Railway will auto-detect Dockerfile

### Step 5: Configure Environment Variables
Add these in the backend service "Variables" tab:
- [ ] `DATABASE_URL` = (from PostgreSQL service)
- [ ] `JWT_SECRET` = (generate: `openssl rand -hex 32`)
- [ ] `NODE_ENV` = `production`
- [ ] `FRONTEND_URL` = `http://localhost:3000` (update after frontend deployment)
- [ ] `PORT` = `4000`

### Step 6: Run Database Migrations
- [ ] Wait for first deployment to complete
- [ ] Open service Shell/Terminal
- [ ] Run: `npx prisma migrate deploy`
- [ ] Verify migrations completed successfully

### Step 7: Get Backend URL
- [ ] Copy the backend service URL (e.g., `https://xxx.up.railway.app`)
- [ ] Test the URL in browser: should see `{"message":"Waikato Connect API is running"}`

## Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
- [ ] Sign up at https://vercel.com with GitHub
- [ ] Authorize Vercel to access your GitHub repositories

### Step 2: Import Project
- [ ] Click "Add New..." -> "Project"
- [ ] Select your repository

### Step 3: Configure Project
- [ ] Root Directory: Select `frontend` folder
- [ ] Framework Preset: Vite (auto-detected)
- [ ] Build Command: `npm run build` (default)
- [ ] Output Directory: `build` (default)

### Step 4: Set Environment Variables
- [ ] Click "Environment Variables"
- [ ] Add: `VITE_API_BASE_URL` = (your backend URL from Railway)

### Step 5: Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Copy the frontend URL (e.g., `https://xxx.vercel.app`)

## Post-Deployment Configuration

### Update Backend CORS
- [ ] Go back to Railway backend service
- [ ] Update `FRONTEND_URL` environment variable to your Vercel URL
- [ ] Service will auto-redeploy

### Verify Deployment
- [ ] Visit frontend URL
- [ ] Test login functionality
- [ ] Test API connection (check browser console for errors)
- [ ] Test chat functionality (Socket.io connection)

## Troubleshooting

### Backend Issues
- Check Railway service logs for errors
- Verify all environment variables are set
- Ensure database migrations ran successfully
- Check if port is correctly configured

### Frontend Issues
- Check Vercel build logs
- Verify `VITE_API_BASE_URL` is correct
- Check browser console for CORS errors
- Verify backend URL is accessible

### Database Issues
- Verify `DATABASE_URL` is correct
- Check if migrations completed: `npx prisma migrate status`
- Ensure database is accessible from backend service

### Socket.io Issues
- Verify backend CORS includes frontend URL
- Check backend logs for connection errors
- Ensure WebSocket is supported (Railway supports it)

## Alternative: Render Deployment

If Railway doesn't work, use Render:

### Backend on Render
- [ ] Create PostgreSQL database (Free tier)
- [ ] Create Web Service
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Set environment variables (same as Railway)
- [ ] Run migrations in Shell: `npx prisma migrate deploy`

### Frontend on Render
- [ ] Create Static Site
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `build`
- [ ] Set environment variable: `VITE_API_BASE_URL`
