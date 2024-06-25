const SessionRepository = require('../../domains/sessions/session-repository')

class SessionRepositoryPostgres extends SessionRepository {
  constructor(prisma, idGenerator) {
    super()
    this._prisma = prisma
    this._idGenerator = idGenerator
  }

  async addSession(credentialId) {
    const id = `session-${this._idGenerator()}`

    const addedSession = await this._prisma.session.create({
      data: {
        id,
        owner_relation: {
          connect: {
            id: credentialId
          }
        }
      }
    })

    return { id: addedSession.id }
  }

  async putQuizResultId(sessionId, quizResultId) {
    await this._prisma.session.update({
      where: {
        id: sessionId
      },
      data: {
        quiz_result_id: quizResultId
      }
    })
  }
}

module.exports = SessionRepositoryPostgres
