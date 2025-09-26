# NEW FILES REPORT — Admin v2 (Non-destructive)
Date: 2025-09-26

- src/index.tsx                     → Unified entry point (visitors + /admin)
- src/config/featureFlags.ts        → Central feature toggles
- src/components/Themes.tsx         → 4 themes + font switch (AR/EN)
- src/utils/safe.ts                 → Safe fetch helpers + API base
- src/modules/public_ext/audioGuard.ts → Speech synthesis guard

- src/new_admin2/App.tsx            → Admin v2 shell
- src/new_admin2/pages/FlagsCenter.tsx
- src/new_admin2/pages/SettingsCenter.tsx
- src/new_admin2/pages/QueueMonitor.tsx
- src/new_admin2/pages/PinManager.tsx
- src/new_admin2/pages/ReportsHub.tsx
- src/new_admin2/pages/StatsHub.tsx

- backend/src/admin2_full.ts        → Admin v2 Backend API
- backend/migrations_non_destructive.sql → Non-destructive Migrations for Admin v2

All files are additive. Removing them restores the system unchanged.

