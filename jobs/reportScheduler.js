require('dotenv').config();
const cron = require('node-cron');
const path = require('path');
const { sequelize } = require('../models');
const { generateDailyCSV, generateDailyPDF } = require('../services/reportService');

const OUT = process.env.REPORTS_DIR || path.join(__dirname, '..', 'exports');

async function runOnce(){
  await sequelize.authenticate();
  await sequelize.sync(); // ensure tables exist; switch to migrations in prod
  const csv = await generateDailyCSV(OUT);
  const pdf = await generateDailyPDF(OUT);
// removed: // removed:   console.log('Reports generated:', csv, pdf);
  process.exit(0);
}

if (process.argv.includes('--run-once')){
  runOnce().catch(e => { console.error(e); process.exit(1); });
} else {
  // Every day at 18:00 Asia/Qatar
  cron.schedule('0 18 * * *', async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      await generateDailyCSV(OUT);
      await generateDailyPDF(OUT);
// removed: // removed:       console.log('Daily reports done');
    } catch(e){ console.error('Cron error', e); }
  }, { timezone: 'Asia/Qatar' });
}
