require('child_process').spawnSync('node',['scripts/qa/checkVoiceGuide.js'],{ stdio:'inherit' });

require('child_process').spawnSync('node',['scripts/qa/checkClinicRedirects.js'],{ stdio:'inherit' });
