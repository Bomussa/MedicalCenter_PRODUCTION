import { Router } from 'express'
import { prisma } from '../index'
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth'

const router = Router()

// Get exam types
router.get('/types', async (req, res) => {
  try {
    const examTypes = [
      { id: 'RECRUITMENT', name: 'تجنيد', description: 'فحص طبي للتجنيد' },
      { id: 'PROMOTION', name: 'ترفيع', description: 'فحص طبي للترفيع' },
      { id: 'TRANSFER', name: 'نقل', description: 'فحص طبي للنقل' },
      { id: 'CONVERSION', name: 'تحويل', description: 'فحص طبي للتحويل' },
      { id: 'AVIATION', name: 'طيران', description: 'فحص طبي للطيران' },
      { id: 'COOKS', name: 'طباخين', description: 'فحص طبي للطباخين' }
    ]

    res.json(examTypes)
  } catch (error) {
    console.error('Get exam types error:', error)
    res.status(500).json({ error: 'Failed to get exam types' })
  }
})

// Get clinic paths for exam type
router.get('/paths/:examType', async (req, res) => {
  try {
    const { examType } = req.params

    // Define clinic paths for each exam type
    const clinicPaths: Record<string, string[]> = {
      RECRUITMENT: ['lab', 'cardiology', 'ophthalmology', 'ent', 'dentistry'],
      PROMOTION: ['lab', 'cardiology', 'ophthalmology'],
      TRANSFER: ['lab', 'cardiology'],
      CONVERSION: ['lab', 'cardiology', 'ophthalmology', 'ent'],
      AVIATION: ['lab', 'cardiology', 'ophthalmology', 'ent', 'dentistry'],
      COOKS: ['lab', 'cardiology', 'ophthalmology']
    }

    const path = clinicPaths[examType] || []

    // Get clinic details
    const clinics = await prisma.clinic.findMany({
      where: {
        id: {
          in: path
        }
      }
    })

    // Sort clinics according to the path order
    const sortedClinics = path.map(clinicId => 
      clinics.find(clinic => clinic.id === clinicId)
    ).filter(Boolean)

    res.json({
      examType,
      path: sortedClinics
    })
  } catch (error) {
    console.error('Get clinic path error:', error)
    res.status(500).json({ error: 'Failed to get clinic path' })
  }
})

// Submit exam selection
router.post('/select', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { identifier, examType, gender } = req.body

    if (!identifier || !examType || !gender) {
      return res.status(400).json({ error: 'Identifier, exam type, and gender are required' })
    }

    // Check if visitor already exists
    let visitor = await prisma.visitor.findUnique({
      where: { identifier }
    })

    if (visitor) {
      // Update existing visitor
      visitor = await prisma.visitor.update({
        where: { identifier },
        data: {
          examType,
          gender,
          status: 'WAITING',
          visitDate: new Date()
        }
      })
    } else {
      // Create new visitor
      visitor = await prisma.visitor.create({
        data: {
          identifier,
          examType,
          gender,
          status: 'WAITING'
        }
      })
    }

    // Get clinic path for this exam type
    const clinicPaths: Record<string, string[]> = {
      RECRUITMENT: ['lab', 'cardiology', 'ophthalmology', 'ent', 'dentistry'],
      PROMOTION: ['lab', 'cardiology', 'ophthalmology'],
      TRANSFER: ['lab', 'cardiology'],
      CONVERSION: ['lab', 'cardiology', 'ophthalmology', 'ent'],
      AVIATION: ['lab', 'cardiology', 'ophthalmology', 'ent', 'dentistry'],
      COOKS: ['lab', 'cardiology', 'ophthalmology']
    }

    const path = clinicPaths[examType] || []

    // Assign first clinic and queue number
    if (path.length > 0) {
      const queueNumber = Math.floor(Math.random() * 50) + 1

      await prisma.visitor.update({
        where: { id: visitor.id },
        data: {
          assignedClinic: path[0],
          queueNumber
        }
      })

      visitor.assignedClinic = path[0]
      visitor.queueNumber = queueNumber
    }

    res.json({
      visitor,
      clinicPath: path
    })
  } catch (error) {
    console.error('Exam selection error:', error)
    res.status(500).json({ error: 'Failed to process exam selection' })
  }
})

export default router

