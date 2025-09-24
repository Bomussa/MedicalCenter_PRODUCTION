/**
 * مكون تبديل الوضع الليلي/النهاري
 * يوفر تجربة مستخدم محسنة مع حفظ التفضيلات
 */

class ThemeToggle {
    constructor() {
        this.currentTheme = 'light';
        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.createToggleButton();
        this.addThemeStyles();
        this.applyTheme();
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('medicalCenter_theme');
        if (savedTheme) {
            this.currentTheme = savedTheme;
        } else {
            // التحقق من تفضيل النظام
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.currentTheme = 'dark';
            }
        }
    }

    createToggleButton() {
        // البحث عن زر موجود أو إنشاء واحد جديد
        let toggleButton = document.getElementById('themeToggleBtn');
        
        if (!toggleButton) {
            toggleButton = document.createElement('button');
            toggleButton.id = 'themeToggleBtn';
            toggleButton.className = 'theme-toggle-btn';
            
            // إضافة الزر إلى الهيدر أو مكان مناسب
            const header = document.querySelector('header');
            if (header) {
                header.appendChild(toggleButton);
            } else {
                document.body.appendChild(toggleButton);
            }
        }

        this.updateButtonContent(toggleButton);
        
        toggleButton.onclick = () => this.toggleTheme();
    }

    updateButtonContent(button) {
        const isDark = this.currentTheme === 'dark';
        button.innerHTML = `
            <i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>
            <span>${isDark ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
        `;
        button.setAttribute('aria-label', isDark ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي');
    }

    addThemeStyles() {
        const style = document.createElement('style');
        style.id = 'theme-styles';
        style.textContent = `
            /* أنماط الوضع الليلي */
            body.dark-theme {
                background-color: #121212;
                color: #e0e0e0;
                transition: background-color 0.3s ease, color 0.3s ease;
            }

            body.dark-theme .card {
                background-color: #1e1e1e;
                border: 1px solid #333;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            body.dark-theme header {
                background-color: #1e1e1e;
                border-bottom: 1px solid #333;
            }

            body.dark-theme footer {
                background-color: #1e1e1e;
                border-top: 1px solid #333;
            }

            body.dark-theme button {
                background-color: #333;
                color: #e0e0e0;
                border: 1px solid #555;
            }

            body.dark-theme button:hover {
                background-color: #444;
            }

            body.dark-theme input {
                background-color: #2a2a2a;
                color: #e0e0e0;
                border: 1px solid #555;
            }

            body.dark-theme input::placeholder {
                color: #888;
            }

            body.dark-theme .muted {
                color: #888;
            }

            body.dark-theme .input-group i {
                color: #888;
            }

            /* أنماط زر التبديل */
            .theme-toggle-btn {
                position: fixed;
                top: 20px;
                left: 20px;
                background: linear-gradient(135deg, #007BFF, #0056b3);
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
                box-shadow: 0 2px 10px rgba(0, 123, 255, 0.3);
                z-index: 1000;
            }

            .theme-toggle-btn:hover {
                background: linear-gradient(135deg, #0056b3, #004085);
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4);
            }

            body.dark-theme .theme-toggle-btn {
                background: linear-gradient(135deg, #ffc107, #e0a800);
                color: #000;
            }

            body.dark-theme .theme-toggle-btn:hover {
                background: linear-gradient(135deg, #e0a800, #d39e00);
            }

            /* أنماط خاصة للوضع الليلي */
            body.dark-theme .summary-card {
                background-color: #2a2a2a;
                border: 1px solid #444;
            }

            body.dark-theme .chart-container {
                background-color: #2a2a2a;
                border: 1px solid #444;
            }

            body.dark-theme .stats-table {
                background-color: #2a2a2a;
            }

            body.dark-theme .stats-table th {
                background-color: #333;
                color: #e0e0e0;
            }

            body.dark-theme .stats-table td {
                border-bottom: 1px solid #444;
            }

            body.dark-theme .stats-table tr:hover {
                background-color: #333;
            }

            body.dark-theme .notification {
                background-color: #2a2a2a;
                border: 1px solid #444;
                color: #e0e0e0;
            }

            body.dark-theme .voice-instruction-btn {
                background: linear-gradient(135deg, #28a745, #1e7e34);
            }

            body.dark-theme .voice-instruction-btn:hover {
                background: linear-gradient(135deg, #1e7e34, #155724);
            }

            /* تحسينات للنصوص في الوضع الليلي */
            body.dark-theme h1,
            body.dark-theme h2,
            body.dark-theme h3,
            body.dark-theme h4,
            body.dark-theme h5,
            body.dark-theme h6 {
                color: #f0f0f0;
            }

            body.dark-theme p {
                color: #d0d0d0;
            }

            body.dark-theme .small {
                color: #999;
            }

            /* تأثيرات الانتقال */
            * {
                transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
            }

            /* أنماط خاصة للأيقونات */
            body.dark-theme .fas,
            body.dark-theme .far,
            body.dark-theme .fab {
                color: #e0e0e0;
            }

            /* أنماط خاصة للروابط */
            body.dark-theme a {
                color: #4dabf7;
            }

            body.dark-theme a:hover {
                color: #74c0fc;
            }

            /* أنماط خاصة للحدود */
            body.dark-theme .row {
                border-color: #444;
            }

            /* أنماط خاصة للظلال */
            body.dark-theme .card,
            body.dark-theme .summary-card,
            body.dark-theme .chart-container {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            }
        `;
        
        // إزالة الأنماط القديمة إذا وجدت
        const existingStyles = document.getElementById('theme-styles');
        if (existingStyles) {
            existingStyles.remove();
        }
        
        document.head.appendChild(style);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveTheme();
        this.updateButtonContent(document.getElementById('themeToggleBtn'));
        
        // إشعار المستخدم
        if (typeof notificationService !== 'undefined') {
            notificationService.sendNotification(
                'تم تغيير المظهر',
                `تم تفعيل ${this.currentTheme === 'dark' ? 'الوضع الليلي' : 'الوضع النهاري'}`,
                { type: 'info', duration: 3000 }
            );
        }
    }

    applyTheme() {
        const body = document.body;
        
        if (this.currentTheme === 'dark') {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
        }

        // تحديث meta theme-color للمتصفحات المحمولة
        this.updateMetaThemeColor();
    }

    updateMetaThemeColor() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        metaThemeColor.content = this.currentTheme === 'dark' ? '#121212' : '#ffffff';
    }

    saveTheme() {
        localStorage.setItem('medicalCenter_theme', this.currentTheme);
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    setTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            this.currentTheme = theme;
            this.applyTheme();
            this.saveTheme();
            this.updateButtonContent(document.getElementById('themeToggleBtn'));
        }
    }

    // مراقبة تغيير تفضيلات النظام
    watchSystemTheme() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            mediaQuery.addListener((e) => {
                // تطبيق تفضيل النظام فقط إذا لم يحفظ المستخدم تفضيلاً
                if (!localStorage.getItem('medicalCenter_theme')) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                    this.updateButtonContent(document.getElementById('themeToggleBtn'));
                }
            });
        }
    }

    // إضافة اختصار لوحة المفاتيح
    addKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T لتبديل المظهر
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    // تهيئة كاملة
    fullInit() {
        this.init();
        this.watchSystemTheme();
        this.addKeyboardShortcut();
    }
}

// إنشاء مثيل عام
const themeToggle = new ThemeToggle();

// تهيئة كاملة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    themeToggle.fullInit();
});

// تصدير للاستخدام في أجزاء أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeToggle };
}
