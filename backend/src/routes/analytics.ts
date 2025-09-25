import { Router } from 'express'
import { prisma } from '../index'
import { requireAuth, requireRole } from '../middleware/auth'

const router = Router()

// All analytics routes require authentication
router.use(requireAuth)

// Get real-time statistics
router.get('/realtime', requireRole('ADMIN'), async (req, res) => {
  try {
    const today = new Date()
    const todayStart = new Date(today.setHours(0, 0, 0, 0))
    const todayEnd = new Date(today.setHours(23, 59, 59, 999))

    const [
      visitorsToday,
      visitsToday,
      completedToday,
      pendingToday,
      clinicStats
    ] = await Promise.all([
      prisma.visitor.count({
        where: {
          visitDate: {
            gte: todayStart,
            lte: todayEnd
          }
        }
      }),
      prisma.visit.count({
        where: {
          visitDate: {
            gte: todayStart,
            lte: todayEnd
          }
        }
      }),
      prisma.visit.count({
        where: {
          visitDate: {
            gte: todayStart,
            lte: todayEnd
          },
          status: 'COMPLETED'
        }
      }),
      prisma.visitor.count({
        where: {
          visitDate: {
            gte: todayStart,
            lte: todayEnd
          },
          status: {
            in: ['WAITING', 'IN_PROGRESS']
          }
        }
      }),
      prisma.clinic.findMany({
        select: {
          id: true,
          name: true,
          status: true
        }
      })
    ])

    // Get queue counts for each clinic
    const clinicQueues = await Promise.all(
      clinicStats.map(async (clinic) => {
        const queueCount = await prisma.visitor.count({
          where: {
            assignedClinic: clinic.id,
            status: {
              in: ['WAITING', 'IN_PROGRESS']
            }
          }
        })

        return {
          ...clinic,
          queueCount
        }
      })
    )

    res.json({
      visitorsToday,
      visitsToday,
      completedToday,
      pendingToday,
      clinics: clinicQueues,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Realtime analytics error:', error)
    res.status(500).json({ error: 'Failed to get realtime analytics' })
  }
})

// Get hourly statistics for today
router.get('/hourly', requireRole('ADMIN'), async (req, res) => {
  try {
    const today = new Date()
    const todayStart = new Date(today.setHours(0, 0, 0, 0))

    const hourlyStats = []
    
    for (let hour = 0; hour < 24; hour++) {
      const hourStart = new Date(todayStart)
      hourStart.setHours(hour, 0, 0, 0)
      
      const hourEnd = new Date(todayStart)
      hourEnd.setHours(hour, 59, 59, 999)

      const [visitors, visits, completed] = await Promise.all([
        prisma.visitor.count({
          where: {
            visitDate: {
              gte: hourStart,
              lte: hourEnd
            }
          }
        }),
        prisma.visit.count({
          where: {
            visitDate: {
              gte: hourStart,
              lte: hourEnd
            }
          }
        }),
        prisma.visit.count({
          where: {
            visitDate: {
              gte: hourStart,
              lte: hourEnd
            },
            status: 'COMPLETED'
          }
        })
      ])

      hourlyStats.push({
        hour,
        visitors,
        visits,
        completed
      })
    }

    res.json(hourlyStats)
  } catch (error) {
    console.error('Hourly analytics error:', error)
    res.status(500).json({ error: 'Failed to get hourly analytics' })
  }
})

// Get exam type distribution
router.get('/exam-types', requireRole('ADMIN'), async (req, res) => {
  try {
    const { days = '7' } = req.query as { days?: string }
    const daysNumber = parseInt(days)

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysNumber)

    const examTypeStats = await prisma.visitor.groupBy({
      by: ['examType'],
      where: {
        visitDate: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        examType: true
      }
    })

    const formattedStats = examTypeStats.map(stat => ({
      examType: stat.examType,
      count: stat._count.examType,
      percentage: 0 // Will be calculated on frontend
    }))

    const total = formattedStats.reduce((sum, stat) => sum + stat.count, 0)
    formattedStats.forEach(stat => {
      stat.percentage = total > 0 ? Math.round((stat.count / total) * 100) : 0
    })

    res.json({
      stats: formattedStats,
      total,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days: daysNumber
      }
    })
  } catch (error) {
    console.error('Exam types analytics error:', error)
    res.status(500).json({ error: 'Failed to get exam types analytics' })
  }
})

// Get clinic performance
router.get('/clinic-performance', requireRole('ADMIN'), async (req, res) => {
  try {
    const { days = '7' } = req.query as { days?: string }
    const daysNumber = parseInt(days)

    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - daysNumber)

    const clinicStats = await prisma.visit.groupBy({
      by: ['clinicId'],
      where: {
        visitDate: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        clinicId: true
      },
      _avg: {
        id: true // This is a placeholder for average processing time
      }
    })

    // Get clinic details
    const clinics = await prisma.clinic.findMany()
    const clinicMap = new Map(clinics.map(c => [c.id, c]))

    const performanceStats = clinicStats.map(stat => {
      const clinic = clinicMap.get(stat.clinicId)
      return {
        clinicId: stat.clinicId,
        clinicName: clinic?.name || 'Unknown',
        totalVisits: stat._count.clinicId,
        averageProcessingTime: Math.floor(Math.random() * 15) + 5, // Mock data
        efficiency: Math.floor(Math.random() * 30) + 70 // Mock efficiency percentage
      }
    })

    res.json({
      stats: performanceStats,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        days: daysNumber
      }
    })
  } catch (error) {
    console.error('Clinic performance analytics error:', error)
    res.status(500).json({ error: 'Failed to get clinic performance analytics' })
  }
})

export default router

