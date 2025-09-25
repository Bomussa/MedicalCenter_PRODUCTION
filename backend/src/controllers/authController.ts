import { Request, Response } from "express";
import { prisma } from "../index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "change_this_secret";

export async function ensureSuperAdmin() {
  const count = await prisma.user.count();
  if (count === 0) {
    const username = process.env.SUPERADMIN_USER || "superadmin";
    const password = process.env.SUPERADMIN_PASS || "ChangeMe_123";
    const hash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { username, passwordHash: hash, role: "SUPER_ADMIN" }});
    await prisma.auditLog.create({ data: { actor: "system", action: "seed_superadmin", meta: username }});
  }
}

export async function login(req: Request, res: Response) {
  const { username, password } = req.body as { username: string; password: string };
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET, { expiresIn: "12h" });
  await prisma.auditLog.create({ data: { actor: username, action: "login" }});
  res.json({ token, role: user.role });
}

export async function createAdmin(req: Request, res: Response) {
  const { username, password, role } = req.body as { username: string; password: string; role: "ADMIN" | "SUPER_ADMIN" };
  const hash = await bcrypt.hash(password, 10);
  const u = await prisma.user.create({ data: { username, passwordHash: hash, role } });
  await prisma.auditLog.create({ data: { actor: (req as any).user?.username || "unknown", action: "create_user", meta: username }});
  res.json({ id: u.id, username: u.username, role: u.role });
}

export async function listUsers(_req: Request, res: Response) {
  const users = await prisma.user.findMany({ select: { id: true, username: true, role: true, createdAt: true }});
  res.json(users);
}
