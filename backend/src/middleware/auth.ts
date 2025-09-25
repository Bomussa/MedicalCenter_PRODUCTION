import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number
    username: string
    role: string
  }
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' })
  }
  
  try {
    const decoded = jwt.verify(token, SECRET) as any
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' })
  }
}

export function requireRole(role: 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR' | 'NURSE') {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized - No user context' })
    }
    
    // SUPER_ADMIN can access everything
    if (user.role === 'SUPER_ADMIN') {
      return next()
    }
    
    // Check specific role
    if (user.role !== role) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' })
    }
    
    next()
  }
}

export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  
  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET) as any
      req.user = decoded
    } catch (error) {
      // Token is invalid, but we continue without user context
    }
  }
  
  next()
}

