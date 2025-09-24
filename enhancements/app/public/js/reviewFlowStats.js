/**
 * مكون تحليل حركة المراجعين
 * يعرض إحصائيات مفصلة عن حركة المراجعين في العيادات
 */

class ReviewFlowStats {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.stats = [];
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.createStatsLayout();
        this.loadStats();
        this.setupAutoRefresh();
    }

    createStatsLayout() {
        this.container.innerHTML = `
            <div class="review-flow-container">
                <div class="stats-header">
                    <h3><i class="fas fa-chart-line"></i> تحليل حركة المراجعين</h3>
                    <div class="stats-controls">
                        <select id="timeFilter" onchange="reviewFlowStats.updateTimeFilter(this.value)">
                            <option value="today">اليوم</option>
                            <option value="week">هذا الأسبوع</option>
                            <option value="month">هذا الشهر</option>
                        </select>
                        <button onclick="reviewFlowStats.refresh()" class="refresh-btn">
                            <i class="fas fa-sync-alt"></i> تحديث
                        </button>
                    </div>
                </div>

                <div class="stats-summary">
                    <div class="summary-card">
                        <div class="summary-icon"><i class="fas fa-users"></i></div>
                        <div class="summary-content">
                            <div class="summary-number" id="totalReviewers">0</div>
                            <div class="summary-label">إجمالي المراجعين</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon"><i class="fas fa-clock"></i></div>
                        <div class="summary-content">
                            <div class="summary-number" id="avgWaitTime">0</div>
                            <div class="summary-label">متوسط الانتظار (دقيقة)</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon"><i class="fas fa-hospital"></i></div>
                        <div class="summary-content">
                            <div class="summary-number" id="activeClinics">0</div>
                            <div class="summary-label">العيادات النشطة</div>
                        </div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-icon"><i class="fas fa-chart-bar"></i></div>
                        <div class="summary-content">
                            <div class="summary-number" id="peakHour">--</div>
                            <div class="summary-label">ساعة الذروة</div>
                        </div>
                    </div>
                </div>

                <div class="stats-charts">
                    <div class="chart-section">
                        <h4>توزيع المراجعين حسب العيادة</h4>
                        <div id="clinicDistributionChart" class="chart-container"></div>
                    </div>
                    <div class="chart-section">
                        <h4>حركة المراجعين خلال اليوم</h4>
                        <div id="hourlyFlowChart" class="chart-container"></div>
                    </div>
                </div>

                <div class="stats-tables">
                    <div class="table-section">
                        <h4>تفاصيل العيادات</h4>
                        <div id="clinicDetailsTable"></div>
                    </div>
                    <div class="table-section">
                        <h4>أوقات الذروة</h4>
                        <div id="peakTimesTable"></div>
                    </div>
                </div>
            </div>
        `;

        this.addStatsStyles();
    }

    addStatsStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .review-flow-container {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
            }

            .stats-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 2px solid #007BFF;
            }

            .stats-header h3 {
                color: #007BFF;
                margin: 0;
                font-size: 24px;
            }

            .stats-controls {
                display: flex;
                gap: 10px;
                align-items: center;
            }

            .stats-controls select,
            .stats-controls button {
                padding: 8px 15px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background: white;
                cursor: pointer;
            }

            .stats-summary {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
            }

            .summary-card {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 15px;
                transition: transform 0.2s ease;
            }

            .summary-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            }

            .summary-icon {
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

            .summary-number {
                font-size: 28px;
                font-weight: bold;
                color: #333;
                line-height: 1;
            }

            .summary-label {
                color: #666;
                font-size: 14px;
                margin-top: 5px;
            }

            .stats-charts {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .chart-section {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }

            .chart-section h4 {
                margin-bottom: 15px;
                color: #333;
                text-align: center;
            }

            .chart-container {
                height: 250px;
                position: relative;
            }

            .stats-tables {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 20px;
            }

            .table-section {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }

            .table-section h4 {
                margin-bottom: 15px;
                color: #333;
            }

            .stats-table {
                width: 100%;
                border-collapse: collapse;
            }

            .stats-table th,
            .stats-table td {
                padding: 12px;
                text-align: right;
                border-bottom: 1px solid #eee;
            }

            .stats-table th {
                background: #f8f9fa;
                font-weight: bold;
                color: #333;
            }

            .stats-table tr:hover {
                background: #f8f9fa;
            }

            .status-indicator {
                display: inline-block;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                margin-left: 8px;
            }

            .status-active {
                background: #28a745;
            }

            .status-busy {
                background: #ffc107;
            }

            .status-inactive {
                background: #dc3545;
            }

            .progress-bar {
                width: 100%;
                height: 8px;
                background: #e9ecef;
                border-radius: 4px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #007BFF, #0056b3);
                transition: width 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    async loadStats() {
        try {
            // محاكاة تحميل البيانات من API
            const response = await this.fetchStatsData();
            this.stats = response;
            this.updateSummary();
            this.renderCharts();
            this.renderTables();
        } catch (error) {
            console.error('خطأ في تحميل إحصائيات حركة المراجعين:', error);
        }
    }

    async fetchStatsData() {
        // محاكاة البيانات - في التطبيق الحقيقي ستأتي من API
        return {
            totalReviewers: 156,
            avgWaitTime: 12.5,
            activeClinics: 8,
            peakHour: '10:00',
            clinicDistribution: [
                { name: 'عيادة العيون', count: 25, waitTime: 8, status: 'active' },
                { name: 'عيادة الأنف والأذن', count: 18, waitTime: 15, status: 'busy' },
                { name: 'عيادة الأسنان', count: 22, waitTime: 10, status: 'active' },
                { name: 'عيادة الجلدية', count: 12, waitTime: 20, status: 'busy' },
                { name: 'المختبر', count: 35, waitTime: 5, status: 'active' },
                { name: 'الأشعة', count: 28, waitTime: 12, status: 'active' },
                { name: 'عيادة القلب', count: 16, waitTime: 18, status: 'busy' }
            ],
            hourlyFlow: [
                { hour: '08:00', count: 8 },
                { hour: '09:00', count: 15 },
                { hour: '10:00', count: 25 },
                { hour: '11:00', count: 22 },
                { hour: '12:00', count: 18 },
                { hour: '13:00', count: 12 },
                { hour: '14:00', count: 20 },
                { hour: '15:00', count: 16 }
            ],
            peakTimes: [
                { time: '10:00 - 11:00', count: 47, percentage: 85 },
                { time: '09:00 - 10:00', count: 40, percentage: 72 },
                { time: '14:00 - 15:00', count: 36, percentage: 65 },
                { time: '11:00 - 12:00', count: 34, percentage: 61 }
            ]
        };
    }

    updateSummary() {
        document.getElementById('totalReviewers').textContent = this.stats.totalReviewers;
        document.getElementById('avgWaitTime').textContent = this.stats.avgWaitTime;
        document.getElementById('activeClinics').textContent = this.stats.activeClinics;
        document.getElementById('peakHour').textContent = this.stats.peakHour;
    }

    renderCharts() {
        this.renderClinicDistributionChart();
        this.renderHourlyFlowChart();
    }

    renderClinicDistributionChart() {
        const container = document.getElementById('clinicDistributionChart');
        const data = this.stats.clinicDistribution;
        
        if (data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">لا توجد بيانات</p>';
            return;
        }

        const maxCount = Math.max(...data.map(d => d.count));
        
        container.innerHTML = data.map(clinic => `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <span style="font-weight: bold;">${clinic.name}</span>
                    <span style="color: #666;">${clinic.count} مراجع</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(clinic.count / maxCount) * 100}%"></div>
                </div>
                <div style="font-size: 12px; color: #666; margin-top: 3px;">
                    متوسط الانتظار: ${clinic.waitTime} دقيقة
                    <span class="status-indicator status-${clinic.status}"></span>
                </div>
            </div>
        `).join('');
    }

    renderHourlyFlowChart() {
        const container = document.getElementById('hourlyFlowChart');
        const data = this.stats.hourlyFlow;
        
        if (data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666;">لا توجد بيانات</p>';
            return;
        }

        const maxCount = Math.max(...data.map(d => d.count));
        
        container.innerHTML = `
            <div style="display: flex; align-items: end; justify-content: space-between; height: 200px; padding: 20px 0;">
                ${data.map(hour => `
                    <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                        <div style="
                            width: 30px;
                            height: ${(hour.count / maxCount) * 150}px;
                            background: linear-gradient(to top, #007BFF, #0056b3);
                            border-radius: 4px 4px 0 0;
                            margin-bottom: 10px;
                            position: relative;
                        ">
                            <span style="
                                position: absolute;
                                top: -20px;
                                left: 50%;
                                transform: translateX(-50%);
                                font-size: 12px;
                                font-weight: bold;
                                color: #333;
                            ">${hour.count}</span>
                        </div>
                        <span style="font-size: 12px; color: #666;">${hour.hour}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderTables() {
        this.renderClinicDetailsTable();
        this.renderPeakTimesTable();
    }

    renderClinicDetailsTable() {
        const container = document.getElementById('clinicDetailsTable');
        const data = this.stats.clinicDistribution;
        
        const table = document.createElement('table');
        table.className = 'stats-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>العيادة</th>
                    <th>عدد المراجعين</th>
                    <th>متوسط الانتظار</th>
                    <th>الحالة</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(clinic => `
                    <tr>
                        <td>${clinic.name}</td>
                        <td>${clinic.count}</td>
                        <td>${clinic.waitTime} دقيقة</td>
                        <td>
                            <span class="status-indicator status-${clinic.status}"></span>
                            ${this.getStatusText(clinic.status)}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        container.innerHTML = '';
        container.appendChild(table);
    }

    renderPeakTimesTable() {
        const container = document.getElementById('peakTimesTable');
        const data = this.stats.peakTimes;
        
        const table = document.createElement('table');
        table.className = 'stats-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>الفترة الزمنية</th>
                    <th>عدد المراجعين</th>
                    <th>نسبة الازدحام</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(peak => `
                    <tr>
                        <td>${peak.time}</td>
                        <td>${peak.count}</td>
                        <td>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div class="progress-bar" style="width: 60px;">
                                    <div class="progress-fill" style="width: ${peak.percentage}%"></div>
                                </div>
                                <span>${peak.percentage}%</span>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;
        
        container.innerHTML = '';
        container.appendChild(table);
    }

    getStatusText(status) {
        const statusMap = {
            'active': 'نشط',
            'busy': 'مزدحم',
            'inactive': 'غير نشط'
        };
        return statusMap[status] || status;
    }

    updateTimeFilter(timeRange) {
        console.log('تحديث الفترة الزمنية:', timeRange);
        this.loadStats(); // إعادة تحميل البيانات حسب الفترة الجديدة
    }

    refresh() {
        this.loadStats();
    }

    setupAutoRefresh() {
        // تحديث تلقائي كل 30 ثانية
        this.refreshInterval = setInterval(() => {
            this.loadStats();
        }, 30000);
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// إنشاء مثيل عام
let reviewFlowStats;

// تهيئة مكون تحليل حركة المراجعين عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const statsContainer = document.getElementById('review-flow-stats');
    if (statsContainer) {
        reviewFlowStats = new ReviewFlowStats('review-flow-stats');
    }
});
