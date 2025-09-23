// routes/clinicRedirects.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const filePath = path.join(__dirname, '../backend/data/clinicRedirects.json');
function load(){ return JSON.parse(fs.readFileSync(filePath, 'utf-8')); }
function save(d){ fs.writeFileSync(filePath, JSON.stringify(d, null, 2), 'utf-8'); }

// List all
router.get('/', (req,res)=> res.json(load()));

// Resolve single
router.get('/resolve', (req,res)=>{
  const from = (req.query.slug||'').trim();
  if(!from) return res.status(400).json({ ok:false, message:'Missing slug' });
  const map = load();
  const to = map[from] || null;
  res.json({ ok:true, from, to, effective: to || from });
});

// Create or update mapping
router.put('/:from', (req,res)=>{
  const from = req.params.from;
  const to = (req.body.to||'').trim();
  if(!to) return res.status(400).json({ ok:false, message:'Missing "to"' });
  const map = load();
  map[from] = to;
  save(map);
  res.json({ ok:true, from, to });
});

// Delete mapping
router.delete('/:from', (req,res)=>{
  const from = req.params.from;
  const map = load();
  if(!(from in map)) return res.status(404).json({ ok:false, message:'Not found' });
  delete map[from];
  save(map);
  res.json({ ok:true });
});

module.exports = router;
