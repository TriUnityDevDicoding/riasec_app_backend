const PasswordHash = require('../../applications/security/password-hash')

class BcryptPasswordHash extends PasswordHash {
  constructor (bcrypt, saltRound = 10) {
    super()
    this._bcrypt = bcrypt
    this._saltRound = saltRound
  }

  async hash (password) {
    return this._bcrypt.hash(password, this._saltRound)
  }
}

module.exports = BcryptPasswordHash
