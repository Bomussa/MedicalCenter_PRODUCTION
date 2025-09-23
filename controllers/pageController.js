const { Page } = require('../models');
exports.list = async (req,res,next)=>{ try{ res.json(await Page.findAll()); }catch(e){ next(e); } };
exports.get = async (req,res,next)=>{ try{ const row=await Page.findByPk(req.params.id); if(!row) return res.status(404).end(); res.json(row); }catch(e){ next(e); } };
exports.upsert = async (req,res,next)=>{ try{ const { id } = req.params; const { title_ar, title_en, layout } = req.body; await Page.upsert({ id, title_ar, title_en, layout }); res.json({ok:true}); }catch(e){ next(e); } };
exports.remove = async (req,res,next)=>{ try{ const n=await Page.destroy({ where:{ id:req.params.id } }); res.status(n?204:404).end(); }catch(e){ next(e); } };
