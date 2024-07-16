const PasswordHash = require('../../applications/security/password-hash')
const AuthenticationError = require('../../commons/exceptions/authentication-error')
const InvariantError = require('../../commons/exceptions/invariant-error')
const createLog = require('../logging/winston')

const log = createLog('login')

class BcryptPasswordHash extends PasswordHash {
  constructor(bcrypt, saltRound = 10) {
    super()
    this._bcrypt = bcrypt
    this._saltRound = saltRound
  }

  async hash(password) {
    return this._bcrypt.hash(password, this._saltRound)
  }

  async compare(password, hashedPassword) {
    const result = await this._bcrypt.compare(password, hashedPassword)

    if (!result) {
      log.error('password comparison failed: the entered password are incorrect')
      throw new AuthenticationError('the credentials you entered are incorrect.')
    }
  }

  async compareSame(password, hashedPassword) {
    const result = await this._bcrypt.compare(password, hashedPassword)

    if (result) {
      throw new InvariantError('the new password cannot be the same as the old password.')
    }
  }
}

module.exports = BcryptPasswordHash
