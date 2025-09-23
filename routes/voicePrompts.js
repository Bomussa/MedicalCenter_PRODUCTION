// routes/voicePrompts.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dataPath = path.join(__dirname, '../backend/data/voicePrompts.json');
function loadData(){ return JSON.parse(fs.readFileSync(dataPath, 'utf-8')); }
function saveData(d){ fs.writeFileSync(dataPath, JSON.stringify(d, null, 2), 'utf-8'); }

// Read all
router.get('/', (req,res)=>{ res.json(loadData()); });

// Create
router.post('/', (req,res)=>{
  const d = loadData();
  const { id, ar, en, audio_ar, audio_en } = req.body || {};
  if(!id || !ar || !en){ return res.status(400).json({ ok:false, message:'Missing fields: id, ar, en' }); }
  d[id] = { ar, en, audio_ar, audio_en };
  saveData(d);
  res.json({ ok:true, item:d[id] });
});

// Update
router.put('/:id', (req,res)=>{
  const d = loadData();
  const id = req.params.id;
  if(!d[id]) return res.status(404).json({ ok:false, message:'Not found' });
  const { ar, en, audio_ar, audio_en } = req.body || {};
  d[id] = { ar: ar ?? d[id].ar, en: en ?? d[id].en, audio_ar: audio_ar ?? d[id].audio_ar, audio_en: audio_en ?? d[id].audio_en };
  saveData(d);
  res.json({ ok:true, item:d[id] });
});

// Delete
router.delete('/:id', (req,res)=>{
  const d = loadData();
  const id = req.params.id;
  if(!d[id]) return res.status(404).json({ ok:false, message:'Not found' });
  delete d[id];
  saveData(d);
  res.json({ ok:true });
});

module.exports = router;
