import express from 'express'; import cors from 'cors'; import helmet from 'helmet'; import dotenv from 'dotenv';
import fs from 'fs'; import path from 'path'; import jwt from 'jsonwebtoken'; import { nanoid } from 'nanoid'; import { fileURLToPath } from 'url';
import { paths, logError, safeReadJson, safeWriteJson, listBackups, backupNow, restoreLatestData } from './utils/autoHeal.js';
const __filename=fileURLToPath(import.meta.url); const __dirname=path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') }); const app=express();
app.use(helmet()); app.use(express.json()); app.use(cors({ origin: process.env.CORS_ORIGIN || '*' })); app.use('/', express.static(path.join(__dirname,'public')));
try{ backupNow(__dirname); }catch{}
process.on('uncaughtException',(err)=>{ const p=paths(__dirname); logError(p.logsDir,'uncaughtException: '+err.message); try{ restoreLatestData(__dirname);}catch{} });
process.on('unhandledRejection',(err)=>{ const p=paths(__dirname); logError(p.logsDir,'unhandledRejection: '+(err?.message||err)); });
function pth(n){ return path.join(__dirname,'data',n); }
function readJson(n,f){ const fp=pth(n); try{ return safeReadJson(fp,f);}catch(e){ logError(paths(__dirname).logsDir,`readJson failed for ${n}: ${e.message}`); const ok=restoreLatestData(__dirname); if(ok) return safeReadJson(fp,f); return f; } }
function writeJson(n,d){ const fp=pth(n); const ok=safeWriteJson(fp,d); if(!ok) logError(paths(__dirname).logsDir,`writeJson failed for ${n}`); }
function dailyPin(id){ const d=new Date(); const base=d.getFullYear()*1000+(d.getMonth()+1)*50+d.getDate(); let s=base; for(const c of id) s+=c.charCodeAt(0); return (s%99)+1; }
function requireAuth(req,res,next){ try{ const h=req.headers['authorization']; if(!h) return res.status(401).json({ok:false,error:'no auth'}); const t=h.split(' ')[1]; const d=jwt.verify(t, process.env.SESSION_SECRET||'secret'); req.user=d; next(); }catch(e){ return res.status(401).json({ok:false,error:'bad token'}); } }
app.post('/admin/login',(req,res)=>{ const {username,password}=req.body||{}; if(username===process.env.SUPERADMIN_USER && password===process.env.SUPERADMIN_PASS){ const token=jwt.sign({role:'superAdmin',u:username}, process.env.SESSION_SECRET||'secret', {expiresIn:'12h'}); return res.json({ok:true,token}); } res.status(401).json({ok:false,error:'invalid credentials'}); });
app.get('/admin/settings', requireAuth, (_req,res)=>{ const s=readJson('settings.json',{}); res.json({ok:true,data:s}); });
app.post('/admin/settings', requireAuth, (req,res)=>{ const s=readJson('settings.json',{}); if(typeof req.body.overrideAllClinics==='boolean') s.overrideAllClinics=req.body.overrideAllClinics; writeJson('settings.json',s); res.json({ok:true,data:s}); });
app.get('/admin/pins', requireAuth, (_req,res)=>{ const clinics=readJson('clinics.json',[]); const data=clinics.map(c=>({clinicId:c.id,name_ar:c.name_ar,name_en:c.name_en,pin:dailyPin(c.id)})); res.json({ok:true,data}); });
app.get('/admin/backups', requireAuth, (_req,res)=>{ const list=listBackups(paths(__dirname).backupsDir); res.json({ok:true,data:list}); });
app.post('/admin/backup', requireAuth, (_req,res)=>{ const out=backupNow(__dirname); res.json({ok:true,data:out}); });
app.post('/admin/restore', requireAuth, (_req,res)=>{ const ok=restoreLatestData(__dirname); res.json({ok:!!ok}); });
app.get('/admin/logs/errors', requireAuth, (_req,res)=>{ try{ const p=path.join(paths(__dirname).logsDir,'errors.log'); const txt=fs.existsSync(p)?fs.readFileSync(p,'utf-8'):''; res.json({ok:true,data:txt}); }catch(e){ res.status(500).json({ok:false,error:e.message}); } });
app.post('/api/patient/start',(req,res)=>{ const {idNumber,gender,examType}=req.body||{}; if(!idNumber||!gender||!examType) return res.status(400).json({ok:false,error:'missing fields'});
  const cl=readJson('clinics.json',[]); const rt=readJson('routes.json',{}); const st=readJson('settings.json',{});
  const routeIds=(rt[examType]?.order)||[]; const route=routeIds.map(id=>cl.find(x=>x.id===id)).filter(Boolean);
  const sessionId=nanoid(10); const sessions=readJson('sessions.json',[]);
  sessions.push({sessionId,idNumber,gender,examType,route:routeIds,current:0,createdAt:Date.now()}); writeJson('sessions.json',sessions);
  res.json({ok:true,sessionId,route,current:0,settings:st}); });
