import { Router } from "express";
import { login, listUsers, createUser } from "./controller";
import jwt from "jsonwebtoken";

const r = Router();
r.post("/login", login);

// حماية باقي المسارات
r.use((req, res, next)=>{
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if(!token) return res.status(401).json({ error:"unauthorized" });
  try{ 
    jwt.verify(token, process.env.JWT_SECRET || "CHANGE_ME"); 
    next(); 
  }
  catch(_e){ 
    return res.status(401).json({ error:"unauthorized" }); 
  }
});

r.get("/users", listUsers);
r.post("/users", createUser);

export default r;

