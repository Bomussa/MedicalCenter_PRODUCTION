let TOKEN = null;

// تسجيل الدخول
async function login() {
    const u = document.getElementById('u').value.trim();
    const p = document.getElementById('p').value.trim();
    
    if (!u || !p) {
        updateFlag('authFlag', 'يرجى إدخال اسم المستخدم وكلمة المرور', 'error');
        return;
    }
    
    try {
        const res = await fetch('/admin/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: u, password: p})
        });
        
        const j = await res.json();
        
        if (!j.ok) {
            updateFlag('authFlag', j.error || 'رفض الدخول', 'error');
            return;
        }
        
        TOKEN = j.token;
        updateFlag('authFlag', 'تم تسجيل الدخول بنجاح', 'success');
        
        // تحميل البيانات الأولية
        loadPins();
        loadSystemStats();
        
    } catch (error) {
        updateFlag('authFlag', 'خطأ في الاتصال', 'error');
        console.error('Login error:', error);
    }
}

// طلب مع المصادقة
async function fetchAuth(url, opt = {}) {
    if (!TOKEN) {
        alert('يرجى تسجيل الدخول أولاً');
        return {ok: false, error: 'غير مصرح'};
    }
    
    opt.headers = Object.assign({}, opt.headers || {}, {
        'Authorization': 'Bearer ' + TOKEN
    });
    
    try {
        const res = await fetch(url, opt);
        return await res.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return {ok: false, error: 'خطأ في الشبكة'};
    }
}

// تحميل أكواد PIN
async function loadPins() {
    const j = await fetchAuth('/admin/pins');
    if (j.ok) {
        document.getElementById('pinsBox').textContent = JSON.stringify(j.data, null, 2);
    } else {
        document.getElementById('pinsBox').textContent = 'خطأ: ' + (j.error || 'فشل في تحميل الأكواد');
    }
}

// توليد أكواد جديدة
async function generateNewCodes() {
    if (!confirm('هل تريد توليد أكواد جديدة؟ سيتم إلغاء الأكواد الحالية.')) return;
    
    const j = await fetchAuth('/admin/generate-codes', {method: 'POST'});
    if (j.ok) {
        alert('تم توليد أكواد جديدة بنجاح');
        loadPins();
    } else {
        alert('فشل في توليد الأكواد: ' + (j.error || 'خطأ غير معروف'));
    }
}

// تفعيل/إلغاء الفتح اليدوي
async function setOverride(x) {
    const j = await fetchAuth('/admin/settings', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({overrideAllClinics: !!x})
    });
    
    if (j.ok) {
        document.getElementById('ovBox').textContent = `تم ${x ? 'تفعيل' : 'إلغاء'} الفتح اليدوي`;
    } else {
        document.getElementById('ovBox').textContent = 'خطأ: ' + (j.error || 'فشل في التحديث');
    }
}

// عرض النسخ الاحتياطية
async function showBackups() {
    const j = await fetchAuth('/admin/backups');
    if (j?.ok) {
        document.getElementById('bkpBox').textContent = JSON.stringify(j.data, null, 2);
    } else {
        document.getElementById('bkpBox').textContent = 'خطأ: ' + (j?.error || 'فشل في تحميل النسخ');
    }
}

// إنشاء نسخة احتياطية
async function backupNow() {
    const j = await fetchAuth('/admin/backup', {method: 'POST'});
    if (j?.ok) {
        alert('تم إنشاء نسخة احتياطية بنجاح');
        showBackups();
    } else {
        alert('فشل في إنشاء النسخة الاحتياطية: ' + (j?.error || 'خطأ غير معروف'));
    }
}

// استعادة آخر نسخة
async function restoreLatest() {
    if (!confirm('تأكيد استعادة آخر نسخة احتياطية؟ سيتم فقدان البيانات الحالية.')) return;
    
    const j = await fetchAuth('/admin/restore', {method: 'POST'});
    if (j?.ok) {
        alert('تم الاستعادة بنجاح');
        location.reload();
    } else {
        alert('فشلت الاستعادة: ' + (j?.error || 'خطأ غير معروف'));
    }
}

