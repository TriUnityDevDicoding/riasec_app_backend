const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const seeds = [
  require('./local_data/users'),
  require('./local_data/questions')
]

const run = async () => {
  if (process.env.NODE_ENV === 'test') {
    console.log('seeding skipped in test environment.')
    return
  }

  for (const seed of seeds) {
    await seed()
  }
}

(async () => {
  try {
    await run()
  } catch (e) {
    console.error('error running seeds:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
