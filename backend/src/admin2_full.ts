/* New file – Admin v2 Backend API – 2025-09-26 */
import { Router } from "express";
import { db } from "../db";

const admin2Router = Router();

// Feature Flags
admin2Router.get("/flags", async (req, res) => {
  const flags = await db.any("SELECT key, enabled, updatedat FROM FeatureFlag2");
  res.json(flags);
});
admin2Router.post("/flags", async (req, res) => {
  const { key, enabled } = req.body;
  await db.none("INSERT INTO FeatureFlag2 (key, enabled) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET enabled = $2, updatedat = NOW()", [key, enabled]);
  res.status(200).send();
});

// System Settings
admin2Router.get("/settings", async (req, res) => {
  const settings = await db.any("SELECT key, value, updatedat FROM SystemSettings2");
  res.json(settings.map(s => ({ ...s, value: JSON.parse(s.value) })));
});
admin2Router.post("/settings", async (req, res) => {
  const { key, value } = req.body;
  await db.none("INSERT INTO SystemSettings2 (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2, updatedat = NOW()", [key, JSON.stringify(value)]);
  res.status(200).send();
});

// Queue Monitor
admin2Router.get("/queue/clinic", async (req, res) => {
  const { clinicId, date } = req.query;
  const data = await db.oneOrNone("SELECT * FROM ClinicQueue2 WHERE clinicid = $1 AND date = $2", [clinicId, date]);
  res.json(data);
});

// PIN Manager
admin2Router.get("/pin/list", async (req, res) => {
  const { clinicId, date } = req.query;
  const pins = await db.any("SELECT * FROM ClinicPin2 WHERE clinicid = $1 AND validdate = $2", [clinicId, date]);
  res.json(pins);
});
admin2Router.post("/pin/add", async (req, res) => {
  const { clinicId, date, pinCode } = req.body;
  await db.none("INSERT INTO ClinicPin2 (clinicid, validdate, pincode) VALUES ($1, $2, $3)", [clinicId, date, pinCode]);
  res.status(200).send();
});
admin2Router.post("/pin/toggle", async (req, res) => {
  const { pinId, isActive } = req.body;
  await db.none("UPDATE ClinicPin2 SET isactive = $2 WHERE id = $1", [pinId, isActive]);
  res.status(200).send();
});
admin2Router.post("/pin/redirect", async (req, res) => {
  const { pinId, redirectClinicId } = req.body;
  await db.none("UPDATE ClinicPin2 SET redirectclinicid = $2 WHERE id = $1", [pinId, redirectClinicId]);
  res.status(200).send();
});

// Reports Hub
admin2Router.get("/reports/archive", async (req, res) => {
  const archive = await db.any("SELECT * FROM ReportArchive2 ORDER BY generated_at DESC");
  res.json(archive);
});
admin2Router.post("/reports/generate", async (req, res) => {
  const { type, from, to, scope } = req.body;
  // In a real app, this would trigger a background job to generate the report
  const title = `${scope}_report_${from}_to_${to}.${type}`;
  const result = await db.one("INSERT INTO ReportArchive2 (title, type, period_from, period_to, generated_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id", [title, type, from, to]);
  res.json({ id: result.id });
});
admin2Router.get("/reports/download/:id", async (req, res) => {
  const { id } = req.params;
  const report = await db.oneOrNone("SELECT * FROM ReportArchive2 WHERE id = $1", [id]);
  if (report) {
    // Simulate file download
    res.setHeader("Content-Disposition", `attachment; filename="${report.title}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(`Simulated content for ${report.title}`);
  } else {
    res.status(404).send("Report not found");
  }
});

// Stats Hub
admin2Router.get("/stats/overview", async (req, res) => {
  const { from, to } = req.query;
  // Simulate some stats data
  const visitsByExam = [
    { key: "Exam A", value: 120 },
    { key: "Exam B", value: 80 },
    { key: "Exam C", value: 50 },
  ];
  const visitsByClinic = [
    { key: "Clinic X", value: 150 },
    { key: "Clinic Y", value: 100 },
  ];
  const visitsPerHour = [
    { key: "9 AM", value: 15 },
    { key: "10 AM", value: 25 },
    { key: "11 AM", value: 30 },
    { key: "12 PM", value: 20 },
  ];
  const avgWaitSec = 300; // 5 minutes

  res.json({ visitsByExam, visitsByClinic, visitsPerHour, avgWaitSec });
});

export default admin2Router;

