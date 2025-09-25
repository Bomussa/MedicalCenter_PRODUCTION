import { prisma } from '../index'

function toCsvRow(arr: any[]): string {
  return arr.map(value => {
    const stringValue = String(value ?? '')
    // Escape quotes and wrap in quotes if contains comma, quote, or newline
    if (/[",\n\r]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    return stringValue
  }).join(',') + '\n'
}

export async function buildCsvReport(startDate: Date, endDate: Date): Promise<string> {
  try {
    const visitors = await prisma.visitor.findMany({
      where: {
        visitDate: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        visitDate: 'asc'
      }
    })

    const visits = await prisma.visit.findMany({
      where: {
        visitDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        visitor: {
          select: {
            identifier: true,
            gender: true,
            examType: true
          }
        }
      },
      orderBy: {
        visitDate: 'asc'
      }
    })

    let csv = ''
    
    // Visitors section
    csv += 'Section,Type,Data\n'
    csv += 'Header,Visitors,Generated on ' + new Date().toISOString() + '\n'
    csv += 'Visitors,ID,Identifier,Gender,ExamType,AssignedClinic,QueueNumber,VisitDate,Status\n'
    
    for (const visitor of visitors) {
      csv += toCsvRow([
        'Visitors',
        visitor.id,
        visitor.identifier,
        visitor.gender,
        visitor.examType,
        visitor.assignedClinic || '',
        visitor.queueNumber || '',
        visitor.visitDate.toISOString(),
        visitor.status
      ])
    }
    
    // Visits section
    csv += 'Visits,ID,VisitorID,VisitorIdentifier,ClinicID,ExamType,CodeEntryTime,AssignedTime,VisitDate,Status\n'
    
    for (const visit of visits) {
      csv += toCsvRow([
        'Visits',
        visit.id,
        visit.visitorId,
        visit.visitor.identifier,
        visit.clinicId,
        visit.examType,
        visit.codeEntryTime.toISOString(),
        visit.assignedTime.toISOString(),
        visit.visitDate.toISOString(),
        visit.status
      ])
    }
    
    return csv
  } catch (error) {
    console.error('Error building CSV report:', error)
    throw new Error('Failed to generate CSV report')
  }
}

export async function getReportPreview(startDate: Date, endDate: Date) {
  try {
    const visitors = await prisma.visitor.findMany({
      where: {
        visitDate: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        visitDate: 'desc'
      },
      take: 50 // Limit for preview
    })

    const visits = await prisma.visit.findMany({
      where: {
        visitDate: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        visitor: {
          select: {
            identifier: true,
            gender: true,
            examType: true
          }
        }
      },
      orderBy: {
        visitDate: 'desc'
      },
      take: 50 // Limit for preview
    })

    const stats = {
      totalVisitors: visitors.length,
      totalVisits: visits.length,
      completedVisits: visits.filter(v => v.status === 'COMPLETED').length,
      pendingVisits: visits.filter(v => v.status === 'PENDING').length,
      examTypes: {
        RECRUITMENT: visitors.filter(v => v.examType === 'RECRUITMENT').length,
        PROMOTION: visitors.filter(v => v.examType === 'PROMOTION').length,
        TRANSFER: visitors.filter(v => v.examType === 'TRANSFER').length,
        CONVERSION: visitors.filter(v => v.examType === 'CONVERSION').length,
        AVIATION: visitors.filter(v => v.examType === 'AVIATION').length,
        COOKS: visitors.filter(v => v.examType === 'COOKS').length
      }
    }

    return {
      visitors,
      visits,
      stats,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    }
  } catch (error) {
    console.error('Error getting report preview:', error)
    throw new Error('Failed to get report preview')
  }
}

export async function getAnalytics(days: number = 30) {
  try {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const visitors = await prisma.visitor.findMany({
      where: {
        visitDate: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    const visits = await prisma.visit.findMany({
      where: {
        visitDate: {
          gte: startDate,
          lte: endDate
        }
      }
    })

    // Daily statistics
    const dailyStats = []
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))

      const dayVisitors = visitors.filter(v => 
        v.visitDate >= dayStart && v.visitDate <= dayEnd
      )

      const dayVisits = visits.filter(v => 
        v.visitDate >= dayStart && v.visitDate <= dayEnd
      )

      dailyStats.push({
        date: dayStart.toISOString().split('T')[0],
        visitors: dayVisitors.length,
        visits: dayVisits.length,
        completed: dayVisits.filter(v => v.status === 'COMPLETED').length
      })
    }

    return {
      totalVisitors: visitors.length,
      totalVisits: visits.length,
      completedVisits: visits.filter(v => v.status === 'COMPLETED').length,
      averageVisitsPerDay: Math.round(visits.length / days),
      dailyStats: dailyStats.reverse()
    }
  } catch (error) {
    console.error('Error getting analytics:', error)
    throw new Error('Failed to get analytics')
  }
}

