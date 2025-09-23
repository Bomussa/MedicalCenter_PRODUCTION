const { Route } = require('../models');
exports.list = async (req,res,next)=>{ try{ res.json(await Route.findAll()); }catch(e){ next(e); } };
exports.get = async (req,res,next)=>{ try{ const row=await Route.findByPk(req.params.path); if(!row) return res.status(404).end(); res.json(row); }catch(e){ next(e); } };
exports.upsert = async (req,res,next)=>{ try{ const { path } = req.params; const { pageId, roles } = req.body; await Route.upsert({ path, pageId, roles }); res.json({ok:true}); }catch(e){ next(e); } };
exports.remove = async (req,res,next)=>{ try{ const n=await Route.destroy({ where:{ path:req.params.path } }); res.status(n?204:404).end(); }catch(e){ next(e); } };
