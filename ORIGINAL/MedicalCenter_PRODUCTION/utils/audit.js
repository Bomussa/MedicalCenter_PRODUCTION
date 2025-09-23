const fs = require('fs');
const path = require('path');

const AUDIT_PATH = path.join(__dirname, '..', 'logs', 'audit.log');
function audit(event, payload = {}){
  try{
    const line = JSON.stringify({ ts: new Date().toISOString(), event, ...payload }) + '\n';
    fs.mkdirSync(path.dirname(AUDIT_PATH), { recursive: true });
    fs.appendFileSync(AUDIT_PATH, line);
  }catch(e){ /* ignore */ }
}

module.exports = { audit };
