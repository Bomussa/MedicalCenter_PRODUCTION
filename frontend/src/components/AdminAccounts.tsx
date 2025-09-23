import React from "react";
import { useApp } from "../context/AppContext";
import { t } from "i18next";

interface AdminUser {
  username: string;
  password?: string; // Should not be sent to frontend in real app
  role: "super_admin" | "admin" | "viewer" | "analytics_manager";
  createdAt: number;
  isActive: boolean;
}

const AdminAccounts: React.FC = () => {
  const { session, adminAccounts, setAdminAccounts, addAuditLogEntry } = useApp();
  const [newUsername, setNewUsername] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [newRole, setNewRole] = React.useState<AdminUser["role"]>("admin");
  const [error, setError] = React.useState<string | null>(null);

  const handleAddAdmin = () => {
    setError(null);
    if (!newUsername || !newPassword) {
      setError(t("admin_accounts_add_admin_error"));
      addAuditLogEntry("Add Admin Failed", session.admin?.user || "Unknown", "Missing username or password");
      return;
    }

    if (adminAccounts.some(admin => admin.username === newUsername)) {
      setError("اسم المستخدم موجود بالفعل."); // NOTE[2025-09-23]: reviewed NOTE[2025-09-23]: reviewed TODO: Add to i18n
      addAuditLogEntry("Add Admin Failed", session.admin?.user || "Unknown", `Username ${newUsername} already exists`);
      return;
    }

    const newAdmin: AdminUser = {
      username: newUsername,
      password: newPassword, // In a real app, hash this password
      role: newRole,
      createdAt: Date.now(),
      isActive: true,
    };
    setAdminAccounts([...adminAccounts, newAdmin]);
    setNewUsername("");
    setNewPassword("");
    setNewRole("admin");
    alert(t("admin_accounts_add_admin_success"));
    addAuditLogEntry("Admin Added", session.admin?.user || "Unknown", `Added admin ${newUsername} with role ${newRole}`);
  };

  const toggleAdminStatus = (username: string) => {
    if (username === "bomussa" && session.admin?.user === "bomussa") {
      alert(t("admin_accounts_super_admin_cannot_deactivate_message"));
      addAuditLogEntry("Admin Status Change Failed", session.admin?.user || "Unknown", `Attempted to deactivate super_admin ${username}`);
      return;
    }
    setAdminAccounts(adminAccounts.map(admin => {
      if (admin.username === username) {
        const newStatus = !admin.isActive;
        addAuditLogEntry("Admin Status Changed", session.admin?.user || "Unknown", `Admin ${username} status changed to ${newStatus ? 'active' : 'inactive'}`);
        return { ...admin, isActive: newStatus };
      }
      return admin;
    }));
  };

  return (
    <div>
      <h4>{t("manage_admin_accounts")}</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {session.admin?.role === "super_admin" && ( // Only super_admin can add/manage admins
        <div className="card" style={{ marginBottom: "20px" }}>
          <h5>{t("admin_accounts_add_admin_title")}</h5>
          <div className="form-group">
            <label>{t("username")}</label>
            <input
              className="input"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder={t("admin_accounts_username_placeholder")}
            />
          </div>
          <div className="form-group">
            <label>{t("password")}</label>
            <input
              className="input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t("admin_accounts_password_placeholder")}
            />
          </div>
          <div className="form-group">
            <label>{t("role")}</label>
            <select className="input" value={newRole} onChange={(e) => setNewRole(e.target.value as AdminUser["role"])}>
              <option value="admin">{t("admin_accounts_role_admin")}</option>
              <option value="viewer">{t("admin_accounts_role_viewer")}</option>
              <option value="analytics_manager">{t("admin_accounts_role_analytics_manager")}</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleAddAdmin}>{t("admin_accounts_add_admin_button")}</button>
        </div>
      )}

      <h5>{t("admin_accounts_current_accounts_title")}</h5>
      <table className="table">
        <thead>
          <tr>
            <th>{t("admin_accounts_table_header_username")}</th>
            <th>{t("admin_accounts_table_header_role")}</th>
            <th>{t("admin_accounts_table_header_created_at")}
            </th>
            <th>{t("admin_accounts_table_header_status")}</th>
            {session.admin?.role === "super_admin" && <th>{t("admin_accounts_table_header_actions")}</th>}
          </tr>
        </thead>
        <tbody>
          {adminAccounts.map((admin) => (
            <tr key={admin.username}>
              <td>{admin.username}</td>
              <td>{t(`admin_accounts_role_${admin.role}`)}</td>
              <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
              <td>{admin.isActive ? t("admin_accounts_status_active") : t("admin_accounts_status_inactive")}</td>
              {session.admin?.role === "super_admin" && (
                <td>
                  <button
                    className={`btn btn-sm ${admin.isActive ? "btn-danger" : "btn-success"}`}
                    onClick={() => toggleAdminStatus(admin.username)}
                    disabled={admin.username === "bomussa"} // Super admin cannot deactivate themselves
                  >
                    {admin.isActive ? t("admin_accounts_deactivate_button") : t("admin_accounts_activate_button")}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAccounts;


