import cron from 'node-cron'
import { prisma } from '../index'

// Generate daily codes at 5:00 AM every day
cron.schedule('0 5 * * *', async () => {
  try {
    console.log('🕐 Generating daily codes at 5:00 AM...')
    
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

    // Log the action
    await prisma.auditLog.create({
      data: {
        actor: 'system',
        action: 'auto_generate_daily_codes',
        meta: `Generated ${newCodes.length} codes at 5:00 AM`
      }
    })

    console.log(`✅ Generated ${newCodes.length} daily codes successfully`)
  } catch (error) {
    console.error('❌ Error generating daily codes:', error)
    
    // Log the error
    await prisma.auditLog.create({
      data: {
        actor: 'system',
        action: 'auto_generate_daily_codes_error',
        meta: error instanceof Error ? error.message : 'Unknown error'
      }
    })
  }
}, {
  timezone: 'Asia/Riyadh' // Adjust timezone as needed
})

// Clean up old audit logs (keep only last 30 days) - runs daily at 2:00 AM
cron.schedule('0 2 * * *', async () => {
  try {
    console.log('🧹 Cleaning up old audit logs...')
    
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const deletedCount = await prisma.auditLog.deleteMany({
      where: {
        timestamp: {
          lt: thirtyDaysAgo
        }
      }
    })

    console.log(`✅ Cleaned up ${deletedCount.count} old audit logs`)
    
    // Log the cleanup action
    await prisma.auditLog.create({
      data: {
        actor: 'system',
        action: 'cleanup_audit_logs',
        meta: `Deleted ${deletedCount.count} logs older than 30 days`
      }
    })
  } catch (error) {
    console.error('❌ Error cleaning up audit logs:', error)
  }
}, {
  timezone: 'Asia/Riyadh'
})

// Clean up old visitor data (keep only last 90 days) - runs weekly on Sunday at 3:00 AM
cron.schedule('0 3 * * 0', async () => {
  try {
    console.log('🧹 Cleaning up old visitor data...')
    
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    // Delete old visits first (due to foreign key constraints)
    const deletedVisits = await prisma.visit.deleteMany({
      where: {
        visitDate: {
          lt: ninetyDaysAgo
        }
      }
    })

    // Delete old visitors
    const deletedVisitors = await prisma.visitor.deleteMany({
      where: {
        visitDate: {
          lt: ninetyDaysAgo
        }
      }
    })

    console.log(`✅ Cleaned up ${deletedVisitors.count} old visitors and ${deletedVisits.count} old visits`)
    
    // Log the cleanup action
    await prisma.auditLog.create({
      data: {
        actor: 'system',
        action: 'cleanup_visitor_data',
        meta: `Deleted ${deletedVisitors.count} visitors and ${deletedVisits.count} visits older than 90 days`
      }
    })
  } catch (error) {
    console.error('❌ Error cleaning up visitor data:', error)
  }
}, {
  timezone: 'Asia/Riyadh'
})

// Reset daily statistics at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('🔄 Resetting daily statistics...')
    
    // This is where you could reset any daily counters or statistics
    // For now, we'll just log the reset
    await prisma.auditLog.create({
      data: {
        actor: 'system',
        action: 'daily_reset',
        meta: 'Daily statistics reset at midnight'
      }
    })

    console.log('✅ Daily statistics reset completed')
  } catch (error) {
    console.error('❌ Error resetting daily statistics:', error)
  }
}, {
  timezone: 'Asia/Riyadh'
})

console.log('⏰ Cron jobs initialized:')
console.log('  - Daily codes generation: 5:00 AM')
console.log('  - Audit logs cleanup: 2:00 AM daily')
console.log('  - Visitor data cleanup: 3:00 AM weekly (Sunday)')
console.log('  - Daily statistics reset: 12:00 AM')

