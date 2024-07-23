const SessionRepository = require('../../domains/sessions/session-repository')
const createLog = require('../../infrastructures/logging/winston')

const log = createLog('session')

class SessionRepositoryPostgres extends SessionRepository {
  constructor(prisma, idGenerator) {
    super()
    this._prisma = prisma
    this._idGenerator = idGenerator
  }

  async addSession(credentialId) {
    const startTime = Date.now()
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

    const durationMs = Date.now() - startTime
    log.info('time needed for adding session to database', { meta: `duration ${durationMs}ms` })
    return { id: addedSession.id }
  }

  async putQuizResultId(sessionId, quizResultId) {
    const startTime = Date.now()
    await this._prisma.session.update({
      where: {
        id: sessionId
      },
      data: {
        quiz_result_id: quizResultId
      }
    })

    const durationMs = Date.now() - startTime
    log.info('time needed for updating quiz result on database', { meta: `duration ${durationMs}ms` })
  }
}

module.exports = SessionRepositoryPostgres
