import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "change_this_secret";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try { (req as any).user = jwt.verify(token, SECRET); next(); } 
  catch { return res.status(401).json({ error: "Unauthorized" }); }
}
export function requireRole(role: "SUPER_ADMIN" | "ADMIN") {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    if (user.role !== role && user.role !== "SUPER_ADMIN") return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
