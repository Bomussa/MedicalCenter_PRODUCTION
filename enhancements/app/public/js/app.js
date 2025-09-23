import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18next
  .use(HttpBackend)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'ar',
    debug: true,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'sessionStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  }, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
    updateContent();
  });

let VOICE = true;
let SESSION_ID = null;

function t(key) {
  return i18next.t(key);
}

function speak(msg) {
  try {
    if (!VOICE) return;
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = i18next.language === 'ar' ? 'ar-SA' : 'en-US';
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  } catch (e) {
    console.error('Speech synthesis error:', e);
  }
}

function toggleLang() {
  const newLang = i18next.language === 'ar' ? 'en' : 'ar';
  i18next.changeLanguage(newLang, (err, t) => {
    if (err) return console.log('something went wrong changing language', err);
    document.documentElement.setAttribute('lang', newLang);
    document.documentElement.setAttribute('dir', newLang === 'ar' ? 'rtl' : 'ltr');
    updateContent();
    alert(t('language_changed'));
  });
}

function toggleVoice() {
  VOICE = !VOICE;
  alert(VOICE ? t('voice_on') : t('voice_off'));
}

async function startExam() {
  const id = document.getElementById('idnum').value.trim();
  const gender = document.querySelector('input[name="gender"]:checked').value;
  const exam = 'recruitment_promotion_transfer_contract_renewal';

  const res = await fetch('/api/patient/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idNumber: id, gender, examType: exam })
  });
  const j = await res.json();
  if (!j.ok) {
    alert(j.error || t('error'));
    return;
  }
  SESSION_ID = j.sessionId;
  document.getElementById('routeCard').style.display = 'block';
  updateNotice(gender, exam);
  renderRoute(j.route, j.current);
  document.getElementById('startExamCard').style.display = 'none';
}

function updateNotice(gender, exam) {
  let msg = '';
  if (gender === 'F') {
    msg += t('female_reception_note');
  }
  msg += t('follow_medical_route');
  document.getElementById('notice').textContent = msg;
  speak(msg);
}

function renderRoute(route, idx) {
  const box = document.getElementById('routeBox');
  box.innerHTML = '';
  route.forEach((c, i) => {
    const clinicItem = document.createElement('div');
    clinicItem.classList.add('clinic-item');
    if (i < idx) {
      clinicItem.classList.add('finished');
    }
    clinicItem.innerHTML = `
            <span>${i18next.language === 'ar' ? c.name_ar : c.name_en} (${c.floor})</span>
            <button>${i < idx ? `<i class="fas fa-check"></i> ${t('completed')}` : t('completed')}</button>
        `;
    box.appendChild(clinicItem);
  });
  const hint = t('enter_pin_hint');
  document.getElementById('hint').textContent = hint;
  speak(t('medical_route_set'));
}

async function enterClinic() {
  const pin = document.getElementById('pin').value.trim();
  const res = await fetch('/api/visits/enter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId: SESSION_ID, pin })
  });
  const j = await res.json();
  if (!j.ok) {
    alert(j.error || t('incorrect_pin'));
    return;
  }
  if (j.done) {
    document.getElementById('doneCard').style.display = 'block';
    document.getElementById('routeBox').textContent = t('route_complete');
    speak(t('exam_completed_successfully'));
  } else {
    renderRoute(j.route, j.current);
  }
}

function updateContent() {
  document.getElementById('mainTitle').textContent = t('main_title');
  document.getElementById('idnum').placeholder = t('id_number_placeholder');
  document.getElementById('passwordInput').placeholder = t('pin_placeholder'); // Changed from pinPlaceholder to passwordInput
  document.getElementById('maleLabel').textContent = t('male');
  document.getElementById('femaleLabel').textContent = t('female');
  document.getElementById('continueButton').querySelector('span').textContent = t('continue_process');
  document.getElementById('langButton').querySelector('span').textContent = t('toggle_language');
  document.getElementById('voiceButton').querySelector('span').textContent = t('toggle_voice');
  document.getElementById('adminPanelLink').querySelector('button').textContent = t('admin_panel');
  document.getElementById('doneMessage').textContent = t('exam_completed_successfully');
  document.getElementById('enterClinicButton').textContent = t('enter_pin_button');
  document.getElementById('pin').placeholder = t('enter_pin_hint');
  // Update other dynamic content if necessary
}

// Initial content update and event listeners
document.addEventListener('DOMContentLoaded', () => {
  i18next.on('languageChanged', () => {
    updateContent();
  });

  document.getElementById('continueButton').addEventListener('click', startExam);
  document.getElementById('langButton').addEventListener('click', toggleLang);
  document.getElementById('voiceButton').addEventListener('click', toggleVoice);
  document.getElementById('enterClinicButton').addEventListener('click', enterClinic);

  updateContent(); // Call once on load to set initial content
});


