# Deploy Now - Quick Guide

This guide shows exactly what you need to do right now to deploy.

## Step 1: Deploy Backend (Railway - Free Tier)

### 1.1 Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Authorize Railway access

### 1.2 Create Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `waikato-alumni-connect`

### 1.3 Add Database
1. In project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Wait for database to be created
4. Go to database service → "Variables" tab
5. Copy `DATABASE_URL` value

### 1.4 Deploy Backend Service
1. Click "+ New" → "GitHub Repo"
2. Select same repo: `waikato-alumni-connect`
3. In service settings, set **Root Directory: `backend`**
4. Railway will auto-detect Dockerfile

### 1.5 Set Environment Variables
Go to backend service → "Variables" tab, add:

```
DATABASE_URL = <paste from database service>
JWT_SECRET = <generate with: openssl rand -hex 32>
NODE_ENV = production
FRONTEND_URL = http://localhost:3000
PORT = 4000
```

**How to generate JWT_SECRET:**
```bash
openssl rand -hex 32
```
Or use online generator: https://www.grc.com/passwords.htm (use 64 characters)

### 1.6 Run Migrations
1. Wait for first deployment to complete
2. Open backend service → "Deployments" → Click latest deployment → "View Logs"
3. If migration errors appear, go to "Deployments" → "Shell"
4. Run: `npx prisma migrate deploy`

### 1.7 Copy Backend URL
1. Go to backend service → "Settings" → "Domains"
2. Copy the URL (e.g., `https://xxx.up.railway.app`)

---

## Step 2: Deploy Frontend (Vercel - Free)

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel access

### 2.2 Import Project
1. Click "Add New..." → "Project"
2. Select repository: `waikato-alumni-connect`
3. Click "Import"

### 2.3 Configure Project
In "Configure Project" page:
- **Root Directory:** Click "Edit" → Enter `frontend` → Click "Continue"
- **Framework Preset:** Vite (auto-detected)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `build` (default)

### 2.4 Set Environment Variable
Before clicking "Deploy", click "Environment Variables":
- **Key:** `VITE_API_BASE_URL`
- **Value:** `<paste your Railway backend URL from Step 1.7>`
- Click "Add"

### 2.5 Deploy
1. Click "Deploy"
2. Wait for deployment (~2 minutes)
3. Copy frontend URL (e.g., `https://xxx.vercel.app`)

---

## Step 3: Update Backend CORS

### 3.1 Update FRONTEND_URL
1. Go back to Railway → Backend service → "Variables"
2. Update `FRONTEND_URL` to your Vercel URL from Step 2.5
3. Service will auto-redeploy (~1 minute)

---

## Step 4: Test

1. Visit your Vercel frontend URL
2. Try to register a student account
3. Check browser console (F12) for errors
4. Test login functionality

---

## Troubleshooting

**Backend not starting?**
- Check Railway logs: Service → "Deployments" → "View Logs"
- Verify all environment variables are set
- Ensure `DATABASE_URL` is correct

**Frontend can't connect to backend?**
- Check `VITE_API_BASE_URL` in Vercel settings
- Verify backend URL is accessible (try opening in browser)
- Check browser console for CORS errors

**Database migration failed?**
- Go to Railway → Backend service → "Shell"
- Run: `npx prisma migrate deploy`
- Check logs for specific errors

---

## Cost Summary

- **Vercel:** Free (personal projects)
- **Railway:** Free $5/month credit (usually enough for pilot)
- **Total:** $0 for pilot testing

---

## Quick Reference

**Backend URL:** `https://xxx.up.railway.app`  
**Frontend URL:** `https://xxx.vercel.app`  
**Database:** Managed by Railway (included)

Need help? Check `DEPLOYMENT_CHECKLIST.md` for detailed steps.
