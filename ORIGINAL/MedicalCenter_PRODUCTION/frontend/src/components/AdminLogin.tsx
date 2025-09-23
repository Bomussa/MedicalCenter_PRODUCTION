import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { t } from "i18next";

const AdminLogin: React.FC = () => {
  const { session, setSession, setAdmin, checkAdminCredentials } = useApp();
  const nav = useNavigate();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [twoFactorCode, setTwoFactorCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = () => {
    setError(null);
    const adminUser = checkAdminCredentials(username, password, twoFactorCode);

    if (!adminUser) {
      setError(t("error_username_incorrect")); // Or a more specific error message
      return;
    }

    setAdmin(adminUser);
    setSession({ ...session, isAdmin: true, lastAdminActivity: Date.now() });
    nav("/admin/dashboard");
  };

  return (
    <div className="card">
      <h3>{t("admin_login")}</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="form-group">
        <label>{t("username")}</label>
        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t("enter_username")}
        />
      </div>
      <div className="form-group">
        <label>{t("password")}</label>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("enter_password")}
        />
      </div>
      <div className="form-group">
        <label>{t("two_factor_code")}</label>
        <input
          className="input"
          inputMode="numeric"
          value={twoFactorCode}
          onChange={(e) => setTwoFactorCode(e.target.value)}
          placeholder={t("enter_2fa")}
        />
      </div>
      <button className="btn btn-primary" onClick={handleLogin}>{t("login")}</button>
    </div>
  );
};

export default AdminLogin;


