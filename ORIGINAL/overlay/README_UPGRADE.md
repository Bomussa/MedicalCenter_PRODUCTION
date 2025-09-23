# Attar Medical – Upgrade Overlay
**Generated:** 2025-09-23 08:49 (Asia/Qatar)

This overlay adds safety, quality, and test tooling **without modifying your core files**.
It can be merged as-is; all new code sits under an `overlay` path. Wire it up by importing
the middleware/routes and running the scripts as documented here.

## What you get
- Runtime validation (Zod) on every API
- Emergency handler (A/B/C fallback) + admin override
- Health & readiness endpoints
- i18n guard + missing-key checker
- PIN guard utilities
- SQL schema verifier for PostgreSQL
- CI (GitHub Actions) for lint, type-check, unit & e2e
- Postman collection + OpenAPI draft
- Smoke test script and QA checklist

## How to integrate (non-destructive)
1) **Backend (Express/Node):**
   ```ts
   // server.ts
   import { attachHealthRoutes } from './overlay/backend/src/health/health.routes';
   import { emergencyHandler } from './overlay/backend/src/emergency/emergency_handler';
   import { validate, schemas } from './overlay/backend/src/middleware/validate';

   // after app creation:
   attachHealthRoutes(app);
   app.use(emergencyHandler.requestGuard);
   // per endpoint example:
   // app.post('/api/patient/start', validate(schemas.startExam), controller.start);
   ```

2) **Frontend:**
   - Run missing-key audit:
     ```bash
     node overlay/frontend/src/i18n/check-missing.js
     ```
   - Import PIN guard where you unlock clinics:
     ```ts
     import { pinGuard } from '@/overlay/frontend/src/utils/pinGuard';
     const ok = pinGuard.validate(inputPin, expectedPin);
     ```

3) **Database:**
   ```bash
   psql "$DATABASE_URL" -f overlay/sql/verify_schema.sql
   ```

4) **QA / CI:**
   - GitHub: add `.github/workflows/attarmed-ci.yml` from `overlay/ci/github-actions.yml`
   - Local:
     ```bash
     bash overlay/scripts/smoke.sh
     npm run test    # unit
     npx playwright test overlay/qa/E2E.spec.ts  # e2e
     ```

## Notes
- Keep your `.env` authoritative. Overlay **does not** change it.
- All fixes are additive & reversible.
