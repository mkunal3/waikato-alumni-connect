# Quick Deployment Guide

## Overview

This project requires two separate deployments:
1. **Backend** (Railway or Render) - Supports WebSocket for real-time chat
2. **Frontend** (Vercel) - Static React application

## Why Two Services?

The backend uses Socket.io for real-time chat, which requires WebSocket support. Vercel's serverless functions do not support WebSocket connections, so the backend must be deployed on a platform that supports persistent connections (Railway, Render, etc.).

## Quick Steps

### 1. Deploy Backend First

**Railway (Recommended):**
1. Go to https://railway.app, sign up with GitHub
2. New Project -> Deploy from GitHub repo
3. Add PostgreSQL database (+ New -> Database -> PostgreSQL)
4. Add backend service (+ New -> GitHub Repo, Root Directory: `backend`)
5. Set environment variables (see checklist)
6. Run migrations in Shell: `npx prisma migrate deploy`
7. Copy backend URL

**Render (Alternative):**
1. Go to https://render.com, sign up with GitHub
2. Create PostgreSQL database (Free tier)
3. Create Web Service (Root Directory: `backend`)
4. Set environment variables
5. Run migrations in Shell: `npx prisma migrate deploy`
6. Copy backend URL

### 2. Deploy Frontend

**Vercel:**
1. Go to https://vercel.com, sign up with GitHub
2. Add New Project -> Select repository
3. Root Directory: `frontend`
4. Set environment variable: `VITE_API_BASE_URL` = your backend URL
5. Deploy
6. Copy frontend URL

### 3. Update Backend CORS

1. Go back to backend service (Railway/Render)
2. Update `FRONTEND_URL` environment variable to your Vercel URL
3. Service will auto-redeploy

## Required Environment Variables

### Backend
```
DATABASE_URL=<from database service>
JWT_SECRET=<generate: openssl rand -hex 32>
NODE_ENV=production
FRONTEND_URL=<your vercel url>
PORT=4000
```

### Frontend
```
VITE_API_BASE_URL=<your backend url>
```

## Testing

1. Visit frontend URL
2. Try to register/login
3. Check browser console for errors
4. Test chat functionality

## Cost

- **Vercel**: Free for personal projects
- **Railway**: $5/month free credit (usually sufficient)
- **Render**: Free tier available (may sleep after inactivity)

## Need Help?

See `DEPLOYMENT_CHECKLIST.md` for detailed step-by-step instructions.