// عرض سجل الأخطاء
async function showErrorLogs() {
    const j = await fetchAuth('/admin/logs/errors');
    if (j?.ok) {
        document.getElementById('bkpBox').textContent = j.data || '(لا يوجد أخطاء)';
    } else {
        document.getElementById('bkpBox').textContent = 'خطأ: ' + (j?.error || 'فشل في تحميل السجلات');
    }
}

// تحميل إحصائيات النظام
async function loadSystemStats() {
    const j = await fetchAuth('/api/enhancements/visit-stats');
    if (j.ok) {
        displayStats(j.data);
    } else {
        document.getElementById('statsBox').innerHTML = '<p class="error">فشل في تحميل الإحصائيات</p>';
    }
}

// عرض الإحصائيات
function displayStats(data) {
    const statsBox = document.getElementById('statsBox');
    statsBox.innerHTML = `
        <div class="stats-container">
            <div class="stat-card">
                <div class="stat-value">${data.totalVisits || 0}</div>
                <div class="stat-label">إجمالي الزيارات</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.todayVisits || 0}</div>
                <div class="stat-label">زيارات اليوم</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.activeVisits || 0}</div>
                <div class="stat-label">زيارات نشطة</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${data.avgWaitTime || 0}د</div>
                <div class="stat-label">متوسط الانتظار</div>
            </div>
        </div>
    `;
}

// تصدير البيانات
async function exportData() {
    const j = await fetchAuth('/api/enhancements/export-csv');
    if (j.ok) {
        // إنشاء رابط تحميل
        const blob = new Blob([j.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medical_center_data_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        alert('تم تصدير البيانات بنجاح');
    } else {
        alert('فشل في تصدير البيانات: ' + (j.error || 'خطأ غير معروف'));
    }
}

// مسح التخزين المؤقت
async function clearCache() {
    if (!confirm('هل تريد مسح التخزين المؤقت؟')) return;
    
    const j = await fetchAuth('/admin/clear-cache', {method: 'POST'});
    if (j.ok) {
        alert('تم مسح التخزين المؤقت بنجاح');
        document.getElementById('toolsBox').textContent = 'تم مسح التخزين المؤقت';
    } else {
        alert('فشل في مسح التخزين المؤقت: ' + (j.error || 'خطأ غير معروف'));
    }
}

// إعادة تشغيل الخدمات
async function restartServices() {
    if (!confirm('هل تريد إعادة تشغيل الخدمات؟ قد يستغرق هذا بعض الوقت.')) return;
    
    const j = await fetchAuth('/admin/restart-services', {method: 'POST'});
    if (j.ok) {
        alert('تم إعادة تشغيل الخدمات بنجاح');
        document.getElementById('toolsBox').textContent = 'تم إعادة تشغيل الخدمات';
    } else {
        alert('فشل في إعادة تشغيل الخدمات: ' + (j.error || 'خطأ غير معروف'));
    }
}

// اختبار الاتصالات
async function testConnections() {
    document.getElementById('toolsBox').textContent = 'جاري اختبار الاتصالات...';
    
    const j = await fetchAuth('/admin/test-connections');
    if (j.ok) {
        document.getElementById('toolsBox').textContent = JSON.stringify(j.data, null, 2);
    } else {
        document.getElementById('toolsBox').textContent = 'فشل في اختبار الاتصالات: ' + (j.error || 'خطأ غير معروف');
    }
}

// تحديث العلامات
function updateFlag(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.className = `flag ${type}`;
}

// تحديث تلقائي للإحصائيات كل 30 ثانية
setInterval(() => {
    if (TOKEN) {
        loadSystemStats();
    }
}, 30000);
