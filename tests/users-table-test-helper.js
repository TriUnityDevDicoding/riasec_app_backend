const prisma = require('../src/infrastructures/database/postgres/prisma-client')

const UsersTableTestHelper = {
  async addUser ({
    id = 'user-123',
    fullname = 'John Doe',
    email = 'johndoe@email.com',
    password = 'johndoe123',
    dateOfBirth = new Date('2000-03-05'),
    gender = 'Male'
  }) {
    await prisma.user.create({
      data: { id, fullname, email, password, date_of_birth: dateOfBirth, gender }
    })
  },

  async findUserById (id) {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })
    return user
  },

  async cleanTable () {
    await prisma.user.deleteMany({ where: {} })
  }
}

module.exports = UsersTableTestHelper
