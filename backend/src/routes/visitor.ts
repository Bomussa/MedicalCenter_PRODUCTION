import { Router } from 'express'
import { prisma } from '../index'
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth'

const router = Router()

// Register new visitor
router.post('/register', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { identifier, gender, examType } = req.body

    if (!identifier || !gender || !examType) {
      return res.status(400).json({ error: 'Identifier, gender, and exam type are required' })
    }

    // Check if visitor already exists today
    const today = new Date()
    const todayStart = new Date(today.setHours(0, 0, 0, 0))
    const todayEnd = new Date(today.setHours(23, 59, 59, 999))

    let visitor = await prisma.visitor.findFirst({
      where: {
        identifier,
        visitDate: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    })

    if (visitor) {
      return res.status(409).json({ 
        error: 'Visitor already registered today',
        visitor 
      })
    }

    // Create new visitor
    visitor = await prisma.visitor.create({
      data: {
        identifier,
        gender,
        examType,
        status: 'WAITING'
      }
    })

    res.status(201).json(visitor)
  } catch (error) {
    console.error('Register visitor error:', error)
    res.status(500).json({ error: 'Failed to register visitor' })
  }
})

// Get visitor by identifier
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params

    const visitor = await prisma.visitor.findUnique({
      where: { identifier },
      include: {
        visits: {
          orderBy: {
            assignedTime: 'asc'
          }
        }
      }
    })

    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' })
    }

    res.json(visitor)
  } catch (error) {
    console.error('Get visitor error:', error)
    res.status(500).json({ error: 'Failed to get visitor' })
  }
})

// Enter PIN code for clinic
router.post('/:identifier/enter-pin', async (req, res) => {
  try {
    const { identifier } = req.params
    const { pin, clinicId } = req.body

    if (!pin || !clinicId) {
      return res.status(400).json({ error: 'PIN and clinic ID are required' })
    }

    // Get today's code for the clinic
    const today = new Date()
    const todayStart = new Date(today.setHours(0, 0, 0, 0))
    const todayEnd = new Date(today.setHours(23, 59, 59, 999))

    const dailyCode = await prisma.dailyCode.findFirst({
      where: {
        clinicId,
        date: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    })

    if (!dailyCode || dailyCode.code !== pin) {
      return res.status(401).json({ error: 'Invalid PIN code' })
    }

    // Find visitor
    const visitor = await prisma.visitor.findUnique({
      where: { identifier }
    })

    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' })
    }

    // Create visit record
    const visit = await prisma.visit.create({
      data: {
        visitorId: visitor.id,
        clinicId,
        examType: visitor.examType,
        status: 'COMPLETED'
      }
    })

    // Update visitor status and move to next clinic
    const clinicPaths: Record<string, string[]> = {
      RECRUITMENT: ['lab', 'cardiology', 'ophthalmology', 'ent', 'dentistry'],
      PROMOTION: ['lab', 'cardiology', 'ophthalmology'],
      TRANSFER: ['lab', 'cardiology'],
      CONVERSION: ['lab', 'cardiology', 'ophthalmology', 'ent'],
      AVIATION: ['lab', 'cardiology', 'ophthalmology', 'ent', 'dentistry'],
      COOKS: ['lab', 'cardiology', 'ophthalmology']
    }

    const path = clinicPaths[visitor.examType] || []
    const currentIndex = path.indexOf(clinicId)
    const nextIndex = currentIndex + 1

    let updatedVisitor
    if (nextIndex < path.length) {
      // Move to next clinic
      const nextClinic = path[nextIndex]
      const newQueueNumber = Math.floor(Math.random() * 30) + 1

      updatedVisitor = await prisma.visitor.update({
        where: { identifier },
        data: {
          assignedClinic: nextClinic,
          queueNumber: newQueueNumber,
          status: 'IN_PROGRESS'
        }
      })
    } else {
      // All clinics completed
      updatedVisitor = await prisma.visitor.update({
        where: { identifier },
        data: {
          assignedClinic: null,
          queueNumber: null,
          status: 'COMPLETED'
        }
      })
    }

    res.json({
      visit,
      visitor: updatedVisitor,
      isCompleted: nextIndex >= path.length,
      nextClinic: nextIndex < path.length ? path[nextIndex] : null
    })
  } catch (error) {
    console.error('Enter PIN error:', error)
    res.status(500).json({ error: 'Failed to process PIN entry' })
  }
})

// Get queue status for clinic
router.get('/queue/:clinicId', async (req, res) => {
  try {
    const { clinicId } = req.params

    const queueCount = await prisma.visitor.count({
      where: {
        assignedClinic: clinicId,
        status: {
          in: ['WAITING', 'IN_PROGRESS']
        }
      }
    })

    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId }
    })

    res.json({
      clinicId,
      clinic,
      queueCount,
      estimatedWaitTime: queueCount * 5 // 5 minutes per person
    })
  } catch (error) {
    console.error('Get queue status error:', error)
    res.status(500).json({ error: 'Failed to get queue status' })
  }
})

export default router

