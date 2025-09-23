const fs = require('fs'); const path = require('path');
const root = path.join(__dirname, '..');
const clientSrc = path.join(root, 'client', 'src');

function walk(dir, acc=[]){
  for(const f of fs.readdirSync(dir)){
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if(st.isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

let errors = [];
for(const p of walk(clientSrc, [])){
  if(!/[.](js|jsx|ts|tsx)$/.test(p)) continue;
  const txt = fs.readFileSync(p,'utf8');

  // alias imports
  for(const m of txt.matchAll(/from\s+['"]@\/([^'"]+)['"]/g)){
    const rel = m[1];
    const candidate = path.join(clientSrc, rel);
    const exts = ["",".js",".jsx",".ts",".tsx",".json",".css"];
    const ok = exts.some(ext => fs.existsSync(candidate+ext) || fs.existsSync(path.join(candidate, 'index'+ext)));
    if(!ok) errors.push(`Missing alias target: ${path.relative(clientSrc,p)} -> @/${rel}`);
  }

  // Network calls
  if(/fetch\(\s*['"]https?:\/\//.test(txt) || /axios\.(get|post|put|delete)\(\s*['"]https?:\/\//.test(txt)){
    errors.push(`Absolute URL call found: ${path.relative(clientSrc,p)}`);
  }
  for(const m of txt.matchAll(/fetch\(\s*['"](\/[^'"]+)['"]/g)){
    const url = m[1];
    if(!url.startsWith('/api')) errors.push(`Relative non-/api call: ${path.relative(clientSrc,p)} -> ${url}`);
  }
}

if(errors.length){
  console.error('Static QA Errors:\n' + errors.map(e=>'- '+e).join('\n'));
  process.exit(1);
}else{
// removed: // removed:   console.log('Static QA passed ✅');
}
