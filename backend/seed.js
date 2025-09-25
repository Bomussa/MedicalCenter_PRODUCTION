const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Create clinics
  const clinics = [
    { id: 'lab', name: 'المختبر', floor: 'الميزانين', doctorName: 'د. أحمد محمد' },
    { id: 'cardiology', name: 'القلب', floor: 'الطابق الثاني', doctorName: 'د. سارة أحمد' },
    { id: 'ophthalmology', name: 'العيون', floor: 'الطابق الثاني', doctorName: 'د. محمد علي' },
    { id: 'ent', name: 'الأنف والأذن والحنجرة', floor: 'الطابق الثاني', doctorName: 'د. فاطمة حسن' },
    { id: 'dentistry', name: 'الأسنان', floor: 'الطابق الثالث', doctorName: 'د. عمر خالد' }
  ]

  for (const clinic of clinics) {
    await prisma.clinic.upsert({
      where: { id: clinic.id },
      update: clinic,
      create: clinic
    })
  }

  console.log('✅ Clinics seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
