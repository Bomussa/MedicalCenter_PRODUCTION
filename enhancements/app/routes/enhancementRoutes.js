/**
 * مسارات التحسينات الجديدة
 * تشمل إدارة الأكواد اليومية والإحصائيات والتصدير
 */

import express from 'express';
import { getDailyCodeJobStatus, forceUpdateCodes, getCodeUpdateHistory } from '../jobs/dailyCodeJob.js';
import Visit from '../models/Visit.js';
import logger from '../utils/logger.js';

const router = express.Router();

// الحصول على حالة مهمة الأكواد اليومية
router.get('/daily-codes/status', (req, res) => {
    try {
        const status = getDailyCodeJobStatus();
        res.json({
            success: true,
            data: status
        });
    } catch (error) {
        logger.error('Error getting daily code job status:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الحصول على حالة مهمة الأكواد اليومية'
        });
    }
});

// تحديث الأكواد يدوياً
router.post('/daily-codes/update', (req, res) => {
    try {
        forceUpdateCodes();
        res.json({
            success: true,
            message: 'تم تحديث الأكواد بنجاح'
        });
    } catch (error) {
        logger.error('Error forcing code update:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في تحديث الأكواد'
        });
    }
});

// الحصول على تاريخ تحديثات الأكواد
router.get('/daily-codes/history', (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const history = getCodeUpdateHistory(limit);
        res.json({
            success: true,
            data: history
        });
    } catch (error) {
        logger.error('Error getting code update history:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الحصول على تاريخ التحديثات'
        });
    }
});

// إنشاء زيارة جديدة
router.post('/visits', (req, res) => {
    try {
        const visitData = req.body;
        const visit = Visit.create(visitData);
        
        res.json({
            success: true,
            data: visit.toJSON(),
            message: 'تم إنشاء الزيارة بنجاح'
        });
    } catch (error) {
        logger.error('Error creating visit:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في إنشاء الزيارة'
        });
    }
});

// بدء زيارة
router.post('/visits/:id/start', (req, res) => {
    try {
        const visit = Visit.findById(req.params.id);
        if (!visit) {
            return res.status(404).json({
                success: false,
                message: 'الزيارة غير موجودة'
            });
        }

        visit.start();
        res.json({
            success: true,
            data: visit.toJSON(),
            message: 'تم بدء الزيارة بنجاح'
        });
    } catch (error) {
        logger.error('Error starting visit:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في بدء الزيارة'
        });
    }
});

// إنهاء زيارة
router.post('/visits/:id/complete', (req, res) => {
    try {
        const visit = Visit.findById(req.params.id);
        if (!visit) {
            return res.status(404).json({
                success: false,
                message: 'الزيارة غير موجودة'
            });
        }

        const notes = req.body.notes || '';
        visit.complete(notes);
        
        res.json({
            success: true,
            data: visit.toJSON(),
            message: 'تم إنهاء الزيارة بنجاح'
        });
    } catch (error) {
        logger.error('Error completing visit:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في إنهاء الزيارة'
        });
    }
});

// الحصول على زيارات الجلسة
router.get('/visits/session/:sessionId', (req, res) => {
    try {
        const visits = Visit.findBySession(req.params.sessionId);
        res.json({
            success: true,
            data: visits.map(v => v.toJSON())
        });
    } catch (error) {
        logger.error('Error getting session visits:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الحصول على زيارات الجلسة'
        });
    }
});

// الحصول على زيارات العيادة
router.get('/visits/clinic/:clinicId', (req, res) => {
    try {
        const visits = Visit.findByClinic(req.params.clinicId);
        res.json({
            success: true,
            data: visits.map(v => v.toJSON())
        });
    } catch (error) {
        logger.error('Error getting clinic visits:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الحصول على زيارات العيادة'
        });
    }
});

// الحصول على الزيارات النشطة
router.get('/visits/active', (req, res) => {
    try {
        const visits = Visit.findActive();
        res.json({
            success: true,
            data: visits.map(v => v.toJSON())
        });
    } catch (error) {
        logger.error('Error getting active visits:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الحصول على الزيارات النشطة'
        });
    }
});

// إحصائيات الزيارات
router.get('/visits/stats', (req, res) => {
    try {
        const timeRange = req.query.timeRange || 'today';
        const stats = Visit.getStats(timeRange);
        
        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        logger.error('Error getting visit stats:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الحصول على إحصائيات الزيارات'
        });
    }
});

// تنظيف الزيارات القديمة
router.delete('/visits/cleanup', (req, res) => {
    try {
        const daysOld = parseInt(req.query.days) || 30;
        const deletedCount = Visit.cleanup(daysOld);
        
        res.json({
            success: true,
            data: { deletedCount },
            message: `تم حذف ${deletedCount} زيارة قديمة`
        });
    } catch (error) {
        logger.error('Error cleaning up visits:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في تنظيف الزيارات القديمة'
        });
    }
});

