const AuthenticationRepository = require('../authentication-repository')

describe('AuthenticationRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const authenticationRepository = new AuthenticationRepository()

    // Action & Assert
    await expect(authenticationRepository.addToken('')).rejects.toThrow(Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
    await expect(authenticationRepository.checkAvailabilityToken('')).rejects.toThrow(Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
    await expect(authenticationRepository.deleteToken('')).rejects.toThrow(Error('AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
  })
})
