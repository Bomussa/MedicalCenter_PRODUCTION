/**
 * Load seeds/seeds.json into your DB.
 * This is a placeholder script – add your DB integration here.
 */
const fs = require('fs');
const path = require('path');

(function main(){
  const p = path.join(__dirname, '..', 'seeds', 'sample.json');
  const data = JSON.parse(fs.readFileSync(p,'utf8'));
// removed: // removed:   console.log('Seed preview:', Object.keys(data));
  // NOTE[2025-09-23]: reviewed NOTE[2025-09-23]: reviewed TODO: insert into DB models
  process.exit(0);
})();
