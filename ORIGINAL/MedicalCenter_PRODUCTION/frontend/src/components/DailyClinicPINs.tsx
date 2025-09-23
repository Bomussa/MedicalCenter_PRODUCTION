import React from "react";
import { useApp } from "../context/AppContext";
import { t } from "i18next";

interface ClinicPIN {
  clinicName: string;
  pin: string;
  generatedAt: number;
}

const DailyClinicPINs: React.FC = () => {
  const { session, dailyClinicPINs, setDailyClinicPINs, addAuditLogEntry } = useApp();
  const [countdown, setCountdown] = React.useState("");

  const generatePINs = () => {
    const newPINs = dailyClinicPINs.map(clinic => ({
      ...clinic,
      pin: clinic.clinicName === t("daily_clinic_pins_admin_row_text") ? "1" : Math.floor(1000 + Math.random() * 9000).toString(),
      generatedAt: Date.now(),
    }));
    setDailyClinicPINs(newPINs);
    alert(t("daily_pins_generated_success"));
    addAuditLogEntry("Daily PINs Generated", session.admin?.user || "System", "New daily PINs were generated.");
  };

  React.useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const next5AM = new Date(now);
      next5AM.setHours(5, 0, 0, 0);
      if (now.getHours() >= 5) {
        next5AM.setDate(next5AM.getDate() + 1);
      }
      const diff = next5AM.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(t("daily_pins_countdown_text", { hours, minutes, seconds }));

      // Trigger PIN generation at 5 AM
      if (diff <= 1000 && diff > 0) { // Within 1 second of 5 AM
        generatePINs();
      }
    };

    const interval = setInterval(calculateCountdown, 1000);
    calculateCountdown(); // Initial call

    return () => clearInterval(interval);
  }, [dailyClinicPINs]); // Re-run effect if dailyClinicPINs changes to update countdown

  return (
    <div>
      <h4>{t("daily_clinic_pins_title")}</h4>
      <div className="card" style={{ marginBottom: "20px" }}>
        <h5>{countdown}</h5>
        {session.admin?.role === "super_admin" && (
          <button className="btn btn-secondary" onClick={generatePINs}>
            {t("daily_pins_manual_update_button")}
          </button>
        )}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>{t("daily_pins_table_header_clinic_name")}</th>
            <th>{t("daily_pins_table_header_daily_pin")}</th>
            <th>{t("daily_pins_table_header_generated_at")}</th>
          </tr>
        </thead>
        <tbody>
          {dailyClinicPINs.map((clinic, index) => (
            <tr key={index} className={clinic.clinicName === t("daily_clinic_pins_admin_row_text") ? "highlight-row" : ""}>
              <td>{clinic.clinicName}</td>
              <td>{clinic.pin}</td>
              <td>{new Date(clinic.generatedAt).toLocaleString("ar-QA", { timeZone: "Asia/Qatar" })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyClinicPINs;


