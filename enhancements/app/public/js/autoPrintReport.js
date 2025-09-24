/**
 * مكون الطباعة التلقائية للتقارير
 * يتعامل مع طباعة التقارير تلقائياً عند اكتمال الفحص
 */

class AutoPrintReport {
    constructor() {
        this.printQueue = [];
        this.isPrinting = false;
        this.settings = {
            autoPrint: true,
            printDelay: 2000, // تأخير 2 ثانية قبل الطباعة
            showPreview: true,
            printCopies: 1,
            paperSize: 'A4',
            orientation: 'portrait'
        };
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupPrintStyles();
        this.createPrintInterface();
        this.setupEventListeners();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('autoPrintSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
    }

    saveSettings() {
        localStorage.setItem('autoPrintSettings', JSON.stringify(this.settings));
    }

    setupPrintStyles() {
        const printStyle = document.createElement('style');
        printStyle.id = 'auto-print-styles';
        printStyle.textContent = `
            @media print {
                /* إخفاء العناصر غير المرغوب فيها في الطباعة */
                .no-print,
                .print-controls,
                .navigation,
                header,
                footer,
                .sidebar {
                    display: none !important;
                }

                /* تنسيق التقرير للطباعة */
                .report-container {
                    width: 100% !important;
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 20px !important;
                    box-shadow: none !important;
                    border: none !important;
                    background: white !important;
                    color: black !important;
                }

                .report-header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #000;
                    padding-bottom: 20px;
                }

                .report-logo {
                    max-width: 150px;
                    height: auto;
                    margin-bottom: 15px;
                }

                .report-title {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #000 !important;
                }

                .report-subtitle {
                    font-size: 16px;
                    color: #666 !important;
                }

                .patient-info {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 30px;
                    padding: 15px;
                    border: 1px solid #ddd;
                    background: #f9f9f9;
                }

                .info-item {
                    display: flex;
                    justify-content: space-between;
                    padding: 5px 0;
                    border-bottom: 1px dotted #ccc;
                }

                .info-label {
                    font-weight: bold;
                    color: #333 !important;
                }

                .info-value {
                    color: #000 !important;
                }

                .exam-results {
                    margin-bottom: 30px;
                }

                .clinic-result {
                    margin-bottom: 20px;
                    padding: 15px;
                    border: 1px solid #ddd;
                    page-break-inside: avoid;
                }

                .clinic-name {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #000 !important;
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 5px;
                }

                .clinic-status {
                    font-size: 14px;
                    padding: 5px 10px;
                    border-radius: 3px;
                    display: inline-block;
                    margin-bottom: 10px;
                }

                .status-completed {
                    background: #d4edda !important;
                    color: #155724 !important;
                    border: 1px solid #c3e6cb;
                }

                .status-pending {
                    background: #fff3cd !important;
                    color: #856404 !important;
                    border: 1px solid #ffeaa7;
                }

                .report-footer {
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #000;
                    text-align: center;
                }

                .signature-section {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 40px;
                    margin-top: 30px;
                }

                .signature-box {
                    text-align: center;
                    padding: 20px 0;
                    border-top: 1px solid #000;
                }

                .signature-label {
                    font-weight: bold;
                    margin-top: 10px;
                    color: #000 !important;
                }

                /* فواصل الصفحات */
                .page-break {
                    page-break-before: always;
                }

                /* تنسيق الجداول */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }

                th, td {
                    border: 1px solid #000;
                    padding: 8px;
                    text-align: right;
                }

                th {
                    background: #f0f0f0 !important;
                    font-weight: bold;
                }

                /* تنسيق التواريخ والأوقات */
                .timestamp {
                    font-size: 12px;
                    color: #666 !important;
                }

                /* QR Code للتحقق */
                .qr-code {
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    width: 80px;
                    height: 80px;
                }
            }

            /* أنماط واجهة التحكم بالطباعة */
            .print-interface {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000;
                min-width: 400px;
                max-width: 500px;
            }

            .print-interface h3 {
                margin-bottom: 20px;
                color: #333;
                text-align: center;
            }

            .print-settings {
                margin-bottom: 25px;
            }

            .setting-group {
                margin-bottom: 15px;
            }

            .setting-label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #555;
            }

            .setting-control {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 5px;
                font-size: 14px;
            }

            .checkbox-group {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .print-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
            }

            .print-btn {
                padding: 12px 25px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s ease;
            }

            .print-btn.primary {
                background: #007BFF;
                color: white;
            }

            .print-btn.primary:hover {
                background: #0056b3;
            }

            .print-btn.secondary {
                background: #6c757d;
                color: white;
            }

            .print-btn.secondary:hover {
                background: #5a6268;
            }

            .print-btn.success {
                background: #28a745;
                color: white;
            }

            .print-btn.success:hover {
                background: #1e7e34;
            }

            .print-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
            }

            .print-progress {
                text-align: center;
                padding: 20px;
            }

            .print-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #007BFF;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(printStyle);
    }

    createPrintInterface() {
        // إنشاء واجهة التحكم بالطباعة
        const interfaceHTML = `
            <div id="printOverlay" class="print-overlay" style="display: none;">
                <div class="print-interface">
                    <h3><i class="fas fa-print"></i> إعدادات الطباعة</h3>
                    
                    <div class="print-settings">
                        <div class="setting-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="autoPrintEnabled" ${this.settings.autoPrint ? 'checked' : ''}>
                                <label for="autoPrintEnabled" class="setting-label">تفعيل الطباعة التلقائية</label>
                            </div>
                        </div>

                        <div class="setting-group">
                            <label for="printDelay" class="setting-label">تأخير الطباعة (ثانية)</label>
                            <input type="number" id="printDelay" class="setting-control" 
                                   value="${this.settings.printDelay / 1000}" min="0" max="10">
                        </div>

                        <div class="setting-group">
                            <label for="printCopies" class="setting-label">عدد النسخ</label>
                            <input type="number" id="printCopies" class="setting-control" 
                                   value="${this.settings.printCopies}" min="1" max="5">
                        </div>

                        <div class="setting-group">
                            <label for="paperSize" class="setting-label">حجم الورق</label>
                            <select id="paperSize" class="setting-control">
                                <option value="A4" ${this.settings.paperSize === 'A4' ? 'selected' : ''}>A4</option>
                                <option value="A3" ${this.settings.paperSize === 'A3' ? 'selected' : ''}>A3</option>
                                <option value="Letter" ${this.settings.paperSize === 'Letter' ? 'selected' : ''}>Letter</option>
                            </select>
                        </div>

                        <div class="setting-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="showPreview" ${this.settings.showPreview ? 'checked' : ''}>
                                <label for="showPreview" class="setting-label">عرض معاينة قبل الطباعة</label>
                            </div>
                        </div>
                    </div>

                    <div class="print-buttons">
                        <button class="print-btn primary" onclick="autoPrintReport.printNow()">
                            <i class="fas fa-print"></i> طباعة الآن
                        </button>
                        <button class="print-btn secondary" onclick="autoPrintReport.showPreview()">
                            <i class="fas fa-eye"></i> معاينة
                        </button>
                        <button class="print-btn secondary" onclick="autoPrintReport.closeInterface()">
                            <i class="fas fa-times"></i> إلغاء
                        </button>
                    </div>
                </div>
            </div>

            <div id="printProgress" class="print-overlay" style="display: none;">
                <div class="print-interface">
                    <div class="print-progress">
                        <div class="print-spinner"></div>
                        <h3>جاري التحضير للطباعة...</h3>
                        <p>يرجى الانتظار</p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', interfaceHTML);
    }

    setupEventListeners() {
        // مراقبة تغيير الإعدادات
        document.getElementById('autoPrintEnabled').addEventListener('change', (e) => {
            this.settings.autoPrint = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('printDelay').addEventListener('change', (e) => {
            this.settings.printDelay = parseInt(e.target.value) * 1000;
            this.saveSettings();
        });

        document.getElementById('printCopies').addEventListener('change', (e) => {
            this.settings.printCopies = parseInt(e.target.value);
            this.saveSettings();
        });

        document.getElementById('paperSize').addEventListener('change', (e) => {
            this.settings.paperSize = e.target.value;
            this.saveSettings();
        });

        document.getElementById('showPreview').addEventListener('change', (e) => {
            this.settings.showPreview = e.target.checked;
            this.saveSettings();
        });

        // مراقبة اكتمال التقارير
        document.addEventListener('reportReady', (event) => {
            this.handleReportReady(event.detail);
        });

        // مراقبة اختصارات لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                this.showPrintInterface();
            }
        });
    }

