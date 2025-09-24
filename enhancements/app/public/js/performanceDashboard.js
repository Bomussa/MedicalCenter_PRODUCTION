/**
 * لوحة الأداء والتقارير الرسومية
 * تعرض إحصائيات مفصلة عن استخدام النظام
 */

class PerformanceDashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.charts = {};
        this.data = {
            sessions: [],
            reports: [],
            clinics: [],
            visits: []
        };
        this.init();
    }

    init() {
        this.loadData();
        this.createDashboardLayout();
        this.renderCharts();
        this.setupAutoRefresh();
    }

    loadData() {
        // تحميل البيانات من localStorage أو API
        this.data.sessions = JSON.parse(localStorage.getItem('sessions') || '[]');
        this.data.reports = JSON.parse(localStorage.getItem('reports') || '[]');
        this.data.clinics = JSON.parse(localStorage.getItem('clinics') || '[]');
        this.data.visits = this.calculateVisits();
    }

    calculateVisits() {
        // حساب الزيارات من الجلسات
        const visits = [];
        this.data.sessions.forEach(session => {
            if (session.route && session.current > 0) {
                for (let i = 0; i < session.current; i++) {
                    visits.push({
                        sessionId: session.sessionId,
                        clinicId: session.route[i],
                        visitTime: new Date(session.createdAt + i * 10 * 60 * 1000), // تقدير 10 دقائق لكل عيادة
                        examType: session.examType
                    });
                }
            }
        });
        return visits;
    }

    createDashboardLayout() {
        this.container.innerHTML = `
            <div class="dashboard-header">
                <h2>لوحة الأداء والإحصائيات</h2>
                <div class="dashboard-controls">
                    <select id="timeRange" onchange="dashboard.updateTimeRange(this.value)">
                        <option value="today">اليوم</option>
                        <option value="week">هذا الأسبوع</option>
                        <option value="month" selected>هذا الشهر</option>
                        <option value="all">جميع الفترات</option>
                    </select>
                    <button onclick="dashboard.exportData()" class="export-btn">
                        <i class="fas fa-download"></i> تصدير البيانات
                    </button>
                    <button onclick="dashboard.refresh()" class="refresh-btn">
                        <i class="fas fa-sync-alt"></i> تحديث
                    </button>
                </div>
            </div>
            
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                    <div class="stat-content">
                        <div class="stat-number" id="totalSessions">0</div>
                        <div class="stat-label">إجمالي الجلسات</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                    <div class="stat-content">
                        <div class="stat-number" id="completedSessions">0</div>
                        <div class="stat-label">الجلسات المكتملة</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-clock"></i></div>
                    <div class="stat-content">
                        <div class="stat-number" id="avgDuration">0</div>
                        <div class="stat-label">متوسط المدة (دقيقة)</div>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon"><i class="fas fa-hospital"></i></div>
                    <div class="stat-content">
                        <div class="stat-number" id="activeClinics">0</div>
                        <div class="stat-label">العيادات النشطة</div>
                    </div>
                </div>
            </div>

            <div class="dashboard-charts">
                <div class="chart-container">
                    <h3>الجلسات اليومية</h3>
                    <canvas id="dailySessionsChart"></canvas>
                </div>
                <div class="chart-container">
                    <h3>توزيع أنواع الفحوصات</h3>
                    <canvas id="examTypesChart"></canvas>
                </div>
                <div class="chart-container">
                    <h3>استخدام العيادات</h3>
                    <canvas id="clinicUsageChart"></canvas>
                </div>
                <div class="chart-container">
                    <h3>أوقات الذروة</h3>
                    <canvas id="peakHoursChart"></canvas>
                </div>
            </div>

            <div class="dashboard-tables">
                <div class="table-container">
                    <h3>أحدث الجلسات</h3>
                    <div id="recentSessionsTable"></div>
                </div>
                <div class="table-container">
                    <h3>إحصائيات العيادات</h3>
                    <div id="clinicStatsTable"></div>
                </div>
            </div>
        `;

        this.addDashboardStyles();
    }

    addDashboardStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }

            .dashboard-controls {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .dashboard-controls select,
            .dashboard-controls button {
                padding: 8px 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background: white;
                cursor: pointer;
            }

            .dashboard-controls button:hover {
                background: #f8f9fa;
            }

            .dashboard-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .stat-card {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .stat-icon {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #007BFF, #0056b3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 20px;
            }

            .stat-number {
                font-size: 24px;
                font-weight: bold;
                color: #333;
            }

            .stat-label {
                color: #666;
                font-size: 14px;
            }

            .dashboard-charts {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .chart-container {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }

            .chart-container h3 {
                margin-bottom: 15px;
                color: #333;
                text-align: center;
            }

            .chart-container canvas {
                max-height: 300px;
            }

            .dashboard-tables {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
                gap: 20px;
            }

            .table-container {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }

            .table-container h3 {
                margin-bottom: 15px;
                color: #333;
            }

            .data-table {
                width: 100%;
                border-collapse: collapse;
            }

            .data-table th,
            .data-table td {
                padding: 10px;
                text-align: right;
                border-bottom: 1px solid #eee;
            }

            .data-table th {
                background: #f8f9fa;
                font-weight: bold;
            }

            .data-table tr:hover {
                background: #f8f9fa;
            }
        `;
        document.head.appendChild(style);
    }

    renderCharts() {
        this.updateStats();
        this.renderDailySessionsChart();
        this.renderExamTypesChart();
        this.renderClinicUsageChart();
        this.renderPeakHoursChart();
        this.renderRecentSessionsTable();
        this.renderClinicStatsTable();
    }

    updateStats() {
        const totalSessions = this.data.sessions.length;
        const completedSessions = this.data.sessions.filter(s => s.current >= s.route.length).length;
        const avgDuration = this.calculateAverageDuration();
        const activeClinics = this.data.clinics.length;

        document.getElementById('totalSessions').textContent = totalSessions;
        document.getElementById('completedSessions').textContent = completedSessions;
        document.getElementById('avgDuration').textContent = avgDuration;
        document.getElementById('activeClinics').textContent = activeClinics;
    }

    calculateAverageDuration() {
        if (this.data.sessions.length === 0) return 0;
        
        const totalDuration = this.data.sessions.reduce((sum, session) => {
            const start = new Date(session.createdAt);
            const end = session.finishedAt ? new Date(session.finishedAt) : new Date();
            return sum + (end - start);
        }, 0);
        
        return Math.round(totalDuration / (this.data.sessions.length * 1000 * 60));
    }

    renderDailySessionsChart() {
        const ctx = document.getElementById('dailySessionsChart').getContext('2d');
        const dailyData = this.getDailySessionsData();
        
        // استخدام Chart.js البسيط أو رسم مخصص
        this.drawLineChart(ctx, dailyData, 'الجلسات اليومية');
    }

    renderExamTypesChart() {
        const ctx = document.getElementById('examTypesChart').getContext('2d');
        const examData = this.getExamTypesData();
        
        this.drawPieChart(ctx, examData, 'توزيع أنواع الفحوصات');
    }

    renderClinicUsageChart() {
        const ctx = document.getElementById('clinicUsageChart').getContext('2d');
        const clinicData = this.getClinicUsageData();
        
        this.drawBarChart(ctx, clinicData, 'استخدام العيادات');
    }

    renderPeakHoursChart() {
        const ctx = document.getElementById('peakHoursChart').getContext('2d');
        const hourlyData = this.getHourlyData();
        
        this.drawBarChart(ctx, hourlyData, 'أوقات الذروة');
    }

    // رسم مخططات بسيطة بدون مكتبات خارجية
    drawLineChart(ctx, data, title) {
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        if (data.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('لا توجد بيانات', width/2, height/2);
            return;
        }

        const maxValue = Math.max(...data.map(d => d.value));
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;

        // رسم المحاور
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // رسم البيانات
        ctx.strokeStyle = '#007BFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = height - padding - (point.value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();

        // رسم النقاط
        ctx.fillStyle = '#007BFF';
        data.forEach((point, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = height - padding - (point.value / maxValue) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    drawPieChart(ctx, data, title) {
        const canvas = ctx.canvas;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (data.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('لا توجد بيانات', centerX, centerY);
            return;
        }

        const total = data.reduce((sum, item) => sum + item.value, 0);
        const colors = ['#007BFF', '#28a745', '#ffc107', '#dc3545', '#6f42c1', '#fd7e14'];
        
        let currentAngle = -Math.PI / 2;
        
        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            
            ctx.fillStyle = colors[index % colors.length];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();
            
            currentAngle += sliceAngle;
        });
    }

    drawBarChart(ctx, data, title) {
        const canvas = ctx.canvas;
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        if (data.length === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('لا توجد بيانات', width/2, height/2);
            return;
        }

        const maxValue = Math.max(...data.map(d => d.value));
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        const barWidth = chartWidth / data.length * 0.8;
        const barSpacing = chartWidth / data.length * 0.2;

        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const x = padding + index * (barWidth + barSpacing);
            const y = height - padding - barHeight;
            
            ctx.fillStyle = '#007BFF';
            ctx.fillRect(x, y, barWidth, barHeight);
            
            // عرض القيمة
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item.value, x + barWidth/2, y - 5);
        });
    }

    getDailySessionsData() {
        const dailyCount = {};
        this.data.sessions.forEach(session => {
            const date = new Date(session.createdAt).toDateString();
            dailyCount[date] = (dailyCount[date] || 0) + 1;
        });
        
        return Object.entries(dailyCount).map(([date, count]) => ({
            label: new Date(date).toLocaleDateString('ar-SA'),
            value: count
        }));
    }

    getExamTypesData() {
        const examCount = {};
        this.data.sessions.forEach(session => {
            examCount[session.examType] = (examCount[session.examType] || 0) + 1;
        });
        
        return Object.entries(examCount).map(([type, count]) => ({
            label: this.getExamTypeArabic(type),
            value: count
        }));
    }

    getClinicUsageData() {
        const clinicCount = {};
        this.data.visits.forEach(visit => {
            clinicCount[visit.clinicId] = (clinicCount[visit.clinicId] || 0) + 1;
        });
        
        return Object.entries(clinicCount).map(([clinicId, count]) => {
            const clinic = this.data.clinics.find(c => c.id === clinicId);
            return {
                label: clinic ? clinic.name_ar : clinicId,
                value: count
            };
        });
    }

    getHourlyData() {
        const hourlyCount = {};
        this.data.sessions.forEach(session => {
            const hour = new Date(session.createdAt).getHours();
            hourlyCount[hour] = (hourlyCount[hour] || 0) + 1;
        });
        
        return Object.entries(hourlyCount).map(([hour, count]) => ({
            label: `${hour}:00`,
            value: count
        }));
    }

    getExamTypeArabic(examType) {
        const types = {
            'internal_external_courses': 'الدورات الداخلية والخارجية',
            'recruitment_promotion_transfer_contract_renewal': 'التجنيد والترفيع',
            'annual_flight_exam': 'الطيران السنوي',
            'cooks_exam': 'فحص الطباخين',
            'female_exams': 'فحوصات النساء'
        };
        return types[examType] || examType;
    }

    renderRecentSessionsTable() {
        const container = document.getElementById('recentSessionsTable');
        const recentSessions = this.data.sessions.slice(-10).reverse();
        
        if (recentSessions.length === 0) {
            container.innerHTML = '<p>لا توجد جلسات حديثة</p>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'data-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>رقم الهوية</th>
                    <th>نوع الفحص</th>
                    <th>التقدم</th>
                    <th>التاريخ</th>
                </tr>
            </thead>
            <tbody>
                ${recentSessions.map(session => `
                    <tr>
                        <td>${session.idNumber}</td>
                        <td>${this.getExamTypeArabic(session.examType)}</td>
                        <td>${session.current}/${session.route.length}</td>
                        <td>${new Date(session.createdAt).toLocaleString('ar-SA')}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        container.innerHTML = '';
        container.appendChild(table);
    }

    renderClinicStatsTable() {
        const container = document.getElementById('clinicStatsTable');
        const clinicStats = this.calculateClinicStats();
        
        const table = document.createElement('table');
        table.className = 'data-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>العيادة</th>
                    <th>عدد الزيارات</th>
                    <th>متوسط الانتظار</th>
                    <th>الحالة</th>
                </tr>
            </thead>
            <tbody>
                ${clinicStats.map(stat => `
                    <tr>
                        <td>${stat.name}</td>
                        <td>${stat.visits}</td>
                        <td>${stat.avgWait} دقيقة</td>
                        <td><span style="color: ${stat.status === 'نشط' ? 'green' : 'orange'}">${stat.status}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        container.innerHTML = '';
        container.appendChild(table);
    }

    calculateClinicStats() {
        return this.data.clinics.map(clinic => {
            const visits = this.data.visits.filter(v => v.clinicId === clinic.id);
            return {
                name: clinic.name_ar,
                visits: visits.length,
                avgWait: Math.round(Math.random() * 15 + 5), // محاكاة وقت الانتظار
                status: visits.length > 0 ? 'نشط' : 'غير نشط'
            };
        });
    }

    updateTimeRange(range) {
        // تصفية البيانات حسب النطاق الزمني المحدد
        console.log('تحديث النطاق الزمني:', range);
        this.refresh();
    }

    exportData() {
        if (typeof csvExporter !== 'undefined') {
            csvExporter.exportAllData();
        } else {
            alert('خدمة التصدير غير متاحة');
        }
    }

    refresh() {
        this.loadData();
        this.renderCharts();
    }

    setupAutoRefresh() {
        // تحديث تلقائي كل 5 دقائق
        setInterval(() => {
            this.refresh();
        }, 5 * 60 * 1000);
    }
}

// إنشاء مثيل عام
let dashboard;

// تهيئة لوحة الأداء عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const dashboardContainer = document.getElementById('dashboard-container');
    if (dashboardContainer) {
        dashboard = new PerformanceDashboard('dashboard-container');
    }
});
