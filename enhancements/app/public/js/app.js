let LANG=\'ar\'; let VOICE=true; let SESSION_ID=null;
function t(ar,en){ return LANG===\'ar\'?ar:en; }
function speak(msg){ try{ if(!VOICE) return; const u=new SpeechSynthesisUtterance(msg); u.lang=LANG===\'ar\'?\'ar-SA\':\'en-US\'; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch{} }
function toggleLang(){
    LANG=(LANG===\'ar\'?\'en\':\'ar\');
    document.documentElement.setAttribute(\'lang\', LANG);
    document.documentElement.setAttribute(\'dir\', LANG === \'ar\' ? \'rtl\' : \'ltr\');
    alert(t(\'تم تغيير اللغة إلى العربية.\', \'Language set to English.\'));
}
function toggleVoice(){ VOICE=!VOICE; alert(VOICE? t(\'تم تشغيل الصوت\',\'Voice ON\'): t(\'تم إيقاف الصوت\',\'Voice OFF\')); }
async function startExam(){
    const id=document.getElementById(\'idnum\').value.trim();
    const gender = document.querySelector(\'input[name="gender"]:checked\').value;
    // Since exam type is not explicitly selected on the UI, we'll need to determine it based on some logic.
    // For now, let's assume a default or a simplified logic based on the user's input or context.
    // As per the provided routes, there are different exam types. The current UI doesn't allow selection.
    // For demonstration, let's pick one of the new exam types, e.g., 'recruitment_promotion_transfer_contract_renewal'
    // In a real application, this would be determined by user selection or backend logic.
    const exam = \'recruitment_promotion_transfer_contract_renewal\'; 

    const res=await fetch(\'/api/patient/start\',{method:\'POST\',headers:{\'Content-Type\':\'application/json\'},body:JSON.stringify({idNumber:id,gender,examType:exam})});
    const j=await res.json();
    if(!j.ok){ alert(j.error||\'خطأ\'); return; }
    SESSION_ID=j.sessionId;
    document.getElementById(\'routeCard\').style.display=\'block\';
    updateNotice(gender, exam);
    renderRoute(j.route, j.current);
    document.getElementById(\'startExamCard\').style.display = \'none\'; // Hide the start exam card after starting
}
function updateNotice(gender, exam){
    let msg=\'\';
    if(gender===\'F\'){
        msg+=t(\'تنويه: يرجى التوجه إلى استقبال الطابق الثالث للتسجيل. \',\'Note: Please go to 3rd floor reception to register. \');
    }
    // This part needs to be dynamic based on the actual route clinics and their floors
    // For now, a generic message or specific to the selected exam type.
    msg+=t(\'يرجى اتباع المسار الطبي الموضح أدناه.\',\'Please follow the medical route shown below.\');
    document.getElementById(\'notice\').textContent=msg;
    speak(msg);
}
function renderRoute(route, idx){
    const box=document.getElementById(\'routeBox\');
    box.innerHTML = \'\'; // Clear previous content
    route.forEach((c, i) => {
        const clinicItem = document.createElement(\'div\');
        clinicItem.classList.add(\'clinic-item\');
        if (i < idx) {
            clinicItem.classList.add(\'finished\');
        }
        clinicItem.innerHTML = `
            <span>${LANG === \'ar\' ? c.name_ar : c.name_en} (${c.floor})</span>
            <button>${i < idx ? \'<i class="fas fa-check"></i> تم الانتهاء\' : \'تم الانتهاء\'}</button>
        `;
        box.appendChild(clinicItem);
    });
    const hint=t(\'أدخل رمز PIN من الممرضة/الطبيب للعيادة الحالية.\',\'Enter clinic PIN from staff for the current step.\');
    document.getElementById(\'hint\').textContent=hint;
    speak(t(\'تم تحديد المسار الطبي. يرجى الالتزام بالمسار.\',\'Your medical route is set. Please follow the instructions.\'));
}
async function enterClinic(){ const pin=document.getElementById(\'pin\').value.trim(); const res=await fetch(\'/api/visits/enter\',{method:\'POST\',headers:{\'Content-Type\':\'application/json\'},body:JSON.stringify({sessionId:SESSION_ID,pin})}); const j=await res.json(); if(!j.ok){ alert(j.error||\'PIN غير صحيح\'); return; } if(j.done){ document.getElementById(\'doneCard\').style.display=\'block\'; document.getElementById(\'routeBox\').textContent=t(\'اكتمل المسار.\',\'Route complete.\'); speak(t(\'تم إنهاء الفحص الطبي بنجاح.\',\'Your exam is completed.\')); } else { renderRoute(j.route, j.current); } }


