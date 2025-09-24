/**
 * أداة تصدير البيانات إلى CSV
 * تدعم التصدير بتنسيقات مختلفة والترجمة
 */

class CSVExporter {
    constructor() {
        this.delimiter = ',';
        this.encoding = 'utf-8';
        this.includeHeaders = true;
    }

    // تحويل البيانات إلى CSV
    convertToCSV(data, options = {}) {
        if (!Array.isArray(data) || data.length === 0) {
            return '';
        }

        const delimiter = options.delimiter || this.delimiter;
        const includeHeaders = options.includeHeaders !== false;
        const headers = options.headers || Object.keys(data[0]);
        const translations = options.translations || {};

        let csv = '';

        // إضافة العناوين
        if (includeHeaders) {
            const translatedHeaders = headers.map(header => 
                translations[header] || header
            );
            csv += translatedHeaders.map(header => this.escapeField(header)).join(delimiter) + '\n';
        }

        // إضافة البيانات
        data.forEach(row => {
            const values = headers.map(header => {
                let value = row[header];
                
                // معالجة القيم الخاصة
                if (value === null || value === undefined) {
                    value = '';
                } else if (typeof value === 'object') {
                    value = JSON.stringify(value);
                } else if (value instanceof Date) {
                    value = value.toLocaleString('ar-SA');
                }
                
                return this.escapeField(String(value));
            });
            
            csv += values.join(delimiter) + '\n';
        });

        return csv;
    }

    // حماية الحقول التي تحتوي على فواصل أو علامات اقتباس
    escapeField(field) {
        if (field.includes(this.delimiter) || field.includes('"') || field.includes('\n')) {
            return '"' + field.replace(/"/g, '""') + '"';
        }
        return field;
    }

    // تصدير تقارير المرضى
    exportPatientReports(reports, options = {}) {
        const translations = {
            reportId: 'رقم التقرير',
            sessionId: 'رقم الجلسة',
            idNumber: 'رقم الهوية',
            examType: 'نوع الفحص',
            finishedAt: 'تاريخ الانتهاء',
            duration: 'مدة الفحص (دقيقة)',
            clinicsVisited: 'العيادات المزارة'
        };

        // إضافة معلومات إضافية للتقارير
        const enhancedReports = reports.map(report => ({
            ...report,
            finishedAt: new Date(report.finishedAt),
            examTypeArabic: this.getExamTypeArabic(report.examType),
            duration: this.calculateDuration(report)
        }));

        return this.convertToCSV(enhancedReports, {
            ...options,
            translations
        });
    }

    // تصدير بيانات العيادات
    exportClinicsData(clinics, options = {}) {
        const translations = {
            id: 'المعرف',
            name_ar: 'الاسم بالعربية',
            name_en: 'الاسم بالإنجليزية',
            floor: 'الطابق',
            requiresPIN: 'يتطلب رمز',
            dailyCode: 'الرمز اليومي',
            lastCodeUpdate: 'آخر تحديث للرمز'
        };

        return this.convertToCSV(clinics, {
            ...options,
            translations
        });
    }

    // تصدير إحصائيات الاستخدام
    exportUsageStats(sessions, options = {}) {
        const stats = this.calculateUsageStats(sessions);
        
        const translations = {
            date: 'التاريخ',
            totalSessions: 'إجمالي الجلسات',
            completedSessions: 'الجلسات المكتملة',
            averageDuration: 'متوسط المدة (دقيقة)',
            mostUsedExamType: 'نوع الفحص الأكثر استخداماً',
            peakHour: 'ساعة الذروة'
        };

        return this.convertToCSV(stats, {
            ...options,
            translations
        });
    }

    // حساب إحصائيات الاستخدام
    calculateUsageStats(sessions) {
        const dailyStats = {};

        sessions.forEach(session => {
            const date = new Date(session.createdAt).toDateString();
            
            if (!dailyStats[date]) {
                dailyStats[date] = {
                    date,
                    totalSessions: 0,
                    completedSessions: 0,
                    examTypes: {},
                    hours: {}
                };
            }

            dailyStats[date].totalSessions++;
            
            if (session.current >= session.route.length) {
                dailyStats[date].completedSessions++;
            }

            // إحصائيات نوع الفحص
            const examType = session.examType;
            dailyStats[date].examTypes[examType] = (dailyStats[date].examTypes[examType] || 0) + 1;

            // إحصائيات الساعات
            const hour = new Date(session.createdAt).getHours();
            dailyStats[date].hours[hour] = (dailyStats[date].hours[hour] || 0) + 1;
        });

        // تحويل إلى مصفوفة وإضافة المعلومات المحسوبة
        return Object.values(dailyStats).map(stat => ({
            ...stat,
            averageDuration: this.calculateAverageDuration(sessions, stat.date),
            mostUsedExamType: this.getMostUsed(stat.examTypes),
            peakHour: this.getMostUsed(stat.hours) + ':00'
        }));
    }

    getMostUsed(obj) {
        return Object.keys(obj).reduce((a, b) => obj[a] > obj[b] ? a : b, '');
    }

    calculateAverageDuration(sessions, date) {
        const dateSessions = sessions.filter(s => 
            new Date(s.createdAt).toDateString() === date
        );
        
        if (dateSessions.length === 0) return 0;
        
        const totalDuration = dateSessions.reduce((sum, session) => {
            return sum + this.calculateDuration(session);
        }, 0);
        
        return Math.round(totalDuration / dateSessions.length);
    }

    calculateDuration(session) {
        if (!session.createdAt) return 0;
        
        const start = new Date(session.createdAt);
        const end = session.finishedAt ? new Date(session.finishedAt) : new Date();
        
        return Math.round((end - start) / (1000 * 60)); // بالدقائق
    }

    getExamTypeArabic(examType) {
        const types = {
            'internal_external_courses': 'فحص الدورات الداخلية والخارجية',
            'recruitment_promotion_transfer_contract_renewal': 'فحص التجنيد والترفيع والنقل وتجديد العقد',
            'annual_flight_exam': 'فحص الطيران السنوي',
            'cooks_exam': 'فحص الطباخين',
            'female_exams': 'فحوصات النساء'
        };
        
        return types[examType] || examType;
    }

    // تنزيل ملف CSV
    downloadCSV(csvContent, filename = 'export.csv') {
        // إضافة BOM للدعم الصحيح للعربية في Excel
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { 
            type: 'text/csv;charset=utf-8;' 
        });
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    // تصدير شامل لجميع البيانات
    exportAllData() {
        const reports = JSON.parse(localStorage.getItem('reports') || '[]');
        const sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
        const clinics = JSON.parse(localStorage.getItem('clinics') || '[]');

        const timestamp = new Date().toISOString().split('T')[0];
        
        // تصدير التقارير
        const reportsCSV = this.exportPatientReports(reports);
        this.downloadCSV(reportsCSV, `تقارير_المرضى_${timestamp}.csv`);
        
        // تصدير العيادات
        const clinicsCSV = this.exportClinicsData(clinics);
        this.downloadCSV(clinicsCSV, `بيانات_العيادات_${timestamp}.csv`);
        
        // تصدير الإحصائيات
        const statsCSV = this.exportUsageStats(sessions);
        this.downloadCSV(statsCSV, `إحصائيات_الاستخدام_${timestamp}.csv`);
    }
}

// إنشاء مثيل عام
const csvExporter = new CSVExporter();

// تصدير للاستخدام في Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CSVExporter };
}
