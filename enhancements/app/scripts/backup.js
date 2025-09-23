import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const __filename=fileURLToPath(import.meta.url); const __dirname=path.dirname(__filename);
const APP_DIR=path.join(__dirname,'..'); const DATA_DIR=path.join(APP_DIR,'data'); const BKP_DIR=path.join(APP_DIR,'backups'); const ENV_FILE=path.join(APP_DIR,'.env');
function ts(){ const d=new Date(); const p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`; }
function cpdir(src,dst){ fs.mkdirSync(dst,{recursive:true}); for(const f of fs.readdirSync(src)){ const s=path.join(src,f); const d=path.join(dst,f); const st=fs.statSync(s); st.isDirectory()?cpdir(s,d):fs.copyFileSync(s,d); } }
const mode=process.argv[2]||'full'; const stamp=ts(); fs.mkdirSync(BKP_DIR,{recursive:true});
if(mode==='full'||mode==='data'){ if(fs.existsSync(DATA_DIR)){ const out=path.join(BKP_DIR,`data_${stamp}`); cpdir(DATA_DIR,out); console.log('✓ Data backup ->', out);}}
if(mode==='full'||mode==='env'){ const eout=path.join(BKP_DIR,`env_${stamp}.env`); if(fs.existsSync(ENV_FILE)){ fs.copyFileSync(ENV_FILE,eout); console.log('✓ Env backup ->', eout);}}
if(mode==='full'||mode==='app'){ const keys=['server.js','package.json']; const out=path.join(BKP_DIR,`app_${stamp}`); fs.mkdirSync(out,{recursive:true}); for(const k of keys){ const p=path.join(APP_DIR,k); if(fs.existsSync(p)) fs.copyFileSync(p,path.join(out,k)); } console.log('✓ App backup ->', out);} console.log('Backup completed.'); 
