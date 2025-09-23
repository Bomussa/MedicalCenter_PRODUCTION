import { Parser as CsvParser } from 'json2csv';
import PDFDocument from 'pdfkit';

export async function exportCsv(req, res) {
  try {
    const rows = [
      { clinic: 'General', visits: 120, month: '2025-09' },
      { clinic: 'Dental', visits: 42, month: '2025-09' },
    ];
    const parser = new CsvParser({ fields: ['clinic', 'visits', 'month'] });
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment(`report-${Date.now()}.csv`);
    return res.send(csv);
  } catch {
    res.status(500).json({ message: 'فشل توليد CSV' });
  }
}

export async function exportPdf(req, res) {
  try {
    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="report-${Date.now()}.pdf"`);
    doc.fontSize(18).text('تقارير المركز الطبي', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('هذا التقرير يمثل مثالًا قابلًا للتخصيص، مع دعم الهوية المؤسسية.');
    doc.end();
    doc.pipe(res);
  } catch {
    res.status(500).json({ message: 'فشل توليد PDF' });
  }
}
