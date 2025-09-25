import { Request, Response } from 'express'
import { prisma } from '../index'
import { AuthenticatedRequest } from '../middleware/auth'
import { buildCsvReport, getReportPreview, getAnalytics } from '../services/reportService'

export async function getDashboardStats(req: AuthenticatedRequest, res: Response) {
  try {
    const today = new Date()
    const todayStart = new Date(today.setHours(0, 0, 0, 0))
    const todayEnd = new Date(today.setHours(23, 59, 59, 999))

    const [
      totalVisitorsToday,
      completedVisitsToday,
      pendingVisitsToday,
      totalClinics,
      activeClinics,
      totalUsers
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
          },
          status: 'COMPLETED'
        }
      }),
      prisma.visit.count({
        where: {
          visitDate: {
            gte: todayStart,
            lte: todayEnd
          },
          status: 'PENDING'
        }
      }),
      prisma.clinic.count(),
      prisma.clinic.count({
        where: {
          status: 'ACTIVE'
        }
      }),
      prisma.user.count()
    ])

    // Calculate average wait time (mock for now)
    const averageWaitTime = Math.floor(Math.random() * 20) + 5

    res.json({
      totalVisitorsToday,
      completedVisitsToday,
      pendingVisitsToday,
      averageWaitTime,
      totalClinics,
      activeClinics,
      totalUsers,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ error: 'Failed to get dashboard stats' })
  }
}

export async function getCsvReport(req: AuthenticatedRequest, res: Response) {
  try {
    const { startDate, endDate } = req.query as { startDate: string; endDate: string }

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' })
    }

    const csv = await buildCsvReport(start, end)

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="medical_center_report_${startDate}_${endDate}.csv"`)
    res.send(csv)
  } catch (error) {
    console.error('CSV report error:', error)
    res.status(500).json({ error: 'Failed to generate CSV report' })
  }
}

export async function getReportPreviewData(req: AuthenticatedRequest, res: Response) {
  try {
    const { startDate, endDate } = req.query as { startDate: string; endDate: string }

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' })
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' })
    }

    const preview = await getReportPreview(start, end)
    res.json(preview)
  } catch (error) {
    console.error('Report preview error:', error)
    res.status(500).json({ error: 'Failed to get report preview' })
  }
}

export async function getAnalyticsData(req: AuthenticatedRequest, res: Response) {
  try {
    const { days } = req.query as { days?: string }
    const daysNumber = days ? parseInt(days) : 30

    if (isNaN(daysNumber) || daysNumber < 1 || daysNumber > 365) {
      return res.status(400).json({ error: 'Days must be between 1 and 365' })
    }

    const analytics = await getAnalytics(daysNumber)
    res.json(analytics)
  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ error: 'Failed to get analytics' })
  }
}

export async function getDailyCodes(req: AuthenticatedRequest, res: Response) {
  try {
    const today = new Date()
    const todayStart = new Date(today.setHours(0, 0, 0, 0))
    const todayEnd = new Date(today.setHours(23, 59, 59, 999))

    const codes = await prisma.dailyCode.findMany({
      where: {
        date: {
          gte: todayStart,
          lte: todayEnd
        }
      }
    })

    res.json(codes)
  } catch (error) {
    console.error('Daily codes error:', error)
    res.status(500).json({ error: 'Failed to get daily codes' })
  }
}

export async function generateNewCodes(req: AuthenticatedRequest, res: Response) {
  try {
    // Get all active clinics
    const clinics = await prisma.clinic.findMany({
      where: {
        status: 'ACTIVE'
      }
    })

    const today = new Date()
    const todayStart = new Date(today.setHours(0, 0, 0, 0))

    // Delete existing codes for today
    await prisma.dailyCode.deleteMany({
      where: {
        date: {
          gte: todayStart
        }
      }
    })

    // Generate new codes
    const newCodes = []
    for (const clinic of clinics) {
      const code = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')
      
      const dailyCode = await prisma.dailyCode.create({
        data: {
          clinicId: clinic.id,
          code,
          date: todayStart
        }
      })
      
      newCodes.push(dailyCode)
    }

    await prisma.auditLog.create({
      data: {
        actor: req.user?.username || 'unknown',
        action: 'generate_daily_codes',
        meta: `Generated ${newCodes.length} codes`
      }
    })

    res.json(newCodes)
  } catch (error) {
    console.error('Generate codes error:', error)
    res.status(500).json({ error: 'Failed to generate new codes' })
  }
}

export async function getAuditLogs(req: AuthenticatedRequest, res: Response) {
  try {
    const { page = '1', limit = '50' } = req.query as { page?: string; limit?: string }
    
    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)
    
    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ error: 'Invalid page or limit parameters' })
    }

    const skip = (pageNumber - 1) * limitNumber

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        orderBy: {
          timestamp: 'desc'
        },
        skip,
        take: limitNumber
      }),
      prisma.auditLog.count()
    ])

    res.json({
      logs,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber)
      }
    })
  } catch (error) {
    console.error('Audit logs error:', error)
    res.status(500).json({ error: 'Failed to get audit logs' })
  }
}

