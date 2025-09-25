import { Router } from 'express'
import { login, createUser, listUsers, deleteUser, ensureSuperAdmin } from '../controllers/authController'
import { requireAuth, requireRole } from '../middleware/auth'

const router = Router()

// Initialize super admin on startup
ensureSuperAdmin()

// Public routes
router.post('/login', login)

// Protected routes
router.post('/users', requireAuth, requireRole('SUPER_ADMIN'), createUser)
router.get('/users', requireAuth, requireRole('ADMIN'), listUsers)
router.delete('/users/:id', requireAuth, requireRole('SUPER_ADMIN'), deleteUser)

export default router

