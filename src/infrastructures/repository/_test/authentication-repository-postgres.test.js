const InvariantError = require('../../../commons/exceptions/invariant-error')
const AuthenticationsTableTestHelper = require('../../../../tests/authentications-table-test-helper')
const prisma = require('../../database/client/prisma-client')
const AuthenticationRepositoryPostgres = require('../authentication-repository-postgres')

describe('AuthenticationRepository postgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('addToken function', () => {
    it('should add token to database', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(prisma)
      const token = 'token'

      // Action
      await authenticationRepository.addToken(token)

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token)
      expect(tokens).not.toEqual(null)
      expect(tokens.token).toBe(token)
    })
  })

  describe('checkAvailabilityToken function', () => {
    it('should throw InvariantError if token not available', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(prisma)
      const token = 'token'

      // Action & Assert
      await expect(authenticationRepository.checkAvailabilityToken(token))
        .rejects.toThrow(InvariantError)
    })

    it('should not throw InvariantError if token available', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(prisma)
      const token = 'token'
      await AuthenticationsTableTestHelper.addToken(token)

      // Action & Assert
      await expect(authenticationRepository.checkAvailabilityToken(token))
        .resolves.not.toThrow(InvariantError)
    })
  })

  describe('deleteToken', () => {
    it('should delete token from database', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(prisma)
      const token = 'token'
      await AuthenticationsTableTestHelper.addToken(token)

      // Action
      await authenticationRepository.deleteToken(token)

      // Assert
      const tokens = await AuthenticationsTableTestHelper.findToken(token)
      expect(tokens).toEqual(null)
    })
  })
})
