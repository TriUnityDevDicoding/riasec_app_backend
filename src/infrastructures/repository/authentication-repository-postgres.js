const InvariantError = require('../../commons/exceptions/invariant-error')
const AuthenticationRepository = require('../../domains/authentications/authentication-repository')
const createLog = require('../../infrastructures/logging/winston')

const log = createLog('authentications')

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor(prisma) {
    super()
    this._prisma = prisma
  }

  async addToken(token) {
    const startTime = Date.now()
    await this._prisma.authentication.create({
      data: {
        token
      }
    })

    const durationMs = Date.now() - startTime
    log.info('time needed for add tokens to database', { meta: `duration ${durationMs}ms` })
  }

  async checkAvailabilityToken(token) {
    const startTime = Date.now()
    const result = await this._prisma.authentication.findUnique({
      where: {
        token
      }
    })

    if (!result) {
      log.error('refresh token not found in database')
      throw new InvariantError('refresh token not found in database.')
    }

    const durationMs = Date.now() - startTime
    log.info('time needed for check availability tokens from database', { meta: `duration ${durationMs}ms` })
  }

  async deleteToken(token) {
    const startTime = Date.now()
    await this._prisma.authentication.delete({
      where: {
        token
      }
    })

    const durationMs = Date.now() - startTime
    log.info('time needed for delete tokens from database', { meta: `duration ${durationMs}ms` })
  }
}

module.exports = AuthenticationRepositoryPostgres
