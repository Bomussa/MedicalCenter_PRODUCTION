import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import AdminAccounts from "./AdminAccounts";
import LiveStatistics from "./LiveStatistics";
import RecordsReports from "./RecordsReports";
import DailyClinicPINs from "./DailyClinicPINs";
import AuditLog from "./AuditLog";
import AnalyticsPanel from "./AnalyticsPanel";
import VisitsManager from "./VisitsManager";
import CMSPanel from "./CMSPanel";
import { t } from "i18next";

const AdminDashboard: React.FC = () => {
  const { session, setSession } = useApp();
  const nav = useNavigate();
  const [activeTab, setActiveTab] = React.useState("adminAccounts"); // Default tab

  // Redirect if not admin or session expired
  React.useEffect(() => {
    if (!session.isAdmin || (session.lastAdminActivity && (Date.now() - session.lastAdminActivity > 20 * 60 * 1000))) { // 20 minutes timeout
      setSession({ ...session, isAdmin: false });
      nav("/admin/login");
    }
  }, [session, nav]);

  if (!session.isAdmin) {
    return null; // Or a loading spinner/message
  }

  return (
    <div className="card">
      <h3>{t("admin_dashboard")}</h3>
      <div className="tabs" style={{marginBottom: "20px"}}>
        <button
          className={`btn ${activeTab === "adminAccounts" ? "btn-primary" : ""}`}
          onClick={() => setActiveTab("adminAccounts")}
        >
          {t("manage_admin_accounts")}
        </button>
        <button
          className={`btn ${activeTab === "liveStatistics" ? "btn-primary" : ""}`}
          onClick={() => setActiveTab("liveStatistics")}
        >
          {t("live_statistics")}
        </button>
        <button
          className={`btn ${activeTab === "analytics" ? "btn-primary" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          الإحصائيات المتقدمة
        </button>
        <button
          className={`btn ${activeTab === "visits" ? "btn-primary" : ""}`}
          onClick={() => setActiveTab("visits")}
        >
          إدارة الزيارات
        </button>
        <button
          className={`btn ${activeTab === "cms" ? "btn-primary" : ""}`}
          onClick={() => setActiveTab("cms")}
        >
          إدارة المحتوى
        </button>
        <button
          className={`btn ${activeTab === "recordsReports" ? "btn-primary" : ""}`}
          onClick={() => setActiveTab("recordsReports")}
        >
          {t("records_reports")}
        </button>
        <button
          className={`btn ${activeTab === "dailyClinicPINs" ? "btn-primary" : ""}`}
          onClick={() => setActiveTab("dailyClinicPINs")}
        >
          {t("daily_clinic_pins")}
        </button>
        <button
          className={`btn ${activeTab === "auditLog" ? "btn-primary" : ""}`}
          onClick={() => setActiveTab("auditLog")}
        >
          {t("audit_log_title")}
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "adminAccounts" && <AdminAccounts />}
        {activeTab === "liveStatistics" && <LiveStatistics />}
        {activeTab === "analytics" && <AnalyticsPanel />}
        {activeTab === "visits" && <VisitsManager />}
        {activeTab === "cms" && <CMSPanel />}
        {activeTab === "recordsReports" && <RecordsReports />}
        {activeTab === "dailyClinicPINs" && <DailyClinicPINs />}
        {activeTab === "auditLog" && <AuditLog />}
      </div>
    </div>
  );
};

export default AdminDashboard;


