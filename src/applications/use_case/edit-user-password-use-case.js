const UpdateUserPassword = require('../../domains/users/entities/update-user-password')

class EditUserPasswordUseCase {
  constructor ({ userRepository, passwordHash }) {
    this._userRepository = userRepository
    this._passwordHash = passwordHash
  }

  async execute (useCaseParams, userIdCredentials, useCasePayload) {
    const { id } = useCaseParams
    const { currentPassword, newPassword } = new UpdateUserPassword(useCasePayload)
    const userPassword = await this._userRepository.getUserPasswordById(id, userIdCredentials)
    await this._passwordHash.compare(currentPassword, userPassword)
    await this._passwordHash.compareSame(newPassword, userPassword)
    const hashedNewPassword = await this._passwordHash.hash(newPassword)
    await this._userRepository.editUserPassword(id, userIdCredentials, hashedNewPassword)
  }
}

module.exports = EditUserPasswordUseCase
