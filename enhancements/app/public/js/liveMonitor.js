/**
 * مكون المراقبة اللحظية
 * يعرض إحصائيات مباشرة عن النظام والمستخدمين النشطين
 */

class LiveMonitor {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = {
            activeUsers: 0,
            avgWaitTime: 0,
            totalSessions: 0,
            completedSessions: 0,
            systemStatus: 'healthy',
            lastUpdate: new Date()
        };
        this.updateInterval = null;
        this.isVisible = true;
        this.init();
    }

    init() {
        this.createMonitorLayout();
        this.startLiveUpdates();
        this.setupVisibilityHandler();
    }

    createMonitorLayout() {
        this.container.innerHTML = `
            <div class="live-monitor-container">
                <div class="monitor-header">
                    <h3><i class="fas fa-satellite-dish"></i> المراقبة اللحظية</h3>
                    <div class="monitor-controls">
                        <div class="status-indicator" id="connectionStatus">
                            <span class="status-dot status-connected"></span>
                            <span>متصل</span>
                        </div>
                        <button onclick="liveMonitor.toggleMonitoring()" id="toggleBtn" class="toggle-btn">
                            <i class="fas fa-pause"></i> إيقاف
                        </button>
                        <button onclick="liveMonitor.refresh()" class="refresh-btn">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>

                <div class="live-stats-grid">
                    <div class="live-stat-card primary">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" id="activeUsers">0</div>
                            <div class="stat-label">المستخدمون النشطون</div>
                            <div class="stat-change" id="usersChange">--</div>
                        </div>
                    </div>

                    <div class="live-stat-card warning">
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" id="avgWaitTime">0</div>
                            <div class="stat-label">متوسط الانتظار (دقيقة)</div>
                            <div class="stat-change" id="waitTimeChange">--</div>
                        </div>
                    </div>

                    <div class="live-stat-card success">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" id="completionRate">0%</div>
                            <div class="stat-label">معدل الإنجاز</div>
                            <div class="stat-change" id="completionChange">--</div>
                        </div>
                    </div>

                    <div class="live-stat-card info">
                        <div class="stat-icon">
                            <i class="fas fa-heartbeat"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number" id="systemHealth">100%</div>
                            <div class="stat-label">صحة النظام</div>
                            <div class="stat-change" id="healthChange">--</div>
                        </div>
                    </div>
                </div>

                <div class="live-charts">
                    <div class="chart-card">
                        <h4>نشاط المستخدمين (آخر 10 دقائق)</h4>
                        <div id="userActivityChart" class="mini-chart"></div>
                    </div>
                    <div class="chart-card">
                        <h4>أوقات الانتظار (آخر ساعة)</h4>
                        <div id="waitTimeChart" class="mini-chart"></div>
                    </div>
                </div>

                <div class="live-alerts" id="liveAlerts">
                    <!-- التنبيهات اللحظية ستظهر هنا -->
                </div>

                <div class="monitor-footer">
                    <div class="last-update">
                        آخر تحديث: <span id="lastUpdateTime">--</span>
                    </div>
                    <div class="update-frequency">
                        تحديث كل 5 ثوان
                    </div>
                </div>
            </div>
        `;

        this.addMonitorStyles();
    }

    addMonitorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .live-monitor-container {
                background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                border-radius: 15px;
                padding: 20px;
                margin: 20px 0;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                border: 1px solid #dee2e6;
            }

            .monitor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid #007BFF;
            }

            .monitor-header h3 {
                color: #007BFF;
                margin: 0;
                font-size: 24px;
                font-weight: bold;
            }

            .monitor-controls {
                display: flex;
                align-items: center;
                gap: 15px;
            }

            .status-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 500;
            }

            .status-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }

            .status-connected {
                background: #28a745;
            }

            .status-disconnected {
                background: #dc3545;
            }

            .status-warning {
                background: #ffc107;
            }

            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }

            .toggle-btn, .refresh-btn {
                padding: 8px 15px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 5px;
            }

            .toggle-btn {
                background: #dc3545;
                color: white;
            }

            .toggle-btn:hover {
                background: #c82333;
            }

            .toggle-btn.paused {
                background: #28a745;
            }

            .refresh-btn {
                background: #6c757d;
                color: white;
            }

            .refresh-btn:hover {
                background: #5a6268;
                transform: rotate(180deg);
            }

            .live-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }

            .live-stat-card {
                background: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 15px;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border-left: 4px solid;
            }

            .live-stat-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }

            .live-stat-card.primary {
                border-left-color: #007BFF;
            }

            .live-stat-card.success {
                border-left-color: #28a745;
            }

            .live-stat-card.warning {
                border-left-color: #ffc107;
            }

            .live-stat-card.info {
                border-left-color: #17a2b8;
            }

            .stat-icon {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                color: white;
            }

            .primary .stat-icon {
                background: linear-gradient(135deg, #007BFF, #0056b3);
            }

            .success .stat-icon {
                background: linear-gradient(135deg, #28a745, #1e7e34);
            }

            .warning .stat-icon {
                background: linear-gradient(135deg, #ffc107, #e0a800);
            }

            .info .stat-icon {
                background: linear-gradient(135deg, #17a2b8, #138496);
            }

            .stat-content {
                flex: 1;
            }

            .stat-number {
                font-size: 28px;
                font-weight: bold;
                color: #333;
                line-height: 1;
                margin-bottom: 5px;
            }

            .stat-label {
                color: #666;
                font-size: 14px;
                margin-bottom: 5px;
            }

            .stat-change {
                font-size: 12px;
                font-weight: 500;
                padding: 2px 8px;
                border-radius: 12px;
                display: inline-block;
            }

            .stat-change.positive {
                background: #d4edda;
                color: #155724;
            }

            .stat-change.negative {
                background: #f8d7da;
                color: #721c24;
            }

            .stat-change.neutral {
                background: #e2e3e5;
                color: #383d41;
            }

            .live-charts {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 25px;
            }

            .chart-card {
                background: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }

            .chart-card h4 {
                margin-bottom: 15px;
                color: #333;
                font-size: 16px;
            }

            .mini-chart {
                height: 120px;
                position: relative;
                background: #f8f9fa;
                border-radius: 8px;
                padding: 10px;
                display: flex;
                align-items: end;
                justify-content: space-between;
            }

            .live-alerts {
                background: white;
                border-radius: 12px;
                padding: 15px;
                margin-bottom: 20px;
                min-height: 60px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }

            .alert-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                margin-bottom: 10px;
                border-radius: 8px;
                font-size: 14px;
            }

            .alert-item.info {
                background: #d1ecf1;
                color: #0c5460;
            }

            .alert-item.warning {
                background: #fff3cd;
                color: #856404;
            }

            .alert-item.danger {
                background: #f8d7da;
                color: #721c24;
            }

            .monitor-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
                color: #666;
                padding-top: 15px;
                border-top: 1px solid #dee2e6;
            }

            /* أنماط الوضع الليلي */
            body.dark-theme .live-monitor-container {
                background: linear-gradient(135deg, #2a2a2a, #1e1e1e);
                border-color: #444;
            }

            body.dark-theme .live-stat-card,
            body.dark-theme .chart-card,
            body.dark-theme .live-alerts {
                background: #333;
                color: #e0e0e0;
            }

            body.dark-theme .stat-number {
                color: #f0f0f0;
            }

            body.dark-theme .stat-label {
                color: #ccc;
            }

            body.dark-theme .mini-chart {
                background: #2a2a2a;
            }
        `;
        document.head.appendChild(style);
    }

    async startLiveUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        // تحديث فوري
        await this.updateData();

        // تحديث كل 5 ثوان
        this.updateInterval = setInterval(async () => {
            if (this.isVisible) {
                await this.updateData();
            }
        }, 5000);
    }

    async updateData() {
        try {
            const response = await this.fetchLiveData();
            const previousData = { ...this.data };
            this.data = { ...response, lastUpdate: new Date() };
            
            this.updateDisplay();
            this.updateChanges(previousData);
            this.updateCharts();
            this.checkAlerts();
            this.updateConnectionStatus(true);
            
        } catch (error) {
            console.error('خطأ في تحديث البيانات اللحظية:', error);
            this.updateConnectionStatus(false);
        }
    }

    async fetchLiveData() {
        // محاكاة البيانات - في التطبيق الحقيقي ستأتي من API
        const baseUsers = 15;
        const variation = Math.floor(Math.random() * 10) - 5;
        
        return {
            activeUsers: Math.max(0, baseUsers + variation),
            avgWaitTime: Math.round((Math.random() * 20 + 5) * 10) / 10,
            totalSessions: 45 + Math.floor(Math.random() * 10),
            completedSessions: 38 + Math.floor(Math.random() * 7),
            systemStatus: Math.random() > 0.1 ? 'healthy' : 'warning',
            serverLoad: Math.round(Math.random() * 100),
            memoryUsage: Math.round(Math.random() * 80 + 20),
            responseTime: Math.round(Math.random() * 500 + 100)
        };
    }

    updateDisplay() {
        document.getElementById('activeUsers').textContent = this.data.activeUsers;
        document.getElementById('avgWaitTime').textContent = this.data.avgWaitTime;
        
        const completionRate = this.data.totalSessions > 0 
            ? Math.round((this.data.completedSessions / this.data.totalSessions) * 100)
            : 0;
        document.getElementById('completionRate').textContent = completionRate + '%';
        
        const systemHealth = this.data.systemStatus === 'healthy' ? 100 : 85;
        document.getElementById('systemHealth').textContent = systemHealth + '%';
        
        document.getElementById('lastUpdateTime').textContent = 
            this.data.lastUpdate.toLocaleTimeString('ar-SA');
    }

    updateChanges(previousData) {
        this.updateChangeIndicator('usersChange', this.data.activeUsers, previousData.activeUsers);
        this.updateChangeIndicator('waitTimeChange', this.data.avgWaitTime, previousData.avgWaitTime, true);
        
        const currentRate = this.data.totalSessions > 0 
            ? (this.data.completedSessions / this.data.totalSessions) * 100
            : 0;
        const previousRate = previousData.totalSessions > 0 
            ? (previousData.completedSessions / previousData.totalSessions) * 100
            : 0;
        this.updateChangeIndicator('completionChange', currentRate, previousRate);
    }

    updateChangeIndicator(elementId, current, previous, inverse = false) {
        const element = document.getElementById(elementId);
        if (!element || previous === undefined) return;

        const change = current - previous;
        const isPositive = inverse ? change < 0 : change > 0;
        const isNegative = inverse ? change > 0 : change < 0;

        if (Math.abs(change) < 0.1) {
            element.textContent = 'مستقر';
            element.className = 'stat-change neutral';
        } else if (isPositive) {
            element.textContent = `+${Math.abs(change).toFixed(1)}`;
            element.className = 'stat-change positive';
        } else if (isNegative) {
            element.textContent = `-${Math.abs(change).toFixed(1)}`;
            element.className = 'stat-change negative';
        }
    }

    updateCharts() {
        this.updateUserActivityChart();
        this.updateWaitTimeChart();
    }

    updateUserActivityChart() {
        const container = document.getElementById('userActivityChart');
        
        // محاكاة بيانات النشاط
        const activityData = Array.from({ length: 10 }, (_, i) => ({
            time: new Date(Date.now() - (9 - i) * 60000).toLocaleTimeString('ar-SA', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            users: Math.floor(Math.random() * 20 + 5)
        }));

        const maxUsers = Math.max(...activityData.map(d => d.users));
        
        container.innerHTML = activityData.map(data => `
            <div style="
                width: 8%;
                height: ${(data.users / maxUsers) * 80}%;
                background: linear-gradient(to top, #007BFF, #0056b3);
                border-radius: 2px;
                position: relative;
                display: flex;
                align-items: end;
                justify-content: center;
            ">
                <span style="
                    position: absolute;
                    bottom: -20px;
                    font-size: 10px;
                    color: #666;
                    transform: rotate(-45deg);
                    white-space: nowrap;
                ">${data.time}</span>
            </div>
        `).join('');
    }

    updateWaitTimeChart() {
        const container = document.getElementById('waitTimeChart');
        
        // محاكاة بيانات أوقات الانتظار
        const waitData = Array.from({ length: 12 }, (_, i) => ({
            hour: new Date(Date.now() - (11 - i) * 5 * 60000).toLocaleTimeString('ar-SA', { 
                hour: '2-digit', 
                minute: '2-digit' 
            }),
            waitTime: Math.floor(Math.random() * 25 + 5)
        }));

        const maxWait = Math.max(...waitData.map(d => d.waitTime));
        
        container.innerHTML = waitData.map(data => `
            <div style="
                width: 7%;
                height: ${(data.waitTime / maxWait) * 80}%;
                background: linear-gradient(to top, #ffc107, #e0a800);
                border-radius: 2px;
                position: relative;
                display: flex;
                align-items: end;
                justify-content: center;
            ">
                <span style="
                    position: absolute;
                    bottom: -20px;
                    font-size: 9px;
                    color: #666;
                    transform: rotate(-45deg);
                    white-space: nowrap;
                ">${data.hour}</span>
            </div>
        `).join('');
    }

    checkAlerts() {
        const alertsContainer = document.getElementById('liveAlerts');
        const alerts = [];

        // فحص التنبيهات
        if (this.data.activeUsers > 20) {
            alerts.push({
                type: 'warning',
                icon: 'fas fa-exclamation-triangle',
                message: `عدد كبير من المستخدمين النشطين: ${this.data.activeUsers}`
            });
        }

        if (this.data.avgWaitTime > 15) {
            alerts.push({
                type: 'danger',
                icon: 'fas fa-clock',
                message: `وقت انتظار مرتفع: ${this.data.avgWaitTime} دقيقة`
            });
        }

        if (this.data.systemStatus !== 'healthy') {
            alerts.push({
                type: 'warning',
                icon: 'fas fa-heartbeat',
                message: 'تحذير: حالة النظام تحتاج مراقبة'
            });
        }

        if (alerts.length === 0) {
            alertsContainer.innerHTML = `
                <div class="alert-item info">
                    <i class="fas fa-check-circle"></i>
                    <span>جميع الأنظمة تعمل بشكل طبيعي</span>
                </div>
            `;
        } else {
            alertsContainer.innerHTML = alerts.map(alert => `
                <div class="alert-item ${alert.type}">
                    <i class="${alert.icon}"></i>
                    <span>${alert.message}</span>
                </div>
            `).join('');
        }
    }

    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connectionStatus');
        const dot = statusElement.querySelector('.status-dot');
        const text = statusElement.querySelector('span');

        if (connected) {
            dot.className = 'status-dot status-connected';
            text.textContent = 'متصل';
        } else {
            dot.className = 'status-dot status-disconnected';
            text.textContent = 'منقطع';
        }
    }

    toggleMonitoring() {
        const button = document.getElementById('toggleBtn');
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
            button.innerHTML = '<i class="fas fa-play"></i> تشغيل';
            button.className = 'toggle-btn paused';
        } else {
            this.startLiveUpdates();
            button.innerHTML = '<i class="fas fa-pause"></i> إيقاف';
            button.className = 'toggle-btn';
        }
    }

    refresh() {
        this.updateData();
    }

    setupVisibilityHandler() {
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
        });
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// إنشاء مثيل عام
let liveMonitor;

// تهيئة المراقبة اللحظية عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const monitorContainer = document.getElementById('live-monitor');
    if (monitorContainer) {
        liveMonitor = new LiveMonitor('live-monitor');
    }
});
