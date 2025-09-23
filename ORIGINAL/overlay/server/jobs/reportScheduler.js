

/** Scheduler hook to update status (append) **/
import fs from "fs";
import path from "path";
import { setJobRun } from "../controllers/jobsController.js";

export async function runDailyReport() {
  try {
    const outDir = path.join(process.cwd(), "reports");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const out = path.join(outDir, `daily-report-${Date.now()}.json`);
    fs.writeFileSync(out, JSON.stringify({ ok: true, generatedAt: new Date().toISOString() }, null, 2));
    setJobRun("success", out);
  } catch (e) {
    setJobRun("failed", null);
  }
}
