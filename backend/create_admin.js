const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('Admin123!', 12)
  
  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash,
      role: 'SUPER_ADMIN'
    }
  })
  
  console.log('Admin user created:', admin)
}

main().finally(() => prisma.$disconnect())
