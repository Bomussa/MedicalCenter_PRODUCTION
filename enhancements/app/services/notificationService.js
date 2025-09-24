/**
 * خدمة الإشعارات للمراجعين
 * تدعم إشعارات المتصفح والإشعارات الداخلية
 */

class NotificationService {
    constructor() {
        this.permission = 'default';
        this.notifications = [];
        this.init();
    }

    async init() {
        // طلب إذن الإشعارات
        if ('Notification' in window) {
            this.permission = await Notification.requestPermission();
        }

        // إنشاء حاوي الإشعارات الداخلية
        this.createNotificationContainer();
    }

    createNotificationContainer() {
        if (document.getElementById('notification-container')) return;

        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 350px;
        `;
        document.body.appendChild(container);
    }

    // إرسال إشعار للمراجع
    sendNotification(title, message, options = {}) {
        const notification = {
            id: Date.now(),
            title,
            message,
            type: options.type || 'info',
            timestamp: new Date(),
            ...options
        };

        this.notifications.push(notification);

        // إشعار المتصفح
        if (this.permission === 'granted' && options.browser !== false) {
            this.sendBrowserNotification(title, message, options);
        }

        // إشعار داخلي
        if (options.internal !== false) {
            this.sendInternalNotification(notification);
        }

        // تسجيل في وحدة التحكم
        console.log(`🔔 إشعار: ${title} - ${message}`);

        return notification.id;
    }

    sendBrowserNotification(title, message, options) {
        if ('Notification' in window && this.permission === 'granted') {
            const notification = new Notification(title, {
                body: message,
                icon: options.icon || '/logo.png',
                badge: '/logo.png',
                tag: options.tag || 'medical-center',
                requireInteraction: options.requireInteraction || false,
                silent: options.silent || false
            });

            // إغلاق تلقائي بعد 5 ثوان
            setTimeout(() => notification.close(), options.duration || 5000);

            notification.onclick = () => {
                window.focus();
                if (options.onClick) options.onClick();
                notification.close();
            };
        }
    }

    sendInternalNotification(notification) {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notificationEl = document.createElement('div');
        notificationEl.className = `notification notification-${notification.type}`;
        notificationEl.style.cssText = `
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-left: 4px solid ${this.getTypeColor(notification.type)};
            animation: slideIn 0.3s ease-out;
            position: relative;
        `;

        notificationEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: #333; margin-bottom: 5px;">
                        ${notification.title}
                    </div>
                    <div style="color: #666; font-size: 14px;">
                        ${notification.message}
                    </div>
                    <div style="color: #999; font-size: 12px; margin-top: 5px;">
                        ${notification.timestamp.toLocaleTimeString('ar-SA')}
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; font-size: 18px; color: #999; cursor: pointer; padding: 0; margin-left: 10px;">
                    ×
                </button>
            </div>
        `;

        container.appendChild(notificationEl);

        // إزالة تلقائية بعد 8 ثوان
        setTimeout(() => {
            if (notificationEl.parentNode) {
                notificationEl.style.animation = 'slideOut 0.3s ease-in';
                setTimeout(() => notificationEl.remove(), 300);
            }
        }, notification.duration || 8000);
    }

    getTypeColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#007bff'
        };
        return colors[type] || colors.info;
    }

    // إشعارات محددة للمركز الطبي
    notifyExamStarted(examType) {
        this.sendNotification(
            'تم بدء الفحص',
            `تم بدء فحص ${examType} بنجاح. يرجى اتباع التعليمات.`,
            { type: 'success', icon: '/logo.png' }
        );
    }

    notifyClinicReady(clinicName) {
        this.sendNotification(
            'العيادة جاهزة',
            `يمكنك الآن التوجه إلى ${clinicName}`,
            { type: 'info', requireInteraction: true }
        );
    }

    notifyWaitingTime(minutes) {
        this.sendNotification(
            'وقت الانتظار',
            `الوقت المتوقع للانتظار: ${minutes} دقيقة`,
            { type: 'info' }
        );
    }

    notifyExamComplete(reportId) {
        this.sendNotification(
            'اكتمل الفحص',
            `تم إكمال الفحص بنجاح. رقم التقرير: ${reportId}`,
            { type: 'success', requireInteraction: true }
        );
    }

    notifyError(message) {
        this.sendNotification(
            'خطأ',
            message,
            { type: 'error', requireInteraction: true }
        );
    }

    // إدارة الإشعارات
    clearAll() {
        this.notifications = [];
        const container = document.getElementById('notification-container');
        if (container) {
            container.innerHTML = '';
        }
    }

    getNotifications() {
        return this.notifications;
    }

    removeNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
    }
}

// إضافة أنماط CSS للرسوم المتحركة
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification:hover {
        transform: translateX(-5px);
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);

// إنشاء مثيل عام
const notificationService = new NotificationService();

// تصدير للاستخدام في Node.js إذا كان متاحاً
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NotificationService };
}
