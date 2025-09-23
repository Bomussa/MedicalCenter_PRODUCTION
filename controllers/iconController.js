const { Icon } = require('../models');
exports.list = async (req,res,next)=>{ try{ res.json(await Icon.findAll()); }catch(e){ next(e); } };
exports.get = async (req,res,next)=>{ try{ const row=await Icon.findByPk(req.params.id); if(!row) return res.status(404).end(); res.json(row); }catch(e){ next(e); } };
exports.upsert = async (req,res,next)=>{ try{ const { id } = req.params; const { name, svg, url } = req.body; await Icon.upsert({ id, name, svg, url }); res.json({ok:true}); }catch(e){ next(e); } };
exports.remove = async (req,res,next)=>{ try{ const n=await Icon.destroy({ where:{ id:req.params.id } }); res.status(n?204:404).end(); }catch(e){ next(e); } };
