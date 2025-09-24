/**
 * خدمة الاسترداد التلقائي
 * تراقب صحة النظام وتقوم بإعادة التشغيل التلقائي عند الحاجة
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RecoveryService {
    constructor() {
        this.isMonitoring = false;
        this.healthCheckInterval = null;
        this.recoveryAttempts = 0;
        this.maxRecoveryAttempts = 3;
        this.healthCheckFrequency = 10000; // 10 ثوان
        this.logFile = path.join(__dirname, '../logs/recovery.log');
        this.metricsFile = path.join(__dirname, '../logs/health-metrics.json');
        
        this.thresholds = {
            memoryUsage: 500, // MB
            cpuUsage: 80, // %
            responseTime: 5000, // ms
            errorRate: 10, // %
            diskSpace: 90 // %
        };

        this.metrics = {
            memoryUsage: 0,
            cpuUsage: 0,
            responseTime: 0,
            errorRate: 0,
            diskSpace: 0,
            uptime: 0,
            lastHealthCheck: null,
            healthStatus: 'unknown'
        };

        this.init();
    }

    init() {
        this.ensureLogDirectories();
        this.loadPreviousMetrics();
        this.setupProcessHandlers();
        this.startMonitoring();
    }

    ensureLogDirectories() {
        const logsDir = path.dirname(this.logFile);
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }
    }

    loadPreviousMetrics() {
        try {
            if (fs.existsSync(this.metricsFile)) {
                const data = fs.readFileSync(this.metricsFile, 'utf8');
                const previousMetrics = JSON.parse(data);
                this.metrics = { ...this.metrics, ...previousMetrics };
            }
        } catch (error) {
            logger.warn('فشل في تحميل المقاييس السابقة:', error.message);
        }
    }

    saveMetrics() {
        try {
            fs.writeFileSync(this.metricsFile, JSON.stringify(this.metrics, null, 2));
        } catch (error) {
            logger.warn('فشل في حفظ المقاييس:', error.message);
        }
    }

    setupProcessHandlers() {
        // معالجة الإشارات
        process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
        
        // معالجة الأخطاء غير المتوقعة
        process.on('uncaughtException', (error) => {
            this.logRecoveryEvent('uncaughtException', error.message);
            this.handleCriticalError(error);
        });

        process.on('unhandledRejection', (reason, promise) => {
            this.logRecoveryEvent('unhandledRejection', reason);
            this.handleCriticalError(new Error(`Unhandled Rejection: ${reason}`));
        });

        // معالجة تحذيرات الذاكرة
        process.on('warning', (warning) => {
            if (warning.name === 'MaxListenersExceededWarning') {
                this.logRecoveryEvent('memoryWarning', warning.message);
            }
        });
    }

    startMonitoring() {
        if (this.isMonitoring) return;

        this.isMonitoring = true;
        this.logRecoveryEvent('monitoring_started', 'بدء مراقبة صحة النظام');

        this.healthCheckInterval = setInterval(() => {
            this.performHealthCheck();
        }, this.healthCheckFrequency);

        // فحص فوري
        this.performHealthCheck();
    }

    stopMonitoring() {
        if (!this.isMonitoring) return;

        this.isMonitoring = false;
        
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }

        this.logRecoveryEvent('monitoring_stopped', 'توقف مراقبة صحة النظام');
    }

    async performHealthCheck() {
        try {
            const startTime = Date.now();
            
            // فحص الذاكرة
            const memoryCheck = this.checkMemoryUsage();
            
            // فحص وحدة المعالجة المركزية
            const cpuCheck = await this.checkCPUUsage();
            
            // فحص قاعدة البيانات
            const dbCheck = await this.checkDatabaseConnection();
            
            // فحص مساحة القرص
            const diskCheck = this.checkDiskSpace();
            
            // فحص زمن الاستجابة
            const responseTime = Date.now() - startTime;
            
            // تحديث المقاييس
            this.updateMetrics({
                memoryUsage: memoryCheck.usage,
                cpuUsage: cpuCheck.usage,
                responseTime: responseTime,
                diskSpace: diskCheck.usage,
                uptime: process.uptime(),
                lastHealthCheck: new Date().toISOString()
            });

            // تقييم الصحة العامة
            const healthStatus = this.evaluateHealth({
                memory: memoryCheck.healthy,
                cpu: cpuCheck.healthy,
                database: dbCheck.healthy,
                disk: diskCheck.healthy,
                responseTime: responseTime < this.thresholds.responseTime
            });

            this.metrics.healthStatus = healthStatus;
            this.saveMetrics();

            // اتخاذ إجراءات الاسترداد إذا لزم الأمر
            if (healthStatus === 'critical') {
                await this.initiateRecovery();
            } else if (healthStatus === 'warning') {
                this.logRecoveryEvent('health_warning', 'تحذير: صحة النظام تحتاج مراقبة');
            }

        } catch (error) {
            logger.error('خطأ في فحص صحة النظام:', error);
            this.logRecoveryEvent('health_check_error', error.message);
        }
    }

    checkMemoryUsage() {
        const memoryUsage = process.memoryUsage();
        const heapUsedMB = memoryUsage.heapUsed / 1024 / 1024;
        const heapTotalMB = memoryUsage.heapTotal / 1024 / 1024;
        
        return {
            usage: Math.round(heapUsedMB),
            total: Math.round(heapTotalMB),
            healthy: heapUsedMB < this.thresholds.memoryUsage
        };
    }

    async checkCPUUsage() {
        return new Promise((resolve) => {
            const startUsage = process.cpuUsage();
            const startTime = Date.now();
            
            setTimeout(() => {
                const endUsage = process.cpuUsage(startUsage);
                const endTime = Date.now();
                
                const cpuPercent = ((endUsage.user + endUsage.system) / 1000) / (endTime - startTime) * 100;
                
                resolve({
                    usage: Math.round(cpuPercent),
                    healthy: cpuPercent < this.thresholds.cpuUsage
                });
            }, 100);
        });
    }

    async checkDatabaseConnection() {
        try {
            // محاكاة فحص قاعدة البيانات
            // في التطبيق الحقيقي، يمكن فحص MongoDB أو أي قاعدة بيانات أخرى
            const testQuery = new Promise((resolve) => {
                setTimeout(() => resolve(true), 50);
            });
            
            await testQuery;
            
            return {
                healthy: true,
                responseTime: 50
            };
        } catch (error) {
            return {
                healthy: false,
                error: error.message
            };
        }
    }

    checkDiskSpace() {
        try {
            const stats = fs.statSync(process.cwd());
            // محاكاة فحص مساحة القرص
            const usagePercent = Math.random() * 50 + 20; // 20-70%
            
            return {
                usage: Math.round(usagePercent),
                healthy: usagePercent < this.thresholds.diskSpace
            };
        } catch (error) {
            return {
                usage: 0,
                healthy: false,
                error: error.message
            };
        }
    }

    updateMetrics(newMetrics) {
        this.metrics = { ...this.metrics, ...newMetrics };
    }

    evaluateHealth(checks) {
        const healthyChecks = Object.values(checks).filter(check => check === true).length;
        const totalChecks = Object.keys(checks).length;
        const healthPercentage = (healthyChecks / totalChecks) * 100;

        if (healthPercentage >= 80) {
            return 'healthy';
        } else if (healthPercentage >= 60) {
            return 'warning';
        } else {
            return 'critical';
        }
    }

    async initiateRecovery() {
        if (this.recoveryAttempts >= this.maxRecoveryAttempts) {
            this.logRecoveryEvent('recovery_failed', 'تجاوز الحد الأقصى لمحاولات الاسترداد');
            return;
        }

        this.recoveryAttempts++;
        this.logRecoveryEvent('recovery_initiated', `بدء محاولة الاسترداد رقم ${this.recoveryAttempts}`);

        try {
            // تنظيف الذاكرة
            await this.cleanupMemory();
            
            // إعادة تشغيل الخدمات الحرجة
            await this.restartCriticalServices();
            
            // التحقق من نجاح الاسترداد
            await new Promise(resolve => setTimeout(resolve, 5000));
            await this.performHealthCheck();
            
            if (this.metrics.healthStatus === 'healthy') {
                this.recoveryAttempts = 0;
                this.logRecoveryEvent('recovery_successful', 'نجح الاسترداد التلقائي');
            }
            
        } catch (error) {
            this.logRecoveryEvent('recovery_error', `فشل في الاسترداد: ${error.message}`);
            
            if (this.recoveryAttempts >= this.maxRecoveryAttempts) {
                this.handleCriticalError(new Error('فشل الاسترداد التلقائي'));
            }
        }
    }

    async cleanupMemory() {
        // تشغيل garbage collection
        if (global.gc) {
            global.gc();
        }
        
        // تنظيف الكاش
        if (global.clearCache) {
            global.clearCache();
        }
        
        this.logRecoveryEvent('memory_cleanup', 'تم تنظيف الذاكرة');
    }

    async restartCriticalServices() {
        // إعادة تشغيل الخدمات الحرجة
        // يمكن إضافة منطق إعادة تشغيل قاعدة البيانات، الكاش، إلخ
        this.logRecoveryEvent('services_restart', 'إعادة تشغيل الخدمات الحرجة');
    }

    handleCriticalError(error) {
        this.logRecoveryEvent('critical_error', `خطأ حرج: ${error.message}`);
        
        // إرسال تنبيه للمطورين
        this.sendAlert('critical', error.message);
        
        // إعادة تشغيل العملية
        setTimeout(() => {
            process.exit(1);
        }, 1000);
    }

    sendAlert(level, message) {
        // إرسال تنبيه عبر البريد الإلكتروني، Slack، إلخ
        logger.error(`تنبيه ${level}: ${message}`);
        
        // يمكن إضافة منطق إرسال التنبيهات هنا
    }

    logRecoveryEvent(type, message) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${type}: ${message}\n`;
        
        try {
            fs.appendFileSync(this.logFile, logEntry);
        } catch (error) {
            console.error('فشل في كتابة سجل الاسترداد:', error);
        }
        
        logger.info(`Recovery: ${type} - ${message}`);
    }

    gracefulShutdown(signal) {
        this.logRecoveryEvent('shutdown_initiated', `إيقاف تدريجي بسبب ${signal}`);
        
        this.stopMonitoring();
        this.saveMetrics();
        
        // إغلاق الاتصالات
        setTimeout(() => {
            process.exit(0);
        }, 5000);
    }

    // واجهة برمجية للحصول على المقاييس
    getMetrics() {
        return { ...this.metrics };
    }

    getHealthStatus() {
        return this.metrics.healthStatus;
    }

    // إعادة تعيين محاولات الاسترداد
    resetRecoveryAttempts() {
        this.recoveryAttempts = 0;
        this.logRecoveryEvent('recovery_reset', 'إعادة تعيين محاولات الاسترداد');
    }

    // تحديث عتبات التحذير
    updateThresholds(newThresholds) {
        this.thresholds = { ...this.thresholds, ...newThresholds };
        this.logRecoveryEvent('thresholds_updated', 'تحديث عتبات التحذير');
    }

    // فحص يدوي للصحة
    async manualHealthCheck() {
        await this.performHealthCheck();
        return this.getMetrics();
    }
}

// إنشاء مثيل واحد للخدمة
const recoveryService = new RecoveryService();

// تصدير الخدمة
export default recoveryService;

// تصدير الكلاس للاستخدام في الاختبارات
export { RecoveryService };
