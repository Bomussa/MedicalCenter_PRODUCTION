// scripts/qa/checkVoiceGuide.js
const fs = require('fs'), path = require('path');
const ROOT = process.cwd();
const mustFiles = [
  'backend/data/voicePrompts.json',
  'routes/voicePrompts.js',
  'frontend/src/components/VoiceGuide.tsx',
  'frontend/src/hooks/useVoicePrompts.ts',
  'frontend/public/audio/welcome_ar.mp3',
  'frontend/public/audio/welcome_en.mp3',
  'frontend/public/audio/exam_completed_en.mp3'
];
let ok = true, missing = [];
for(const rel of mustFiles){
  const p = path.join(ROOT, rel);
  if(!fs.existsSync(p)){ ok=false; missing.push(rel); }
}
// removed: // removed: console.log(JSON.stringify({ ok, missing }, null, 2));
process.exit(ok?0:1);
