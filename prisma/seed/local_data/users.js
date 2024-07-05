const prisma = require('../../../src/infrastructures/database/client/prisma-client')
const bcrypt = require('bcrypt')
const { nanoid } = require('nanoid')

const users = async () => {
  const admin = await prisma.user.upsert({
    where: { email: 'riasecadmin@tudev.id' },
    update: {},
    create: {
      id: `user-${nanoid(16)}`,
      full_name: 'Riasec Admin',
      email: 'riasecadmin@tudev.id',
      password: await bcrypt.hash('riasecadmin123', 10),
      date_of_birth: new Date(),
      gender: 'Male',
      role: 'Admin'
    }
  })

  const user = await prisma.user.upsert({
    where: { email: 'riasecuser@tudev.id' },
    update: {},
    create: {
      id: `user-${nanoid(16)}`,
      full_name: 'Riasec User',
      email: 'riasecuser@tudev.id',
      password: await bcrypt.hash('riasecuser123', 10),
      date_of_birth: new Date(),
      gender: 'Female',
      role: 'User'
    }
  })

  console.log({ admin, user })
}

module.exports = users
