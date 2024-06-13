const Jwt = require('@hapi/jwt')
const config = require('../../../commons/config')
const InvariantError = require('../../../commons/exceptions/invariant-error')
const JwtTokenManager = require('../jwt-token-manager')

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        email: 'johndoe@email.com'
      }
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token')
      }
      const jwtTokenManager = new JwtTokenManager(mockJwtToken)

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload)

      // Assert
      expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, config.jwt.accessTokenKey)
      expect(accessToken).toEqual('mock_token')
    })
  })

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        email: 'johndoe@email.com'
      }
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token')
      }
      const jwtTokenManager = new JwtTokenManager(mockJwtToken)

      // Action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload)

      // Assert
      expect(mockJwtToken.generate).toHaveBeenCalledWith(payload, config.jwt.refreshTokenKey)
      expect(refreshToken).toEqual('mock_token')
    })
  })

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({ email: 'johndoe@email.com' })

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken))
        .rejects
        .toThrow(InvariantError)
    })

    it('should not throw InvariantError when refresh token verified', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const refreshToken = await jwtTokenManager.createRefreshToken({ email: 'johndoe@email.com' })

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves
        .not.toThrow(InvariantError)
    })
  })

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({ email: 'johndoe@email.com' })

      // Action
      const { email: expectedEmail } = await jwtTokenManager.decodePayload(accessToken)

      // Action & Assert
      expect(expectedEmail).toEqual('johndoe@email.com')
    })
  })
})
