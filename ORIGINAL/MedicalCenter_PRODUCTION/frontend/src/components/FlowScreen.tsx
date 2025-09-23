import useClinicRedirect from '../hooks/useClinicRedirect';
import VoiceGuide from '../components/VoiceGuide';
import useVoicePrompts from '../hooks/useVoicePrompts';
import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { EXAMS } from "../data/exams";
import { clinicMap } from "../data/clinics";
import { saveVisit } from "../utils/records";
import { isoDateTime } from "../utils/time";

const FlowScreen: React.FC = () => {
  const { session, setSession, t } = useApp();
  const nav = useNavigate();
  const exam = session.examId ? EXAMS[session.examId] : null;
  const flow = !exam ? [] : (session.gender === "female" ? exam.female : exam.male);

  const [pin, setPin] = React.useState("");
  const [pinError, setPinError] = React.useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState(session.clinicsVisited.length);
  const [start] = React.useState(session.startTime || isoDateTime());

  // Debug logging
  React.useEffect(() => {
// removed: // removed:     console.log("FlowScreen mounted");
// removed: // removed:     console.log("Session:", session);
// removed: // removed:     console.log("Exam:", exam);
// removed: // removed:     console.log("Flow:", flow);
  }, [session, exam, flow]);

  React.useEffect(() => {
    const requiresMezzanine = flow.some(clinic => clinicMap[clinic.id]?.floor === "M");
    if (requiresMezzanine && !session.mezzanineMessageShown) {
      setSession({ ...session, mezzanineMessageShown: true });
    }
  }, [flow, session, setSession]);

  // Show loading or error state if no exam
  if (!exam) {
    const [redirectInfo, setRedirectInfo] = React.useState(null as any);
return (

{/* Redirect UI */}
{redirectInfo && (
  <div style={{background:'#fff4e5', border:'1px solid #f0c088', borderRadius:8, padding:12, marginTop:10}}>
    <strong>تم تحويل العيادة مؤقتًا:</strong>
    <div>من: {redirectInfo.from} → إلى: {redirectInfo.to}</div>
    <div style={{marginTop:6}}>
      <VoiceGuide id='clinic_redirect' prompt={prompts['clinic_redirect']} language={i18n?.lang||'ar'} />
    </div>
  </div>
)}


{/* VOICE_PATH_ASSIGNED */}
{state?.pathAssigned && (()=>{ const {prompts}=useVoicePrompts(); return <VoiceGuide id='path_assigned' prompt={prompts['path_assigned']} language={i18n?.lang||'ar'} />; })()}

      <div className="flow-screen-container">
        <div className="header">
          <img src="/assets/logo(14).webp" alt="Logo" className="logo" />
          <h1>{t('militaryMedicalCenter')}</h1>
          <p>{t('militaryMedicalCommittee')}</p>
        </div>
        <div className="card">
          <p>{t('pleaseSelectExamType')}</p>
          <button className="btn" onClick={() => nav('/exam')}>{t('back')}</button>
        </div>
      </div>
    );
  }

  const currentClinic = flow[currentIndex]?.id;
  const currentClinicDetails = currentClinic ? clinicMap[currentClinic] : null;

  const submitPin = () => {
    if (!currentClinic) return;
    
    // Simple PIN validation - in real app this would be more secure
    if (pin === "1234" || pin === "1") {
      const visitTime = isoDateTime();
      const newVisit = { id: currentClinic, doneAt: visitTime };
      
      saveVisit({
        userId: session.userId,
        visitTime,
        clinicId: currentClinic,
        examId: session.examId!,
        gender: session.gender
      });

      setSession({
        ...session,
        clinicsVisited: [...session.clinicsVisited, newVisit]
      });
      
      setCurrentIndex(currentIndex + 1);
      setPin("");
      setPinError(null);
    } else {
      setPinError(t('incorrectPIN'));
    }
  };

  const finish = () => {
    const end = isoDateTime();
    const durationSec = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 1000);
    
    saveVisit({
      userId: session.userId,
      visitTime: end,
      clinicId: "EXAM_COMPLETED",
      examId: session.examId!,
      gender: session.gender,
      assignedModel: session.assignedModel,
      clinicsVisited: session.clinicsVisited,
      startTime: start,
      endTime: end
    });
    
    setSession({ 
      ...session, 
      clinicsVisited: [], 
      startTime: undefined, 
      endTime: undefined, 
      mezzanineMessageShown: false 
    });
    nav("/exam");
  };

  // Group clinics by floor
  const mezzanineFloor = flow.filter(clinic => clinicMap[clinic.id]?.floor === "M");
  const secondFloor = flow.filter(clinic => clinicMap[clinic.id]?.floor === "2");

  const isClinicVisited = (clinicId: string) => {
    return session.clinicsVisited.some(visit => visit.id === clinicId);
  };

  const getClinicStatus = (clinicId: string) => {
    return isClinicVisited(clinicId) ? 'finished' : 'pending';
  };

  const renderClinicCard = (clinic: any, index: number) => {
    const clinicDetails = clinicMap[clinic.id];
    const status = getClinicStatus(clinic.id);
    const isCurrentClinic = index === currentIndex;
    
    return (
      <div key={clinic.id} className={`clinic-card ${status}`}>
        <div className="clinic-name">
          {clinicDetails?.name || clinic.id}
        </div>
        <button 
          className={`clinic-status-btn ${status}`}
          onClick={() => isCurrentClinic && setCurrentIndex(currentIndex)}
          disabled={!isCurrentClinic}
        >
          {status === 'finished' ? (
            <>
              <span className="checkmark">✓</span>
              {t('finished')}
            </>
          ) : (
            t('pending')
          )}
        </button>
      </div>
    );
  };

  if (currentIndex >= flow.length) {
    return (
      <div className="flow-screen-container">
        <div className="header">
          <img src="/assets/logo(14).webp" alt="Logo" className="logo" />
          <h1>{t('militaryMedicalCenter')}</h1>
          <p>{t('militaryMedicalCommittee')}</p>
        </div>
        <div className="completion-card">
          <h2>🎉 {t('finished')}</h2>
          <p>{t('allClinicsCompleted')}</p>
          <button className="btn primary" onClick={finish}>{t('finishExam')}</button>
          <button className="btn secondary" onClick={() => nav('/exam')}>{t('back')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flow-screen-container">
      <div className="header">
        <img src="/assets/logo(14).webp" alt="Logo" className="logo" />
        <h1>{t('militaryMedicalCenter')}</h1>
        <p>{t('militaryMedicalCommittee')}</p>
      </div>

      <div className="patient-info">
        <span>model: {session.assignedModel} - {session.userId} - {session.examId}</span>
      </div>



      <div className="clinics-container">
        {/* Mezzanine Floor */}
        {mezzanineFloor.length > 0 && (
          <div className="floor-section">
            <h2 className="floor-title mezzanine">
              الطابق الميزانين (يمكن التوجه إلى طابق الميزانين عن طريق المصعد بالضغط على حرف M)
            </h2>
            <div className="clinics-list">
              {mezzanineFloor.map((clinic, idx) => {
                const globalIndex = flow.findIndex(c => c.id === clinic.id);
                return renderClinicCard(clinic, globalIndex);
              })}
            </div>
          </div>
        )}

        {/* Second Floor */}
        {secondFloor.length > 0 && (
          <div className="floor-section">
            <h2 className="floor-title second-floor">
              الطابق الثاني (عيادات اللجنة الطبية العسكرية)
            </h2>
            <div className="clinics-list">
              {secondFloor.map((clinic, idx) => {
                const globalIndex = flow.findIndex(c => c.id === clinic.id);
                return renderClinicCard(clinic, globalIndex);
              })}
            </div>
          </div>
        )}
      </div>

      {/* PIN Entry Section */}
      {currentClinic && (
        <div className="pin-entry-section">
          <label>{t('enterClinicPIN')} ({clinicMap[currentClinic]?.name})</label>
          <div className="pin-input-container">
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder={t('enterPIN')}
              className="pin-input"
            />
            <button onClick={submitPin} className="btn primary">
              {t('confirm')}
            </button>
          </div>
          {pinError && <div className="error-message">{pinError}</div>}
        </div>
      )}

      {/* Control Buttons */}
      <div className="control-buttons">
        <button className="btn primary" onClick={finish}>
          إنهاء الفحص
        </button>
        <button className="btn secondary" onClick={() => nav('/exam')}>
          العودة
        </button>
      </div>

      {/* Language and Audio Controls */}
      <div className="bottom-controls">
        <div className="language-controls">
          <button className="btn lang en">
            English
          </button>
          <button className="btn lang ar">
            العربية
          </button>
        </div>
        <div className="audio-controls">
          <button className="btn audio">
            تشغيل الصوت
          </button>
          <button className="btn audio">
            إيقاف الصوت
          </button>
        </div>
      </div>
    </div>
  );
};


/* REDIRECT_AFTER_PIN */
const { resolve } = useClinicRedirect();
const { prompts } = useVoicePrompts();
async function applyRedirectIfAny(nextSlug:string){
  const info = await resolve(nextSlug);
  if(!info) return nextSlug;
  if(info.to){
    // show redirect hint with voice
    setRedirectInfo(info);
    return info.to;
  }
  return nextSlug;
}

export default FlowScreen;