    handleReportReady(reportData) {
        if (this.settings.autoPrint) {
            this.queueReport(reportData);
        }
    }

    queueReport(reportData) {
        this.printQueue.push(reportData);
        
        if (!this.isPrinting) {
            this.processQueue();
        }
    }

    async processQueue() {
        if (this.printQueue.length === 0) {
            this.isPrinting = false;
            return;
        }

        this.isPrinting = true;
        const reportData = this.printQueue.shift();

        try {
            await this.prepareReport(reportData);
            
            if (this.settings.showPreview) {
                this.showPrintInterface();
            } else {
                await this.executePrint();
            }
        } catch (error) {
            console.error('خطأ في طباعة التقرير:', error);
            this.showError('فشل في طباعة التقرير');
        }

        // معالجة التقرير التالي
        setTimeout(() => this.processQueue(), 1000);
    }

    async prepareReport(reportData) {
        // تحضير التقرير للطباعة
        const reportContainer = document.querySelector('.report-container') || 
                               document.getElementById('doneCard') ||
                               document.body;

        // إضافة معلومات إضافية للطباعة
        this.addPrintMetadata(reportContainer, reportData);
        
        // تحسين تنسيق التقرير
        this.optimizeForPrint(reportContainer);
        
        // إضافة QR Code للتحقق
        await this.addQRCode(reportContainer, reportData);
    }

