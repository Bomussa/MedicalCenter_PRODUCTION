import { Request, Response } from 'express'
import { prisma } from '../index'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthenticatedRequest } from '../middleware/auth'

const SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production'

export async function ensureSuperAdmin() {
  try {
    const userCount = await prisma.user.count()
    
    if (userCount === 0) {
      const username = process.env.SUPERADMIN_USER || 'superadmin'
      const password = process.env.SUPERADMIN_PASS || 'ChangeMe_123'
      const passwordHash = await bcrypt.hash(password, 12)
      
      await prisma.user.create({
        data: {
          username,
          passwordHash,
          role: 'SUPER_ADMIN'
        }
      })
      
      await prisma.auditLog.create({
        data: {
          actor: 'system',
          action: 'seed_superadmin',
          meta: username
        }
      })
      
      console.log(`✅ Super admin created: ${username}`)
    }
  } catch (error) {
    console.error('❌ Error ensuring super admin:', error)
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { username, password } = req.body as { username: string; password: string }
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' })
    }
    
    const user = await prisma.user.findUnique({
      where: { username }
    })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role
      },
      SECRET,
      { expiresIn: '12h' }
    )
    
    await prisma.auditLog.create({
      data: {
        actor: username,
        action: 'login',
        meta: req.ip || 'unknown'
      }
    })
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createUser(req: AuthenticatedRequest, res: Response) {
  try {
    const { username, password, role } = req.body as {
      username: string
      password: string
      role: 'ADMIN' | 'DOCTOR' | 'NURSE'
    }
    
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required' })
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })
    
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' })
    }
    
    const passwordHash = await bcrypt.hash(password, 12)
    
    const newUser = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role
      }
    })
    
    await prisma.auditLog.create({
      data: {
        actor: req.user?.username || 'unknown',
        action: 'create_user',
        meta: `${username} (${role})`
      }
    })
    
    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
      createdAt: newUser.createdAt
    })
  } catch (error) {
    console.error('Create user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function listUsers(req: AuthenticatedRequest, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    res.json(users)
  } catch (error) {
    console.error('List users error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function deleteUser(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params
    const userId = parseInt(id)
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' })
    }
    
    // Prevent deleting super admin
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Cannot delete super admin' })
    }
    
    await prisma.user.delete({
      where: { id: userId }
    })
    
    await prisma.auditLog.create({
      data: {
        actor: req.user?.username || 'unknown',
        action: 'delete_user',
        meta: user.username
      }
    })
    
    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

