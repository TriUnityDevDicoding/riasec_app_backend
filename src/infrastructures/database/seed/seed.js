/* istanbul ignore file */
const prisma = require('../client/prisma-client')

const seeds = [
  require('./local_data/users'),
  require('./local_data/questions')
]

const run = async () => {
  for (const seed of seeds) {
    await seed()
  }
}

(async () => {
  try {
    await run()
    console.log('seeding completed successfully.')
  } catch (e) {
    console.error('error running seeds:', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
