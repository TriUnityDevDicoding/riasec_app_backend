/* istanbul ignore file */
const prisma = require('../src/infrastructures/database/client/prisma-client')

const UsersTableTestHelper = {
  async addUser ({
    id = 'user-123',
    fullname = 'John Doe',
    email = 'johndoe@email.com',
    password = 'johndoe123',
    dateOfBirth = '2000-03-05',
    gender = 'Male'
  }) {
    await prisma.user.create({
      data: { id, full_name: fullname, email, password, date_of_birth: dateOfBirth, gender }
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
