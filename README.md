# Al-Attar Military Medical Center – Fullstack (Frontend with PIN + Backend API)

## Overview
Production-ready fullstack app (Node/Express API + React/Vite frontend). Includes security hardening, API docs, Docker, and build scripts.

## Quick Start
```bash
cp .env.example .env
npm install
npm run build:client
npm start
# open http://localhost:5000  (Docs: http://localhost:5000/docs)
```

## Frontend (client)
- React + Vite
- PIN for clinic access on ExamScreen
- Config: `client/src/config/appConfig.js` → `API_BASE_URL="/api"`

## Backend (API)
- Express with `helmet`, `compression`, `morgan`, strict `cors`
- Routes under `/api/*` (clinics, exams, users)
- Health: `GET /api/health`
- Docs: `GET /docs` (OpenAPI: `docs/openapi.yaml`)

## Scripts
- `npm run build:client` → build frontend
- `npm start` → production start
- `npm run dev` → dev start
- `npm test` → Jest
- `npm run lint` / `npm run format`

## Docker
```bash
docker compose up --build
```

## Nginx (optional reverse proxy)
Sample conf at `ops/nginx.conf`.

## Security Notes
- Set strong `JWT_SECRET`
- Restrict `CORS_ORIGINS` in `.env`
- Keep dependencies updated

## Structure
- `server.js` – server entry
- `client/` – React app (PIN-enabled)
- `routes/`, `controllers/`, `models/` – API
- `docs/openapi.yaml` – Swagger docs
```

## Admin & Analytics
- Admin dashboard component mounted in the app to show counts.
- API:
  - `GET /api/analytics/overview` → JSON counts
  - `GET /api/analytics/metrics` → Prometheus text (for monitoring)
- Seed data at `seeds/sample.json` (run `node scripts/seed.js` after integrating DB).

## Tests
Run basic tests:
```bash
npm test
```

_Last update: 2025-09-22T19:28:51.318144Z_


## Database (PostgreSQL)
Set `DATABASE_URL` in `.env`, then:
```bash
npm run db:migrate   # (or sequelize.sync in dev)
npm run db:seed      # after wiring real seeders
```

## Encryption
Set `ENCRYPTION_KEY` to a 32-byte secret. Military IDs stored as AES-256-GCM (`Visit.militaryIdEnc`).

## Scheduled Reports
Daily at 18:00 Asia/Qatar:
```bash
npm run reports:run   # one-off run
# or rely on cron inside process
```
Reports written to `REPORTS_DIR` (default `./exports`) as CSV + PDF.


## CMS / App Builder
- Manage **colors/fonts/branding** via `/api/cms/config`
- Manage **texts (AR/EN)** via `/api/cms/texts`
- Manage **icons** via `/api/cms/icons`
- Manage **pages** and **routes** via `/api/cms/pages` & `/api/cms/routes`
- Admin UI component: `client/src/components/admin/AdminCMS.jsx`
