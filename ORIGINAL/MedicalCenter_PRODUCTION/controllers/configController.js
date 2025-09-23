const { AppConfig } = require('../models');

exports.getAll = async (req,res,next)=>{
  try{ const rows = await AppConfig.findAll(); res.json(rows); }catch(e){ next(e); }
};
exports.getKey = async (req,res,next)=>{
  try{ const row = await AppConfig.findByPk(req.params.key); if(!row) return res.status(404).end(); res.json(row); }catch(e){ next(e); }
};
exports.setKey = async (req,res,next)=>{
  try{ const { key } = req.params; const { value } = req.body;
    const row = await AppConfig.upsert({ key, value });
    res.status(200).json({ ok:true });
  }catch(e){ next(e); }
};
exports.deleteKey = async (req,res,next)=>{
  try{ const n = await AppConfig.destroy({ where: { key: req.params.key } }); res.status(n?204:404).end(); }catch(e){ next(e); }
};