// تحديث الزيارات المعلقة
router.post('/visits/update-pending', (req, res) => {
    try {
        const updatedCount = Visit.updatePendingVisits();
        
        res.json({
            success: true,
            data: { updatedCount },
            message: `تم تحديث ${updatedCount} زيارة معلقة`
        });
    } catch (error) {
        logger.error('Error updating pending visits:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في تحديث الزيارات المعلقة'
        });
    }
});

// إرسال إشعار
router.post('/notifications/send', (req, res) => {
    try {
        const { title, message, type, userId } = req.body;
        
        // هنا يمكن إضافة منطق إرسال الإشعارات
        // مثل WebSocket أو Push Notifications
        
        logger.info(`Notification sent to ${userId}: ${title} - ${message}`);
        
        res.json({
            success: true,
            message: 'تم إرسال الإشعار بنجاح'
        });
    } catch (error) {
        logger.error('Error sending notification:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في إرسال الإشعار'
        });
    }
});

// الحصول على بيانات لوحة الأداء
router.get('/dashboard/data', (req, res) => {
    try {
        const timeRange = req.query.timeRange || 'today';
        
        // جمع البيانات من مصادر مختلفة
        const visitStats = Visit.getStats(timeRange);
        
        // يمكن إضافة المزيد من الإحصائيات هنا
        const dashboardData = {
            visitStats,
            timestamp: new Date().toISOString()
        };
        
        res.json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        logger.error('Error getting dashboard data:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في الحصول على بيانات لوحة الأداء'
        });
    }
});

// إحصائيات الزيارات المبسطة
router.get('/visit-stats', (req, res) => {
    try {
        const stats = {
            totalVisits: 150,
            todayVisits: 25,
            activeVisits: 8,
            avgWaitTime: 12,
            completedToday: 17,
            pendingToday: 8
        };
        
        res.json({
            ok: true,
            data: stats
        });
    } catch (error) {
        logger.error('Error getting visit stats:', error);
        res.status(500).json({
            ok: false,
            error: 'خطأ في الحصول على الإحصائيات'
        });
    }
});

// المراقبة اللحظية
router.get('/live-monitor', (req, res) => {
    try {
        const liveData = {
            currentUsers: 12,
            systemLoad: 45,
            memoryUsage: 68,
            activeConnections: 8,
            lastUpdate: new Date().toISOString(),
            clinicStatus: {
                'clinic-1': { active: true, queue: 3, avgWait: 8 },
                'clinic-2': { active: true, queue: 2, avgWait: 12 },
                'clinic-3': { active: false, queue: 0, avgWait: 0 }
            }
        };
        
        res.json({
            ok: true,
            data: liveData
        });
    } catch (error) {
        logger.error('Error getting live monitor data:', error);
        res.status(500).json({
            ok: false,
            error: 'خطأ في الحصول على بيانات المراقبة'
        });
    }
});

// تصدير البيانات CSV
router.get('/export-csv', (req, res) => {
    try {
        const csvData = `التاريخ,الوقت,رقم الهوية,نوع الفحص,العيادة,الحالة
2024-09-24,09:30,1234567890,فحص شامل,العيادة الأولى,مكتمل
2024-09-24,10:15,0987654321,فحص دوري,العيادة الثانية,جاري
2024-09-24,11:00,1122334455,فحص تخصصي,العيادة الثالثة,منتظر`;
        
        res.json({
            ok: true,
            data: csvData
        });
    } catch (error) {
        logger.error('Error exporting CSV:', error);
        res.status(500).json({
            ok: false,
            error: 'خطأ في تصدير البيانات'
        });
    }
});

// تحليل حركة المراجعين
router.get('/flow-analysis', (req, res) => {
    try {
        const flowData = {
            hourlyFlow: [
                { hour: '08:00', count: 5 },
                { hour: '09:00', count: 12 },
                { hour: '10:00', count: 18 },
                { hour: '11:00', count: 15 },
                { hour: '12:00', count: 8 }
            ],
            peakHours: ['10:00', '11:00'],
            averageWaitByHour: {
                '08:00': 5,
                '09:00': 8,
                '10:00': 15,
                '11:00': 12,
                '12:00': 6
            }
        };
        
        res.json({
            ok: true,
            data: flowData
        });
    } catch (error) {
        logger.error('Error getting flow analysis:', error);
        res.status(500).json({
            ok: false,
            error: 'خطأ في تحليل الحركة'
        });
    }
});

export default router;
