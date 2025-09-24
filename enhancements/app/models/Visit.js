/**
 * نموذج الزيارات لتتبع أوقات الانتظار والإحصائيات
 */

import { readJson, writeJson } from './index.js';
import logger from '../utils/logger.js';

class Visit {
    constructor(data) {
        this.id = data.id || this.generateId();
        this.sessionId = data.sessionId;
        this.clinicId = data.clinicId;
        this.userId = data.userId || data.idNumber;
        this.startTime = data.startTime || new Date();
        this.endTime = data.endTime || null;
        this.waitingTime = data.waitingTime || 0;
        this.status = data.status || 'waiting'; // waiting, in_progress, completed
        this.examType = data.examType;
        this.notes = data.notes || '';
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    generateId() {
        return 'visit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // حفظ الزيارة
    save() {
        const visits = readJson('visits.json', []);
        const existingIndex = visits.findIndex(v => v.id === this.id);
        
        this.updatedAt = new Date();
        
        if (existingIndex >= 0) {
            visits[existingIndex] = this.toJSON();
        } else {
            visits.push(this.toJSON());
        }
        
        writeJson('visits.json', visits);
        logger.info(`Visit saved: ${this.id}`);
        return this;
    }

    // بدء الزيارة
    start() {
        this.startTime = new Date();
        this.status = 'in_progress';
        return this.save();
    }

    // إنهاء الزيارة
    complete(notes = '') {
        this.endTime = new Date();
        this.status = 'completed';
        this.notes = notes;
        this.calculateDuration();
        return this.save();
    }

    // حساب مدة الزيارة
    calculateDuration() {
        if (this.startTime && this.endTime) {
            const start = new Date(this.startTime);
            const end = new Date(this.endTime);
            this.duration = Math.round((end - start) / (1000 * 60)); // بالدقائق
        }
        return this.duration || 0;
    }

    // حساب وقت الانتظار
    calculateWaitingTime() {
        if (this.status === 'waiting') {
            const now = new Date();
            const created = new Date(this.createdAt);
            this.waitingTime = Math.round((now - created) / (1000 * 60));
        }
        return this.waitingTime;
    }

    // تحويل إلى JSON
    toJSON() {
        return {
            id: this.id,
            sessionId: this.sessionId,
            clinicId: this.clinicId,
            userId: this.userId,
            startTime: this.startTime,
            endTime: this.endTime,
            waitingTime: this.waitingTime,
            duration: this.duration,
            status: this.status,
            examType: this.examType,
            notes: this.notes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // البحث عن زيارة بالمعرف
    static findById(id) {
        const visits = readJson('visits.json', []);
        const visitData = visits.find(v => v.id === id);
        return visitData ? new Visit(visitData) : null;
    }

    // البحث عن زيارات بالجلسة
    static findBySession(sessionId) {
        const visits = readJson('visits.json', []);
        return visits
            .filter(v => v.sessionId === sessionId)
            .map(v => new Visit(v));
    }

    // البحث عن زيارات بالعيادة
    static findByClinic(clinicId) {
        const visits = readJson('visits.json', []);
        return visits
            .filter(v => v.clinicId === clinicId)
            .map(v => new Visit(v));
    }

    // البحث عن زيارات نشطة
    static findActive() {
        const visits = readJson('visits.json', []);
        return visits
            .filter(v => v.status === 'waiting' || v.status === 'in_progress')
            .map(v => new Visit(v));
    }

    // إنشاء زيارة جديدة
    static create(data) {
        const visit = new Visit(data);
        return visit.save();
    }

    // حذف زيارة
    static delete(id) {
        const visits = readJson('visits.json', []);
        const filteredVisits = visits.filter(v => v.id !== id);
        writeJson('visits.json', filteredVisits);
        logger.info(`Visit deleted: ${id}`);
        return true;
    }

    // الحصول على جميع الزيارات
    static getAll() {
        const visits = readJson('visits.json', []);
        return visits.map(v => new Visit(v));
    }

    // إحصائيات الزيارات
    static getStats(timeRange = 'today') {
        const visits = Visit.getAll();
        const now = new Date();
        let startDate;

        switch (timeRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                startDate = new Date(0);
        }

        const filteredVisits = visits.filter(v => 
            new Date(v.createdAt) >= startDate
        );

        const stats = {
            total: filteredVisits.length,
            completed: filteredVisits.filter(v => v.status === 'completed').length,
            inProgress: filteredVisits.filter(v => v.status === 'in_progress').length,
            waiting: filteredVisits.filter(v => v.status === 'waiting').length,
            averageWaitingTime: 0,
            averageDuration: 0,
            clinicStats: {},
            examTypeStats: {}
        };

        // حساب متوسط وقت الانتظار
        const waitingTimes = filteredVisits
            .filter(v => v.waitingTime > 0)
            .map(v => v.waitingTime);
        
        if (waitingTimes.length > 0) {
            stats.averageWaitingTime = Math.round(
                waitingTimes.reduce((sum, time) => sum + time, 0) / waitingTimes.length
            );
        }

        // حساب متوسط مدة الزيارة
        const durations = filteredVisits
            .filter(v => v.duration > 0)
            .map(v => v.duration);
        
        if (durations.length > 0) {
            stats.averageDuration = Math.round(
                durations.reduce((sum, duration) => sum + duration, 0) / durations.length
            );
        }

        // إحصائيات العيادات
        filteredVisits.forEach(visit => {
            if (!stats.clinicStats[visit.clinicId]) {
                stats.clinicStats[visit.clinicId] = {
                    total: 0,
                    completed: 0,
                    averageWaitingTime: 0,
                    averageDuration: 0
                };
            }
            
            stats.clinicStats[visit.clinicId].total++;
            if (visit.status === 'completed') {
                stats.clinicStats[visit.clinicId].completed++;
            }
        });

        // إحصائيات أنواع الفحوصات
        filteredVisits.forEach(visit => {
            if (!stats.examTypeStats[visit.examType]) {
                stats.examTypeStats[visit.examType] = 0;
            }
            stats.examTypeStats[visit.examType]++;
        });

        return stats;
    }

    // تنظيف الزيارات القديمة
    static cleanup(daysOld = 30) {
        const visits = readJson('visits.json', []);
        const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
        
        const recentVisits = visits.filter(v => 
            new Date(v.createdAt) > cutoffDate
        );
        
        writeJson('visits.json', recentVisits);
        logger.info(`Cleaned up ${visits.length - recentVisits.length} old visits`);
        
        return visits.length - recentVisits.length;
    }

    // تحديث حالة الزيارات المعلقة
    static updatePendingVisits() {
        const visits = readJson('visits.json', []);
        let updated = 0;

        const updatedVisits = visits.map(visitData => {
            const visit = new Visit(visitData);
            
            // تحديث وقت الانتظار للزيارات المعلقة
            if (visit.status === 'waiting') {
                visit.calculateWaitingTime();
                updated++;
            }
            
            return visit.toJSON();
        });

        if (updated > 0) {
            writeJson('visits.json', updatedVisits);
            logger.info(`Updated ${updated} pending visits`);
        }

        return updated;
    }
}

export default Visit;
