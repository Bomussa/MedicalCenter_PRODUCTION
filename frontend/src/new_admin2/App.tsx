/* New file – Admin v2 Shell – 2025-09-26 */
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { featureFlags } from "../config/featureFlags";
import FlagsCenter from "./pages/FlagsCenter";
import SettingsCenter from "./pages/SettingsCenter";
import QueueMonitor from "./pages/QueueMonitor";
import PinManager from "./pages/PinManager";
import ReportsHub from "./pages/ReportsHub";
import StatsHub from "./pages/StatsHub";

export default function Admin2App() {
  return (
    <div className="wrap" style={{ padding: 16 }}>
      <div className="card" style={{ display: "flex", gap: 12 }}>
        {featureFlags.adminFlags && <Link to="flags">Feature Flags</Link>}
        {featureFlags.adminSettings && <Link to="settings">System Settings</Link>}
        {featureFlags.adminQueue && <Link to="queue">Queue Monitor</Link>}
        {featureFlags.adminPins && <Link to="pin">PIN Manager</Link>}
        {featureFlags.adminReports && <Link to="reports">Reports</Link>}
        {featureFlags.adminStats && <Link to="stats">Stats</Link>}
      </div>
      <Routes>
        {featureFlags.adminFlags && <Route path="flags" element={<FlagsCenter />} />}
        {featureFlags.adminSettings && <Route path="settings" element={<SettingsCenter />} />}
        {featureFlags.adminQueue && <Route path="queue" element={<QueueMonitor />} />}
        {featureFlags.adminPins && <Route path="pin" element={<PinManager />} />}
        {featureFlags.adminReports && <Route path="reports" element={<ReportsHub />} />}
        {featureFlags.adminStats && <Route path="stats" element={<StatsHub />} />}
        <Route path="*" element={<div className="card">اختر من الأعلى</div>} />
      </Routes>
    </div>
  );
}

