let TOKEN=null;
async function login(){ const u=document.getElementById('u').value.trim(); const p=document.getElementById('p').value.trim();
  const res=await fetch('/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})});
  const j=await res.json(); if(!j.ok){ alert(j.error||'رفض الدخول'); return; } TOKEN=j.token; document.getElementById('authFlag').textContent='مسجل'; }
async function fetchAuth(url,opt={}){ opt.headers=Object.assign({},opt.headers||{}, {'Authorization':'Bearer '+TOKEN}); const res=await fetch(url,opt); return await res.json(); }
async function loadPins(){ const j=await fetchAuth('/admin/pins'); document.getElementById('pinsBox').textContent=JSON.stringify(j,null,2); }
async function setOverride(x){ const j=await fetchAuth('/admin/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({overrideAllClinics:!!x})}); document.getElementById('ovBox').textContent=JSON.stringify(j,null,2); }
async function showBackups(){ const j=await fetchAuth('/admin/backups'); if(j?.ok) document.getElementById('bkpBox').textContent=JSON.stringify(j.data,null,2); }
async function backupNow(){ const j=await fetchAuth('/admin/backup',{method:'POST'}); if(j?.ok){ alert('تم إنشاء نسخة احتياطية'); showBackups(); } }
async function restoreLatest(){ if(!confirm('تأكيد استعادة آخر نسخة احتياطية؟')) return; const j=await fetchAuth('/admin/restore',{method:'POST'}); alert(j?.ok?'تم الاستعادة':'فشلت الاستعادة'); }
async function showErrorLogs(){ const j=await fetchAuth('/admin/logs/errors'); if(j?.ok) document.getElementById('bkpBox').textContent=j.data || '(لا يوجد أخطاء)'; }
