/* istanbul ignore file */
const prisma = require('../src/infrastructures/database/client/prisma-client')

const SessionsTableTestHelper = {
  async addSession({
    id = 'session-123',
    quizResultId = 'quiz-result-123',
    owner = 'user-123'
  }) {
    await prisma.session.create({
      data: { id, quiz_result_id: quizResultId, owner }
    })
  },

  async findSessionById(id) {
    const session = await prisma.session.findUnique({
      where: {
        id
      }
    })
    return session
  },

  async cleanTable() {
    await prisma.session.deleteMany({ where: {} })
  }
}

module.exports = SessionsTableTestHelper
