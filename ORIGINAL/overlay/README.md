

## Analytics Charts
- Frontend: `frontend/src/components/AnalyticsCharts.tsx`
- API: `GET /api/analytics/summary`

## Audit Log
- API: `GET /api/audit/logs`

## Jobs Dashboard
- API: `GET /api/jobs/status`

## CMS Content
- API: `GET/POST/PUT /api/cms/content`

## Reports Export
- API: `GET /api/reports/export`


## Added Components
- `AuditLog.tsx` → يستعرض /api/audit/logs
- `JobsDashboard.tsx` → يستعرض /api/jobs/status
- `ExportReports.tsx` → ينفذ /api/reports/export
- `VoiceFeedback.tsx` → أصوات نجاح/خطأ من public/assets/sounds


## Jobs Control
- POST `/api/jobs-control/run` لتشغيل التقرير يدويًا.
- واجهة: `JobsControl.tsx`.


## Analytics DB
- POST `/api/analytics-db/add` لإضافة زيارة تجريبية.
- GET `/api/analytics-db/summary` للحصول على إحصائيات حقيقية من قاعدة البيانات.


## Admin On-Demand Tests
- API: POST `/api/admin/run-tests` يقوم بتشغيل Jest عند الطلب فقط.
- واجهة: `AdminTests.tsx` ضمن قسم الإدارة لتشغيل الاختبارات وعرض النتيجة.
