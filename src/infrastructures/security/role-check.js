const AuthorizationCheck = require('../../applications/security/date-of-birth-parse')
const AuthorizationError = require('../../commons/exceptions/authorization-error')

class RoleCheck extends AuthorizationCheck {
  async verifyRole(role) {
    if (role !== 'Admin') {
      throw new AuthorizationError('Unauthorized.')
    }
  }
}

module.exports = RoleCheck
