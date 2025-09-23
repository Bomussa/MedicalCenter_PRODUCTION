const { Text } = require('../models');
exports.list = async (req,res,next)=>{ try{ res.json(await Text.findAll()); }catch(e){ next(e); } };
exports.get = async (req,res,next)=>{ try{ const row=await Text.findByPk(req.params.key); if(!row) return res.status(404).end(); res.json(row); }catch(e){ next(e); } };
exports.upsert = async (req,res,next)=>{ try{ const { key } = req.params; const { ar, en } = req.body; await Text.upsert({ key, ar, en }); res.json({ok:true}); }catch(e){ next(e); } };
exports.remove = async (req,res,next)=>{ try{ const n=await Text.destroy({ where:{ key:req.params.key } }); res.status(n?204:404).end(); }catch(e){ next(e); } };
