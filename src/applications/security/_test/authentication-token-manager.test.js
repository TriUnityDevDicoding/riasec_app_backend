const AuthenticationTokenManager = require('../authentication-token-manager')

describe('AuthenticationTokenManager interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const tokenManager = new AuthenticationTokenManager()

    // Action & Assert
    await expect(tokenManager.createAccessToken('')).rejects.toThrow(Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'))
    await expect(tokenManager.createRefreshToken('')).rejects.toThrow(Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'))
    await expect(tokenManager.verifyRefreshToken('')).rejects.toThrow(Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'))
    await expect(tokenManager.decodePayload('')).rejects.toThrow(Error('AUTHENTICATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED'))
  })
})
