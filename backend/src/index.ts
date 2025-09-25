import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import visitorRouter from "./routes/visitor";
import analyticsRouter from "./routes/analytics";
import adminRouter from "./routes/admin";
import authRouter from "./routes/auth";
import examRouter from "./routes/exam";
import { scheduleJobs } from "./cron/scheduler";

const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/api/visitor", visitorRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/exams", examRouter);

scheduleJobs(prisma);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
