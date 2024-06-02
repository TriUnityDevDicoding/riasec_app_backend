/* istanbul ignore file */
const prisma = require('../src/infrastructures/database/client/prisma-client')

const AuthenticationsTableTestHelper = {
  async addToken(token) {
    await prisma.authentication.create({
      data: {
        token
      }
    })
  },

  async findToken(token) {
    const result = await prisma.authentication.findUnique({
      where: {
        token
      },
      select: {
        token: true
      }
    })

    return result
  },
  async cleanTable() {
    await prisma.authentication.deleteMany({ where: {} })
  }
}

module.exports = AuthenticationsTableTestHelper
