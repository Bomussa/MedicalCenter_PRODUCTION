import cron from "cron";
import { PrismaClient } from "@prisma/client";
import { ensureTodayPins } from "../services/pinService";

export function scheduleJobs(_prisma: PrismaClient) {
  const job = new cron.CronJob("0 5 * * *", async () => {
    console.log("Generating daily two-digit PIN codes…");
    await ensureTodayPins(true);
  }, null, true, "Asia/Qatar");
  job.start();
}
