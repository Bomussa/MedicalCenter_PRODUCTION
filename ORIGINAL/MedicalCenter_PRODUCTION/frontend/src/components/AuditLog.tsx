import React from "react";
import { useApp } from "../context/AppContext";
import { t } from "i18next";

interface AuditLogEntry {
  timestamp: number;
  action: string;
  user: string;
  details?: string;
}

const AuditLog: React.FC = () => {
  const { auditLog } = useApp();

  return (
    <div>
      <h4>{t("audit_log_title")}</h4>
      <table className="table">
        <thead>
          <tr>
            <th>{t("audit_log_table_header_timestamp")}</th>
            <th>{t("audit_log_table_header_user")}</th>
            <th>{t("audit_log_table_header_action")}</th>
            <th>{t("audit_log_table_header_details")}</th>
          </tr>
        </thead>
        <tbody>
          {auditLog.sort((a, b) => b.timestamp - a.timestamp).map((entry, index) => (
            <tr key={index}>
              <td>{new Date(entry.timestamp).toLocaleString()}</td>
              <td>{entry.user}</td>
              <td>{entry.action}</td>
              <td>{entry.details || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLog;


