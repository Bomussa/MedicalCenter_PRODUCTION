import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { sign } from "./jwt";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function login(req:Request, res:Response){
  const { username, password } = req.body;
  
  try {
    const u = await prisma.user2.findUnique({ where:{ username } });
    if(!u) return res.status(401).json({ error: "invalid" });
    
    const ok = await bcrypt.compare(password, u.passwordHash);
    if(!ok) return res.status(401).json({ error: "invalid" });
    
    const token = sign({ uid: u.id, role: u.role }, process.env.JWT_SECRET || "CHANGE_ME");
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "internal server error" });
  }
}

export async function listUsers(_req:Request, res:Response){
  try {
    const rows = await prisma.user2.findMany({ 
      select:{ id:true, username:true, role:true }
    });
    res.json(rows);
  } catch (error) {
    console.error("List users error:", error);
    res.status(500).json({ error: "internal server error" });
  }
}

export async function createUser(req:Request, res:Response){
  const { username, password, role } = req.body;
  
  try {
    const hash = await bcrypt.hash(password, 10);
    const u = await prisma.user2.create({ 
      data:{ username, passwordHash: hash, role } 
    });
    res.json({ id: u.id, username: u.username, role: u.role });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({ error: "internal server error" });
  }
}

