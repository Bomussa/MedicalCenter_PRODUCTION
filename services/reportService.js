const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const { Visit } = require('../models');
const { Op } = require('sequelize');
const { decrypt } = require('../utils/crypto');

function mapRow(r){
  return {
    id: r.id,
    militaryId: r.militaryIdEnc ? decrypt(r.militaryIdEnc) : null,
    examId: r.examId,
    clinicId: r.clinicId,
    gender: r.gender,
    status: r.status,
    date: r.createdAt ? new Date(r.createdAt).toISOString().slice(0,10) : null,
    startTime: r.startTime || null,
    endTime: r.endTime || null
  };
}

async function fetchToday(){
  const since = new Date(); since.setHours(0,0,0,0);
  const rows = await Visit.findAll({ where: { createdAt: { [Op.gte]: since } }, raw: true });
  return rows.map(mapRow);
}

async function generateDailyCSV(outDir){
  const rows = await fetchToday();
  const fields = ['id','militaryId','examId','clinicId','gender','status','date','startTime','endTime'];
  const parser = new Parser({ fields });
  const csv = parser.parse(rows);
  const file = path.join(outDir, `detailed_${new Date().toISOString().slice(0,10)}.csv`);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(file, csv, 'utf8');
  return file;
}

async function generateDailyPDF(outDir){
  const rows = await fetchToday();
  const file = path.join(outDir, `detailed_${new Date().toISOString().slice(0,10)}.pdf`);
  fs.mkdirSync(outDir, { recursive: true });
  const doc = new PDFDocument({ size:'A4', margin: 36 });
  doc.fontSize(14).text('Daily Visits Report', { align:'center' });
  doc.moveDown();
  doc.fontSize(9);
  rows.forEach((r, i) => {
    doc.text(`${i+1}. ID=${r.militaryId} exam=${r.examId} clinic=${r.clinicId} gender=${r.gender} status=${r.status} date=${r.date} start=${r.startTime||'-'} end=${r.endTime||'-'}`);
  });
  doc.end();
  doc.pipe(fs.createWriteStream(file));
  return file;
}

module.exports = { generateDailyCSV, generateDailyPDF };