    addPrintMetadata(container, reportData) {
        const metadata = document.createElement('div');
        metadata.className = 'print-metadata no-print';
        metadata.innerHTML = `
            <div class="report-header">
                <img src="/logo.png" alt="شعار المركز" class="report-logo">
                <h1 class="report-title">تقرير فحص طبي</h1>
                <p class="report-subtitle">المركز الطبي العسكري المتقدم</p>
            </div>
            
            <div class="patient-info">
                <div class="info-item">
                    <span class="info-label">رقم الهوية:</span>
                    <span class="info-value">${reportData.idNumber || 'غير محدد'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">نوع الفحص:</span>
                    <span class="info-value">${reportData.examType || 'غير محدد'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">تاريخ الفحص:</span>
                    <span class="info-value">${new Date().toLocaleDateString('ar-SA')}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">وقت الفحص:</span>
                    <span class="info-value">${new Date().toLocaleTimeString('ar-SA')}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">رقم التقرير:</span>
                    <span class="info-value">${reportData.reportId || 'غير محدد'}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">حالة الفحص:</span>
                    <span class="info-value">مكتمل</span>
                </div>
            </div>
        `;
        
        container.insertBefore(metadata, container.firstChild);
    }

    optimizeForPrint(container) {
        // إضافة كلاسات للطباعة
        container.classList.add('report-container');
        
        // إخفاء العناصر غير المرغوب فيها
        const elementsToHide = container.querySelectorAll('button, .navigation, .controls');
        elementsToHide.forEach(el => el.classList.add('no-print'));
        
        // تحسين الجداول
        const tables = container.querySelectorAll('table');
        tables.forEach(table => {
            table.style.pageBreakInside = 'avoid';
        });
    }

