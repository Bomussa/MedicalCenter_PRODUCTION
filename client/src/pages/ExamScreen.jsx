import { useState } from 'react';
import http from '../api/http';
import { t } from '../i18n/index';

export default function ExamScreen() {
  const [patientId, setPatientId] = useState('');
  const [pin, setPin] = useState('');
  const [examId, setExamId] = useState(null);
  const [data, setData] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const start = async () => {
    if (!patientId || !pin) return setMessage('patientId و PIN مطلوبان');
    setBusy(true);
    try {
      const { data } = await http.post('/exam/start', { patientId, pin });
      setExamId(data.id);
      setMessage('تم فتح الفحص');
    } catch (e) {
      setMessage(e?.response?.data?.message || 'فشل فتح الفحص');
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!examId || !pin) return setMessage('المعرف و PIN مطلوبان');
    setBusy(true);
    try {
      const { data: resp } = await http.post('/exam/submit', { id: examId, data, pin });
      setMessage(resp.message || 'تم الإرسال');
    } catch (e) {
      setMessage(e?.response?.data?.message || 'فشل الإرسال');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto' }}>
      <h2>Exam</h2>
      <input
        placeholder="Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />
      <input placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} />
      <button disabled={busy} onClick={start}>
        {t('submit')}
      </button>
      {examId && (
        <>
          <textarea
            placeholder="Data (JSON)"
            value={JSON.stringify(data)}
            onChange={(e) => {
              try {
                setData(JSON.parse(e.target.value));
              } catch {
                // ignore
              }
            }}
          />
          <button disabled={busy} onClick={submit}>
            Submit Exam
          </button>
        </>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}
