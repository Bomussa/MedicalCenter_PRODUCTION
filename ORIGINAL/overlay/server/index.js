import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import analyticsRoutes from "./routes/analytics.js";
import auditRoutes from "./routes/audit.js";
import cmsRoutes from "./routes/cms.js";
import jobsRoutes from "./routes/jobs.js";
import reportRoutes from "./routes/reports.js";

const app = express();
import adminTestsRoutes from "./routes/adminTests.js";
import analyticsDBRoutes from "./routes/analyticsDB.js";
import jobsControlRoutes from "./routes/jobsControl.js";
import notesRoutes from "./routes/notes.js";
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/analytics", analyticsRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/reports", reportRoutes);

app.use("/api/notes", notesRoutes);

app.use("/api/jobs-control", jobsControlRoutes);
app.use("/api/analytics-db", analyticsDBRoutes);
app.use("/api/admin", adminTestsRoutes);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("API listening on", port));


export default app;
