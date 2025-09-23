let lastReportRun = null;
let lastStatus = "idle";
let lastOutputFile = null;

export const setJobRun = (status, outfile=null) => {
  lastReportRun = new Date();
  lastStatus = status;
  lastOutputFile = outfile;
};

export const getStatus = async (req, res) => {
  res.json({ lastReportRun, lastStatus, lastOutputFile });
};


import { runDailyReport } from "../jobs/reportScheduler.js";
export const runNow = async (req, res) => {
  try {
    await runDailyReport();
    res.json({ ok: true, message: "report triggered" });
  } catch (e) {
    res.status(500).json({ ok: false, error: "failed to run report" });
  }
};
