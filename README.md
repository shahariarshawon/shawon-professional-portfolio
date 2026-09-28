# AI-Powered Developer Operating System

This project is a fully autonomous, AI-driven personal developer platform and ecosystem. It serves as a premium developer portfolio, intelligent CMS, CRM, and career analytics system. Built natively with an integrated AI orchestrator to manage professional identity, optimize SEO, process inbound job opportunities, and accelerate learning.

## Features
- **Premium Portfolio & CMS**: Enterprise-grade frontend design with integrated content management.
- **AI Orchestrator**: LangChain + GPT-4o architecture to route and process semantic knowledge.
- **Job Matching & CRM**: Autonomously parses inbound recruiter emails, categorizes opportunities, and drafts responses.
- **Career Intelligence Engine**: Generates 30/90/180-day personal learning roadmaps based on vector database history.
- **Blog & Content Automation**: Schedules and auto-generates Markdown articles and LinkedIn drafts using BullMQ.
- **Advanced Analytics**: Tracks visitor intent, content health, and brand reputation scoring.
- **Global Identity**: Unified identity profiles with interactive System Design blueprints.

## Tech Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with `pgvector` (via Prisma ORM)
- **AI**: OpenAI API, LangChain, RAG (Retrieval-Augmented Generation)
- **Infrastructure**: Redis (BullMQ queues), Vercel (Frontend), Render (Backend)

## Architecture
```
[ Frontend (Next.js) ] -> [ Backend API (Express.js) ] -> [ AI Orchestrator Layer ]
                                   |                               |
                                   v                               v
                       [ PostgreSQL / pgvector ]    [ External LLMs (OpenAI) ]
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
- Backend requires PostgreSQL `DATABASE_URL`, `OPENAI_API_KEY`, `REDIS_HOST`, `JWT_SECRET`, etc.

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
- `NODE_ENV`: Application environment (`development` | `production`)
- `PORT`: Server port (e.g., `5000`)
- `DATABASE_URL`: Connection string for PostgreSQL
- `REDIS_HOST` / `REDIS_PORT`: For background queues.
- `JWT_SECRET`: Used to sign Admin JWT tokens.
- `CLIENT_URL`: URL of the deployed frontend for CORS.
- `OPENAI_API_KEY`: API Key for AI Agents.

### Frontend (`client/.env.example`)
- `NEXT_PUBLIC_API_URL`: The URL to the Express backend (e.g., `https://your-backend.onrender.com/api`).

---

## Deployment Guide

### Deploy Frontend on Vercel
1. Connect your GitHub repository to Vercel.
2. Select the `client` root directory.
3. Add the required Environment Variable (`NEXT_PUBLIC_API_URL`).
4. Vercel automatically runs `npm run build` and deploys your Next.js app.

### Deploy Backend on Render
1. Create a new "Web Service" on Render.
2. Connect your GitHub repository and set the root directory to `server`.
3. Render will auto-detect the `render.yaml` configuration.
4. Add all production Environment Variables (`DATABASE_URL`, `OPENAI_API_KEY`, `JWT_SECRET`, `CLIENT_URL`, etc.).
5. Render runs `pnpm install && pnpm build`, migrating your Prisma database implicitly via scripts.

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
- **Cookie Auth Issue**: Safari limits cross-site cookies. Ensure your Vercel Frontend and Render Backend use the same top-level domain if strict restrictions apply.
- **AI Queue Failure**: Ensure Redis is active via `REDIS_HOST` for `BullMQ` to process offline jobs.