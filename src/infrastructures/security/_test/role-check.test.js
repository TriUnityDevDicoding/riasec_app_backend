const RoleCheck = require('../role-check')
const AuthorizationError = require('../../../commons/exceptions/authorization-error')

describe('RoleCheck', () => {
  describe('verifyRole function', () => {
    it('should throw authorization error when role is not Admin', async () => {
      // Arrange
      const roleCheck = new RoleCheck()

      // Act & Assert
      await expect(roleCheck.verifyRole('User')).rejects.toThrow(AuthorizationError)
    })

    it('should not throw authorization error when role is Admin', async () => {
      // Arrange
      const roleCheck = new RoleCheck()

      // Act & Assert
      await expect(roleCheck.verifyRole('Admin')).resolves.not.toThrow(AuthorizationError)
    })
  })
})
