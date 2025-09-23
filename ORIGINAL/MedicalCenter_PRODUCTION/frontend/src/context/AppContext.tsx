import React from "react";
import { useTranslation } from "react-i18next";
import { ENV } from "../utils/env";
import { store } from "../utils/storage";
import { EXAM_IDS } from "../data/exams";

type AdminUser = { username: string; password?: string; role: "super_admin" | "admin" | "viewer" | "analytics_manager"; isActive: boolean; createdAt: number; exp?: number };
type Admin = { user: string; role: "super_admin" | "admin" | "viewer" | "analytics_manager"; exp: number } | null;
type Settings = { modelsPolicy: "ROUND_ROBIN" | "HYBRID"; readOnlyReports: boolean; requireClinicPIN: boolean };
type Session = {
  idType: "military" | "personal";
  userId: string;
  gender: "male" | "female";
  examId: string | null;
  assignedModel?: "A"|"B"|"C"|"D";
  startTime?: string;
  endTime?: string;
  clinicsVisited: { id: string; doneAt: string }[];
  durationSec?: number;
  isAdmin: boolean;
  lastAdminActivity: number | null;
};

interface ClinicPIN {
  clinicName: string;
  pin: string;
  generatedAt: number;
}

interface AuditLogEntry {
  timestamp: number;
  action: string;
  user: string;
  details?: string;
}

const AppCtx = React.createContext<{
  lang: "ar" | "en"; setLang: (l: "ar" | "en") => void;
  admin: Admin; setAdmin: (a: Admin) => void;
  settings: Settings; setSettings: (s: Settings) => void;
  session: Session; setSession: (s: Session) => void;
  adminAccounts: AdminUser[]; setAdminAccounts: (accounts: AdminUser[]) => void;
  checkAdminCredentials: (username: string, password: string, twoFactorCode: string) => Admin | null;
  dailyClinicPINs: ClinicPIN[]; setDailyClinicPINs: (pins: ClinicPIN[]) => void;
  auditLog: AuditLogEntry[]; addAuditLogEntry: (action: string, user: string, details?: string) => void;
  t: (key: string) => string;
}>({} as any);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [lang, setLang] = React.useState<"ar"|"en">("ar");
  const [admin, setAdmin] = React.useState<Admin>(null);
  const [settings, setSettings] = React.useState<Settings>(() => ({
    modelsPolicy: (ENV.MODELS_POLICY as any) || "HYBRID",
    readOnlyReports: true,
    requireClinicPIN: true
  }));
  const [session, setSession] = React.useState<Session>(() => ({
    idType: "military", userId: "", gender: "male", examId: null, clinicsVisited: [], isAdmin: false, lastAdminActivity: null
  }));

  const [adminAccounts, setAdminAccounts] = React.useState<AdminUser[]>([
    { username: "bomussa", password: "12345", role: "super_admin", isActive: true, createdAt: Date.now() },
  ]);

  const [dailyClinicPINs, setDailyClinicPINs] = React.useState<ClinicPIN[]>([
    { clinicName: "إدارة العيادات", pin: "1", generatedAt: Date.now() },
    { clinicName: "عيادة العيون", pin: "1234", generatedAt: Date.now() },
    { clinicName: "عيادة الباطنية", pin: "5678", generatedAt: Date.now() },
  ]);

  const [auditLog, setAuditLog] = React.useState<AuditLogEntry[]>([]);

  React.useEffect(() => {
    const a = store.get<Admin>("secure:admin", null);
    if (a && a.exp && a.exp > Date.now()) setAdmin(a);

    const storedAccounts = store.get<AdminUser[]>("adminAccounts", []);
    if (storedAccounts.length > 0) {
      setAdminAccounts(storedAccounts);
    } else {
      store.set("adminAccounts", adminAccounts);
    }

    const storedPINs = store.get<ClinicPIN[]>("dailyClinicPINs", []);
    if (storedPINs.length > 0) {
      setDailyClinicPINs(storedPINs);
    } else {
      store.set("dailyClinicPINs", dailyClinicPINs);
    }

    const storedAuditLog = store.get<AuditLogEntry[]>("auditLog", []);
    if (storedAuditLog.length > 0) {
      setAuditLog(storedAuditLog);
    }
  }, []);

  React.useEffect(() => { if (admin) store.set("secure:admin", admin); }, [admin]);
  React.useEffect(() => { store.set("adminAccounts", adminAccounts); }, [adminAccounts]);
  React.useEffect(() => { store.set("dailyClinicPINs", dailyClinicPINs); }, [dailyClinicPINs]);
  React.useEffect(() => { store.set("auditLog", auditLog); }, [auditLog]);

  const addAuditLogEntry = (action: string, user: string, details?: string) => {
    setAuditLog(prevLog => [...prevLog, { timestamp: Date.now(), action, user, details }]);
  };

  const checkAdminCredentials = (username: string, password: string, twoFactorCode: string): Admin | null => {
    const foundAdmin = adminAccounts.find(acc => acc.username === username && acc.isActive);

    if (!foundAdmin || foundAdmin.password !== password) {
      addAuditLogEntry("Admin Login Attempt Failed", username, "Incorrect username or password");
      return null;
    }

    // Simple 2FA check for super_admin for now
    if (foundAdmin.role === "super_admin" && twoFactorCode !== "14490") {
      addAuditLogEntry("Admin Login Attempt Failed", username, "Incorrect 2FA code");
      return null;
    }

    addAuditLogEntry("Admin Login Successful", username, `Role: ${foundAdmin.role}`);
    return { user: foundAdmin.username, role: foundAdmin.role, exp: Date.now() + 20 * 60 * 1000 }; // 20 minutes expiration
  };

  React.useEffect(() => {
    // sanity: don\"t allow unknown exam values
    if (session.examId && !EXAM_IDS.includes(session.examId)) {
      setSession({ ...session, examId: null });
    }
  }, [session.examId]);

  return (
    <AppCtx.Provider value={{ lang, setLang, admin, setAdmin, settings, setSettings, session, setSession, adminAccounts, setAdminAccounts, checkAdminCredentials, dailyClinicPINs, setDailyClinicPINs, auditLog, addAuditLogEntry, t }}>
      <div className="container">{children}</div>
    </AppCtx.Provider>
  );
};

export const useApp = () => React.useContext(AppCtx);


