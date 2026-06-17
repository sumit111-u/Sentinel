# Deployment Guide: Sentinel to Railway

## Overview
This guide walks you through deploying Sentinel (frontend + backend) to Railway with PostgreSQL.

## Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub account (repo will be connected)
- Git installed locally

## Step 1: Prepare Your Code

### Update Prisma Schema (✅ Already Done)
- Changed from SQLite to PostgreSQL in `backend/prisma/schema.prisma`

### Update Git
```bash
# From project root
git add .
git commit -m "chore: prepare for Railway deployment"
git push origin main
```

## Step 2: Deploy Backend to Railway

1. **Create a new Railway project:**
   - Go to https://railway.app/dashboard
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Connect your GitHub account and select your `sentinel` repo

2. **Add PostgreSQL service:**
   - In your Railway project, click "+ Add"
   - Select "PostgreSQL"
   - This will auto-generate `DATABASE_URL` in your environment

3. **Configure Backend Service:**
   - Click "+ Add" → "GitHub Repo"
   - Select your sentinel repo
   - Give it a name like "sentinel-api"
   - Railway auto-detects the backend folder

4. **Set Environment Variables:**
   - In the backend service settings, go to "Variables"
   - Add all variables from `.env.production.example`:
     ```
     GITHUB_CLIENT_ID=your_value
     GITHUB_CLIENT_SECRET=your_value
     GROQ_API_KEY=your_value
     SECRET_KEY=generate-a-random-secret-here
     FRONTEND_URL=https://your-frontend-domain.com
     NODE_ENV=production
     PORT=8000
     ```
   - **DATABASE_URL** is auto-set by PostgreSQL service ✓

5. **Deploy:**
   - Railway automatically deploys when you push to GitHub
   - View logs: Click your service → "Logs" tab
   - Get your backend URL: Click service → "Deployments" → copy domain

## Step 3: Deploy Frontend to Vercel (Recommended for Next.js)

While you said Railway, Vercel is ideal for Next.js. However, if you prefer Railway:

### Option A: Deploy to Vercel (Recommended)
1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Select `/frontend` as root directory
5. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
   ```
6. Deploy!

### Option B: Deploy to Railway
1. In your Railway project, click "+ Add"
2. Select "GitHub Repo" (same repo)
3. Set custom root: `./frontend`
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
   ```
5. Deploy!

## Step 4: Configure GitHub OAuth

1. Update your GitHub OAuth app settings:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Update "Authorization callback URL":
     ```
     https://your-railway-backend-url.railway.app/auth/github/callback
     ```

2. Update Frontend URLs:
   - Edit `frontend/.env.production.local`:
     ```
     NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
     ```

## Step 5: Initialize Database

After backend is deployed:

```bash
# From your local machine
cd backend

# Run migrations on production database
npx prisma migrate deploy

# (Optional) Seed initial data
npx prisma db seed
```

Or use Railway's Shell:
- Go to backend service → "Shell" tab
- Run: `npx prisma migrate deploy`

## Troubleshooting

### Backend won't start
- Check Logs: Service → Logs tab
- Common issues:
  - Missing environment variables → Add them in Variables tab
  - Database connection → Verify DATABASE_URL exists
  - Port not 8000 → Railway assigns ports dynamically, remove PORT=8000

### CORS errors on frontend
- Make sure `FRONTEND_URL` in backend env vars matches your frontend domain
- Check `config.js` cors settings

### Database migration fails
- Run locally first: `npx prisma db push`
- Check migration files in `backend/prisma/migrations/`
- Fix any issues, then deploy

## Useful Railway Commands

Access backend shell:
```bash
# Via Railway CLI (if installed)
railway shell

# Or use Railway dashboard → Service → Shell tab
```

View logs:
```bash
railway logs --tail
```

## Security Checklist

- [ ] Change `SECRET_KEY` to a random 32+ character string
- [ ] Verify GitHub OAuth credentials in production settings
- [ ] Enable Railway auto-deploys from GitHub
- [ ] Set up domain/subdomain for backend
- [ ] Update CORS origins if using custom domains
- [ ] Do NOT commit `.env.production.local` (add to .gitignore)

## URLs After Deployment

- **Backend API:** https://your-railway-backend-domain.railway.app
- **Frontend:** https://your-vercel-domain.vercel.app
- **Health Check:** https://your-railway-backend-domain.railway.app/health

## Next Steps

1. Test locally: `npm run dev` in both folders
2. Push to GitHub
3. Railway auto-deploys on push
4. Monitor logs for any errors
5. Update frontend `.env.production.local` with your backend URL

Happy deploying! 🚀