    async addQRCode(container, reportData) {
        try {
            // إنشاء QR Code للتحقق من التقرير
            const qrData = JSON.stringify({
                reportId: reportData.reportId,
                idNumber: reportData.idNumber,
                timestamp: Date.now()
            });
            
            // يمكن استخدام مكتبة QR Code هنا
            const qrContainer = document.createElement('div');
            qrContainer.className = 'qr-code';
            qrContainer.innerHTML = `
                <div style="border: 1px solid #000; padding: 5px; text-align: center;">
                    <div style="font-size: 10px; margin-bottom: 5px;">رمز التحقق</div>
                    <div style="width: 60px; height: 60px; background: #f0f0f0; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 8px;">
                        QR
                    </div>
                </div>
            `;
            
            container.appendChild(qrContainer);
        } catch (error) {
            console.warn('فشل في إضافة QR Code:', error);
        }
    }

    showPrintInterface() {
        document.getElementById('printOverlay').style.display = 'block';
    }

    closeInterface() {
        document.getElementById('printOverlay').style.display = 'none';
    }

    showProgress() {
        document.getElementById('printProgress').style.display = 'block';
    }

    hideProgress() {
        document.getElementById('printProgress').style.display = 'none';
    }

    async printNow() {
        this.closeInterface();
        this.showProgress();
        
        try {
            await new Promise(resolve => setTimeout(resolve, this.settings.printDelay));
            await this.executePrint();
        } catch (error) {
            this.showError('فشل في الطباعة');
        } finally {
            this.hideProgress();
        }
    }

    async executePrint() {
        return new Promise((resolve, reject) => {
            try {
                // تطبيق إعدادات الطباعة
                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html dir="rtl" lang="ar">
                    <head>
                        <meta charset="UTF-8">
                        <title>تقرير فحص طبي</title>
                        <style>
                            ${document.getElementById('auto-print-styles').textContent}
                        </style>
                    </head>
                    <body>
                        ${document.querySelector('.report-container').outerHTML}
                    </body>
                    </html>
                `);
                
                printWindow.document.close();
                
                printWindow.onload = () => {
                    printWindow.focus();
                    printWindow.print();
                    
                    // إغلاق النافذة بعد الطباعة
                    setTimeout(() => {
                        printWindow.close();
                        resolve();
                    }, 1000);
                };
                
                printWindow.onerror = () => {
                    reject(new Error('فشل في فتح نافذة الطباعة'));
                };
                
            } catch (error) {
                reject(error);
            }
        });
    }

    showPreview() {
        const previewWindow = window.open('', '_blank', 'width=800,height=600');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <meta charset="UTF-8">
                <title>معاينة التقرير</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .preview-header { text-align: center; margin-bottom: 20px; }
                    .preview-actions { text-align: center; margin: 20px 0; }
                    .preview-btn { padding: 10px 20px; margin: 0 10px; cursor: pointer; }
                    ${document.getElementById('auto-print-styles').textContent}
                </style>
            </head>
            <body>
                <div class="preview-header">
                    <h2>معاينة التقرير</h2>
                    <div class="preview-actions">
                        <button class="preview-btn" onclick="window.print()">طباعة</button>
                        <button class="preview-btn" onclick="window.close()">إغلاق</button>
                    </div>
                </div>
                ${document.querySelector('.report-container').outerHTML}
            </body>
            </html>
        `);
        previewWindow.document.close();
    }

    showError(message) {
        if (typeof notificationService !== 'undefined') {
            notificationService.sendNotification(
                'خطأ في الطباعة',
                message,
                { type: 'error', requireInteraction: true }
            );
        } else {
            alert(message);
        }
    }

    // تشغيل الطباعة التلقائية عند اكتمال التقرير
    triggerAutoPrint(reportData) {
        const event = new CustomEvent('reportReady', { detail: reportData });
        document.dispatchEvent(event);
    }

    // إعدادات سريعة
    enableAutoPrint() {
        this.settings.autoPrint = true;
        this.saveSettings();
    }

    disableAutoPrint() {
        this.settings.autoPrint = false;
        this.saveSettings();
    }

    setDelay(seconds) {
        this.settings.printDelay = seconds * 1000;
        this.saveSettings();
    }
}

// إنشاء مثيل عام
const autoPrintReport = new AutoPrintReport();

// تصدير للاستخدام في أجزاء أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AutoPrintReport };
}
