const InvariantError = require('../../commons/exceptions/invariant-error')
const AuthenticationRepository = require('../../domains/authentications/authentication-repository')

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor(prisma) {
    super()
    this._prisma = prisma
  }

  async addToken(token) {
    await this._prisma.authentication.create({
      data: {
        token
      }
    })
  }

  async checkAvailabilityToken(token) {
    const result = await this._prisma.authentication.findUnique({
      where: {
        token
      }
    })

    if (!result) {
      throw new InvariantError('refresh token not found in database.')
    }
  }

  async deleteToken(token) {
    await this._prisma.authentication.delete({
      where: {
        token
      }
    })
  }
}

module.exports = AuthenticationRepositoryPostgres
