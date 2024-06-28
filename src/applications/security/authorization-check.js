class AuthorizationCheck {
  async verifyRole(role) {
    throw new Error('AUTHORIZATION_CHECK.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = AuthorizationCheck
