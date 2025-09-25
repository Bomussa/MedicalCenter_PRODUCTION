ALTER TABLE "Visitor" ADD COLUMN IF NOT EXISTS "queueNumber" INT NOT NULL DEFAULT 0;
ALTER TABLE "Visitor" ADD CONSTRAINT unique_daily_identifier UNIQUE ("identifier","visitDate");
CREATE UNIQUE INDEX IF NOT EXISTS "PinCode_clinicId_date_key" ON "PinCode" ("clinicId","date");