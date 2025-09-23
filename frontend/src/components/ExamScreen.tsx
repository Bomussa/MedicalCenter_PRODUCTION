import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { EXAMS } from "../data/exams";
import { ENV } from "../utils/env";
import { pickModel } from "../utils/loadBalancer";
import { clinicMap } from "../data/clinics";
import { useTranslation } from "react-i18next";

const ExamScreen: React.FC = () => {
  const { session, setSession, changeLanguage } = useApp();
  const { t } = useTranslation();
  const nav = useNavigate();
  const [policy] = React.useState<"ROUND_ROBIN"|"HYBRID">(ENV.MODELS_POLICY as any);
  const [showMezzanineNote, setShowMezzanineNote] = React.useState(false);

  const loads = { A: 0, B: 0, C: 0, D: 0 } as any;

  const choose = (examId: string) => {
    const model = pickModel(loads as any);
    const examFlow = session.gender === "male" ? EXAMS[examId].male : EXAMS[examId].female;
    const requiresMezzanine = examFlow.some(clinic => clinicMap[clinic.id]?.floor === "M");

    setSession({ ...session, examId, assignedModel: model, clinicsVisited: [] });

    if (requiresMezzanine) {
      setShowMezzanineNote(true);
    }

    nav("/flow");
  };

  return (
    <div className="exam-screen-container">
      <div className="header">
        <img src="/assets/logo(14).webp" alt="Logo" className="logo" />
        <h1>{t("militaryMedicalCenter")}</h1>
        <p>{t("militaryMedicalCommittee")}</p>
      </div>

      <div className="card exam-selection-card">
        <h3>{t("selectExaminationType")}</h3>
        <div className="exam-grid">
          {Object.entries(EXAMS).map(([id, e]) => (
            <button key={id} className="exam-button" onClick={() => choose(id)}>
              <span className="exam-icon">{e.icon}</span>
              <div className="exam-details">
                <h4>{e.name}</h4>
                <p className="exam-description">{e.description}</p>
              </div>
            </button>
          ))}
        </div>

        {showMezzanineNote && (
          <div className="alert alert-info mezzanine-note">
            {t("floor_m")}
          </div>
        )}
      </div>

      <div className="control-buttons">
        <button className="btn" onClick={() => changeLanguage("en")}>English</button>
        <button className="btn" onClick={() => changeLanguage("ar")}>العربية</button>
        <button className="btn">{t("play_sound")}</button>
        <button className="btn">{t("stop_sound")}</button>
        <button className="btn">{t("end_exam")}</button>
        <button className="btn" onClick={() => nav("/")}>{t("back")}</button>
      </div>

      <div className="status-bar">
        modelDistributionPolicy: {policy}
      </div>
    </div>
  );
};

export default ExamScreen;


