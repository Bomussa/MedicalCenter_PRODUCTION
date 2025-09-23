import VoiceGuide from "../components/VoiceGuide";
import useVoicePrompts from "../hooks/useVoicePrompts";
import i18n from "../i18n";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { isValidMilitary, isValidPersonal } from "../utils/validators";
import { AppConfig } from "../app.config";

const StartScreen: React.FC = () => {
  const { session, setSession } = useApp();
  const nav = useNavigate();
  const [idType, setIdType] = React.useState<"military"|"personal">("military");
  const [userId, setUserId] = React.useState(session.userId);
  const [gender, setGender] = React.useState<"male"|"female">("male");
  const [showFemaleNote, setShowFemaleNote] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Load voice prompts at component level. This must be called in the body of the component, not inside nested functions.
  const { prompts, loading: promptsLoading } = useVoicePrompts();

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
    setError(null);
  };

  const handleGenderChange = (selectedGender: "male"|"female") => {
    setGender(selectedGender);
    if (selectedGender === "female") {
      setShowFemaleNote(true);
    } else {
      setShowFemaleNote(false);
    }
  };

  const handleStart = () => {
    let currentIdType = idType;
    if (userId.startsWith("M")) {
      currentIdType = "military";
    } else if (userId.startsWith("P")) {
      currentIdType = "personal";
    }

    const validator = currentIdType === "military" ? isValidMilitary : isValidPersonal;
    if (!validator(userId)) {
      setError("يرجى إدخال رقم صحيح.");
      return;
    }

    setSession({ ...session, idType: currentIdType, userId, gender });
    nav("/exam");
  };

  const handleAdminAccess = () => {
    nav("/admin/login");
  };

  return (
    <>
      {/* Render voice guidance prompts when loaded */}
      {!promptsLoading && prompts && (
        <>
          <VoiceGuide id='enter_id_gender' prompt={prompts['enter_id_gender']} language={i18n?.language || 'ar'} />
          <VoiceGuide id='welcome' prompt={prompts['welcome']} language={i18n?.language || 'ar'} />
        </>
      )}
      <div className="card">
      <div className="header">
        <img src={AppConfig.branding.logo} alt="logo"/>
        <div>
          <h1>{AppConfig.branding.title.ar}</h1>
          <div className="status">{AppConfig.branding.subtitle.ar}</div>
        </div>
      </div>

      <div className="form-group">
        <label>الرقم العسكري أو الشخصي:</label>
        <input
          className="input"
          inputMode="numeric"
          value={userId}
          onChange={handleIdChange}
          placeholder="أدخل الرقم هنا"
        />
        {error && <div className="alert alert-danger">{error}</div>}
      </div>

      <div className="form-group">
        <label>الجنس:</label>
        <div className="radio-group">
          <label>
            <input type="radio" value="male" checked={gender === "male"} onChange={() => handleGenderChange("male")} />
            ذكر
          </label>
          <label>
            <input type="radio" value="female" checked={gender === "female"} onChange={() => handleGenderChange("female")} />
            أنثى
          </label>
        </div>
      </div>

      {showFemaleNote && (
        <div className="alert alert-info" style={{marginTop: "15px"}}>
          للعنصر النسائي: يرجى التسجيل من استقبال العطار لبعض العيادات قبل التوجه للفحص.
        </div>
      )}

      <div style={{marginTop:20, display:"flex", flexDirection: "column", gap: "10px"}}>
        <button className="btn btn-primary" disabled={!userId || !!error} onClick={handleStart}>موافق</button>
        <button className="btn btn-secondary" onClick={handleAdminAccess}>إدارة/إحصاءات</button>
      </div>

      <div className="language-switcher" style={{marginTop: "20px"}}>
        <button className="btn">English</button>
        <button className="btn btn-danger">العربية</button>
      </div>

      <div className="language-switcher" style={{marginTop: "10px"}}>
        <button className="btn btn-primary">تشغيل الصوت</button>
        <button className="btn btn-primary">إيقاف الصوت</button>
      </div>
    </div>
  );
};
export default StartScreen;


