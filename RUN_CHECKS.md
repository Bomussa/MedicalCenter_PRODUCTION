# تشغيل وتحقق سريع
## تطوير
npm run start:all
# أو
npm run start:api
(cd frontend && npm run dev)

## إنتاج عبر Docker
docker compose build
docker compose up -d

## فحوص سريعة
# افتح http://localhost for UI (nginx) و http://localhost:5000/api/health (إن وجد)
