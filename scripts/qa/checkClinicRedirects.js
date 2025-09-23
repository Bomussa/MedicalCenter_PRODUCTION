// scripts/qa/checkClinicRedirects.js
const fs = require('fs'), path = require('path');
const ROOT = process.cwd();
const must = [
  'backend/data/clinicRedirects.json',
  'routes/clinicRedirects.js',
  'frontend/src/hooks/useClinicRedirect.ts',
  'frontend/src/pages/AdminClinicRedirects.tsx',
  'frontend/public/audio/clinic_redirect_ar.mp3',
  'frontend/public/audio/clinic_redirect_en.mp3'
];
let ok=true, missing=[];
for(const rel of must){
  if(!fs.existsSync(path.join(ROOT, rel))) { ok=false; missing.push(rel); }
}
// removed: // removed: console.log(JSON.stringify({ ok, missing }, null, 2));
process.exit(ok?0:1);