app.get('/api/patient/route/:sessionId',(req,res)=>{ const sessions=readJson('sessions.json',[]); const cl=readJson('clinics.json',[]); const s=sessions.find(x=>x.sessionId===req.params.sessionId); if(!s) return res.status(404).json({ok:false,error:'session not found'}); const route=s.route.map(id=>cl.find(x=>x.id===id)).filter(Boolean); res.json({ok:true,route,current:s.current}); });
app.post('/api/visits/enter',(req,res)=>{ const {sessionId,pin}=req.body||{}; const sessions=readJson('sessions.json',[]); const s=sessions.find(x=>x.sessionId===sessionId); if(!s) return res.status(404).json({ok:false,error:'session not found'});
  const st=readJson('settings.json',{}); const cl=readJson('clinics.json',[]); const currentClinicId=s.route[s.current]; const currentClinic=cl.find(x=>x.id===currentClinicId); if(!currentClinic) return res.status(400).json({ok:false,error:'invalid clinic'});
  const isOverride=!!st.overrideAllClinics; const expectedPin=String(((d=>{ const base=d.getFullYear()*1000+(d.getMonth()+1)*50+d.getDate(); let sum=base; for(const c of currentClinic.id) sum+=c.charCodeAt(0); return (sum%99)+1; })(new Date())));
  if(currentClinic.requiresPIN && !isOverride){ if(!pin || pin!==expectedPin) return res.status(401).json({ok:false,error:'wrong pin'}); }
  s.current+=1; if(s.current>=s.route.length){ const reports=readJson('reports.json',[]); const reportId=nanoid(8); reports.push({reportId,sessionId,idNumber:s.idNumber,examType:s.examType,finishedAt:Date.now()}); writeJson('reports.json',reports); writeJson('sessions.json',sessions); return res.json({ok:true,done:true,reportId}); }
  writeJson('sessions.json',sessions); const clFull=s.route.map(id=>cl.find(x=>x.id===id)); return res.json({ok:true,done:false,route:clFull,current:s.current}); });
app.get('/print/:reportId',(req,res)=>{ const reports=readJson('reports.json',[]); const r=reports.find(x=>x.reportId===req.params.reportId); if(!r) return res.status(404).send('Report not found'); res.setHeader('Content-Type','text/html; charset=utf-8'); res.send(`<html><body><h3>تقرير الفحص</h3><p>الرقم: ${r.idNumber}</p><p>النوع: ${r.examType}</p><p>الإنهاء: ${new Date(r.finishedAt).toLocaleString()}</p></body></html>`); });
app.get('/health',(_req,res)=>res.json({ok:true})); app.get('/ready',(_req,res)=>res.json({ok:true}));
const PORT=process.env.PORT||4000; app.listen(PORT,()=>console.log('Fullstack server on http://localhost:'+PORT));
