import fs from 'fs'; import path from 'path';
export const paths = (appDir) => ({ dataDir:path.join(appDir,'data'), backupsDir:path.join(appDir,'backups'), logsDir:path.join(appDir,'logs') });
export function ts(){ const d=new Date(); const p=n=>String(n).padStart(2,'0'); return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`; }
export function logError(logsDir, msg){ try{ fs.mkdirSync(logsDir,{recursive:true}); fs.appendFileSync(path.join(logsDir,'errors.log'), `[${new Date().toISOString()}] ${msg}\n`);}catch{} }
export function safeReadJson(filePath, fallback){ try{ const txt=fs.readFileSync(filePath,'utf-8'); return JSON.parse(txt);}catch(e){ return fallback;} }
export function safeWriteJson(filePath, data){ try{ fs.writeFileSync(filePath, JSON.stringify(data,null,2),'utf-8'); return true;}catch(e){ return false; } }
export function listBackups(backupsDir){ if(!fs.existsSync(backupsDir)) return []; return fs.readdirSync(backupsDir).sort().reverse(); }
export function backupNow(appDir){ const p=paths(appDir); const stamp=ts(); const outData=path.join(p.backupsDir,`data_${stamp}`); fs.mkdirSync(outData,{recursive:true});
  if(fs.existsSync(p.dataDir)){ for(const f of fs.readdirSync(p.dataDir)){ const s=path.join(p.dataDir,f); const d=path.join(outData,f); if(fs.statSync(s).isFile()) fs.copyFileSync(s,d); } }
  const env=path.join(appDir,'.env'); if(fs.existsSync(env)){ fs.copyFileSync(env, path.join(p.backupsDir,`env_${stamp}.env`)); } return {stamp, outData}; }
export function restoreLatestData(appDir){ const p=paths(appDir); const list=listBackups(p.backupsDir); const dataBkps=list.filter(x=>x.startsWith('data_')); if(!dataBkps.length) return false;
  const srcDir=path.join(p.backupsDir,dataBkps[0]); for(const f of fs.readdirSync(srcDir)){ const s=path.join(srcDir,f); const d=path.join(p.dataDir,f); fs.copyFileSync(s,d);} return true; }
