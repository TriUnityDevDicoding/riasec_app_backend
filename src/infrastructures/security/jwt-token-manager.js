const config = require('../../commons/config')
const AuthenticationTokenManager = require('../../applications/security/authentication-token-manager')
const InvariantError = require('../../commons/exceptions/invariant-error')

class JwtTokenManager extends AuthenticationTokenManager {
  constructor(jwt) {
    super()
    this._jwt = jwt
  }

  async createAccessToken(payload) {
    return this._jwt.generate(payload, config.jwt.accessTokenKey)
  }

  async createRefreshToken(payload) {
    return this._jwt.generate(payload, config.jwt.refreshTokenKey)
  }

  async verifyRefreshToken(token) {
    try {
      const artifacts = this._jwt.decode(token)
      this._jwt.verify(artifacts, config.jwt.refreshTokenKey)
    } catch (error) {
      throw new InvariantError('refresh token is not valid.')
    }
  }

  async decodePayload(token) {
    const artifacts = this._jwt.decode(token)
    return artifacts.decoded.payload
  }
}

module.exports = JwtTokenManager
