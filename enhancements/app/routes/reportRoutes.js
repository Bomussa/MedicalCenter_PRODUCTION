import express from 'express';
import { readJson } from '../models/index.js';

const router = express.Router();

router.get('/:reportId', (req, res) => {
    const reports = readJson('reports.json', []);
    if (!reports || reports.length === 0) {
        return res.status(404).json({ message: "لا توجد بيانات للتقرير" });
    }
    const report = reports.find(x => x.reportId === req.params.reportId);

    if (!report) {
        return res.status(404).send('Report not found');
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<html><body><h3>تقرير الفحص</h3><p>الرقم: ${report.idNumber}</p><p>النوع: ${report.examType}</p><p>الإنهاء: ${new Date(report.finishedAt).toLocaleString()}</p></body></html>`);
});

export default router;

