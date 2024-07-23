const AuthorizationCheck = require('../../applications/security/date-of-birth-parse')
const AuthorizationError = require('../../commons/exceptions/authorization-error')
const createLog = require('../../infrastructures/logging/winston')

const log = createLog('questions')

class RoleCheck extends AuthorizationCheck {
  async verifyRole(role) {
    if (role !== 'Admin') {
      log.error('unauthorized to create questions, you need to be an admin to add questions')
      throw new AuthorizationError('Unauthorized.')
    }
  }
}

module.exports = RoleCheck
