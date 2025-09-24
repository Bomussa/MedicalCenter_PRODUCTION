/**
 * مهمة تحديث الأكواد اليومية للعيادات
 * تعمل تلقائياً كل يوم في الساعة 6 صباحاً
 */

import { readJson, writeJson } from '../models/index.js';
import logger from '../utils/logger.js';

// محاكاة cron للبيئة الحالية
class DailyCodeJob {
    constructor() {
        this.isRunning = false;
        this.lastRun = null;
        this.interval = null;
        this.init();
    }

    init() {
        // تشغيل فحص كل دقيقة للتحقق من الحاجة لتحديث الأكواد
        this.interval = setInterval(() => {
            this.checkAndUpdate();
        }, 60000); // كل دقيقة

        logger.info('Daily code job initialized');
    }

    checkAndUpdate() {
        const now = new Date();
        const currentDate = now.toDateString();
        
        // التحقق من أن اليوم جديد والوقت مناسب (بين 6-7 صباحاً)
        if (this.lastRun !== currentDate && now.getHours() >= 6 && now.getHours() < 7) {
            this.updateDailyCodes();
            this.lastRun = currentDate;
        }
    }

    updateDailyCodes() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        logger.info('Starting daily code update...');

        try {
            const clinics = readJson('clinics.json', []);
            const updatedClinics = clinics.map(clinic => ({
                ...clinic,
                dailyCode: this.generateNewCode(),
                lastCodeUpdate: new Date().toISOString()
            }));

            writeJson('clinics.json', updatedClinics);

            // تسجيل التحديث
            const updates = readJson('codeUpdates.json', []);
            updates.push({
                date: new Date().toISOString(),
                clinicsUpdated: updatedClinics.length,
                codes: updatedClinics.map(c => ({ id: c.id, code: c.dailyCode }))
            });

            // الاحتفاظ بآخر 30 تحديث فقط
            if (updates.length > 30) {
                updates.splice(0, updates.length - 30);
            }

            writeJson('codeUpdates.json', updates);

            logger.info(`Daily codes updated successfully for ${updatedClinics.length} clinics`);
            
            // إشعار المسؤولين (إذا كان هناك نظام إشعارات)
            this.notifyAdmins(updatedClinics.length);

        } catch (error) {
            logger.error('Failed to update daily codes:', error);
        } finally {
            this.isRunning = false;
        }
    }

    generateNewCode() {
        // توليد كود من 6 أرقام
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    notifyAdmins(clinicsCount) {
        // يمكن إضافة إشعارات للمسؤولين هنا
        logger.info(`Notification: ${clinicsCount} clinic codes updated`);
    }

    // تحديث يدوي للأكواد
    forceUpdate() {
        logger.info('Force updating daily codes...');
        this.updateDailyCodes();
    }

    // الحصول على آخر التحديثات
    getLastUpdates(limit = 10) {
        const updates = readJson('codeUpdates.json', []);
        return updates.slice(-limit).reverse();
    }

    // إيقاف المهمة
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            logger.info('Daily code job stopped');
        }
    }

    // إعادة تشغيل المهمة
    restart() {
        this.stop();
        this.init();
    }

    // الحصول على حالة المهمة
    getStatus() {
        return {
            isRunning: this.isRunning,
            lastRun: this.lastRun,
            nextCheck: new Date(Date.now() + 60000).toISOString(),
            intervalActive: !!this.interval
        };
    }
}

// إنشاء مثيل المهمة
const dailyCodeJob = new DailyCodeJob();

// تصدير للاستخدام في أجزاء أخرى من التطبيق
export default dailyCodeJob;

// API endpoints للتحكم في المهمة
export const getDailyCodeJobStatus = () => dailyCodeJob.getStatus();
export const forceUpdateCodes = () => dailyCodeJob.forceUpdate();
export const getCodeUpdateHistory = (limit) => dailyCodeJob.getLastUpdates(limit);
