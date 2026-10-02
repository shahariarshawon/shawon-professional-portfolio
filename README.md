# AI-Powered Developer Operating System

This project is a fully autonomous, AI-driven personal developer platform and ecosystem. It serves as a premium developer portfolio, intelligent CMS, CRM, and career analytics system. Built natively with an integrated AI orchestrator to manage professional identity, optimize SEO, process inbound job opportunities, and accelerate learning.

## Features
- **Premium Portfolio & CMS**: Enterprise-grade frontend design with integrated content management.
- **AI Orchestrator**: LangChain + Gemini (Google GenAI) architecture to route and process semantic knowledge.
- **Job Matching & CRM**: Autonomously parses inbound recruiter emails, categorizes opportunities, and drafts responses.
- **Career Intelligence Engine**: Generates 30/90/180-day personal learning roadmaps based on vector database history.
- **Blog & Content Automation**: Schedules and auto-generates Markdown articles and LinkedIn drafts using BullMQ.
- **Advanced Analytics**: Tracks visitor intent, content health, and brand reputation scoring.
- **Global Identity**: Unified identity profiles with interactive System Design blueprints.

## Tech Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with `pgvector` (via Prisma ORM)
- **AI**: Google Gemini API, LangChain, RAG (Retrieval-Augmented Generation)
- **Infrastructure**: Redis (BullMQ queues), Vercel (Frontend), Render (Backend)

## Architecture
```
[ Frontend (Next.js) ] -> [ Backend API (Express.js) ] -> [ AI Orchestrator Layer ]
                                   |                               |
                                   v                               v
                       [ PostgreSQL / pgvector ]    [ External LLMs (Gemini) ]
```

## Folder Structure
- `client/`: Next.js frontend application.
- `server/`: Express.js backend API and AI agent configurations.
- `docs/`: Supplementary architectural documentation.

---

## Local Development Setup

1. **Clone repository**
```bash
git clone https://github.com/shahariarshawon/shawon-professional-portfolio.git
cd shawon-professional-portfolio
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Environment Setup**
Copy `.env.example` to `.env` in both `client/` and `server/` directories.
- Frontend requires `NEXT_PUBLIC_API_URL`
- Backend requires PostgreSQL `DATABASE_URL`, `GEMINI_API_KEY`, `REDIS_URL`, `JWT_SECRET`, etc.

4. **Database Setup & Migration**
```bash
cd server
npx prisma generate
npx prisma migrate dev
```

5. **Run the ecosystem**
```bash
# In the root directory (using turbo/pnpm workspaces)
pnpm run dev
```

---

## Environment Variables

### Backend (`server/.env.example`)
| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | yes | PostgreSQL connection string (needs the `pgvector` extension). |
| `JWT_SECRET` | yes (production) | Long random string. The server refuses to start in production with the dev default. Render generates one via `render.yaml`. |
| `CLIENT_URL` | yes | Your Vercel URL, no trailing slash. Comma-separate several origins (production + preview). |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | yes | Image and resume storage. Without them uploads return a clear 503 and the resume endpoint redirects. |
| `REDIS_URL` | optional | Queues and caching. |
| `GEMINI_API_KEY` | optional | AI features. |
| `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO` | optional | Contact-form email. |
| `PORT`, `NODE_ENV`, `JWT_EXPIRES_IN`, `AUTH_COOKIE_*` | optional | Defaults are fine. |

### Frontend (`client/.env.example`)
- `NEXT_PUBLIC_API_URL`: the Express API **including `/api`** (e.g. `https://your-backend.onrender.com/api`).
- `NEXT_PUBLIC_SITE_URL`: the public site URL, used for canonical URLs, sitemap and social cards. Falls back to Vercel's production URL if unset.

---

## Deployment Guide

### Backend on Render
1. Push the repo to GitHub (this includes `server/prisma/migrations/`; they must be committed).
2. In Render choose **New > Blueprint** and select the repo. `render.yaml` (repo root) configures the service: root directory `server`, health check `/healthz`, an auto-generated `JWT_SECRET`.
3. Fill the variables marked `sync: false` (`DATABASE_URL`, `CLIENT_URL`, Cloudinary keys, ...).
4. The build runs `pnpm install`, `prisma generate`, `tsc` and `prisma migrate deploy`.

### Frontend on Vercel
1. Import the repo and set **Root Directory** to `client`. Leave build/install commands on auto-detect (pnpm is picked up from the lockfile).
2. Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SITE_URL`.
3. Deploy. Pages are statically generated and refreshed in the background every 60 seconds, so content edited in the admin dashboard shows up within about a minute.

### Resume PDF
The public site links to `GET /api/public/resume` (view) and `GET /api/public/resume?download=1` (download). The API fetches the PDF from Cloudinary with a signed request and serves it with the right headers, so it works even if Cloudinary refuses unauthenticated delivery. New PDFs are uploaded as `raw` resources. Upload the PDF from **Admin > Hero**, then save.

---

## Production Checklist

- [x] Environment variables configured
- [x] Database migrated (`npx prisma migrate deploy`)
- [x] CORS configured for Vercel domain
- [x] Background Redis workers connected
- [x] Build successful (`tsc` passing)

---

## API Documentation

- **Authentication APIs**: `/api/v1/auth/*`
- **Project APIs**: `/api/v1/projects/*`
- **AI Conversational APIs**: `/api/v1/ai/*`
- **Analytics & Health**: `/api/v1/analytics/*`, `/api/health`

## Troubleshooting

- **CORS Error**: Ensure `CLIENT_URL` exactly matches your Vercel URL without a trailing slash.
- **Database Connection**: Ensure `pgvector` extension is enabled on your PostgreSQL host (e.g. Supabase, Neon).
- **Cookie Auth Issue**: Safari blocks cross-site cookies, so admin login on `*.vercel.app` + `*.onrender.com` can fail there. Put both under one registrable domain (for example `shawon.dev` and `api.shawon.dev`) for reliable Safari/iOS admin login. The public site is unaffected.
- **Slow first request**: Render's free tier sleeps after inactivity. The public pages are cached, so visitors are not affected; the admin dashboard may take ~30s to wake the API.
- **Favicon didn't change**: icons are served with a content-hash query string, so a hard refresh (Ctrl+Shift+R) or reopening the tab is enough.
- **AI Queue Failure**: Ensure Redis is active via `REDIS_URL` for `BullMQ` to process offline jobs.