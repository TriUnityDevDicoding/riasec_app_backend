const AuthorizationCheck = require('../authorization-check')

describe('AuthorizationCheck interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    // Arrange
    const tokenManager = new AuthorizationCheck()

    // Action & Assert
    await expect(tokenManager.verifyRole('')).rejects.toThrow(Error('AUTHORIZATION_CHECK.METHOD_NOT_IMPLEMENTED'))
  })
})
