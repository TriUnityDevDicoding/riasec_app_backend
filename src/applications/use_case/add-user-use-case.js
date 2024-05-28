const RegisterUser = require('../../domains/users/entities/register-user')

class AddUserUseCase {
  constructor ({ userRepository, passwordHash }) {
    this._userRepository = userRepository
    this._passwordHash = passwordHash
  }

  async execute (useCasePayload) {
    useCasePayload.dateOfBirth = new Date(useCasePayload.dateOfBirth)
    const registerUser = new RegisterUser(useCasePayload)

    await this._userRepository.verifyAvailableEmail(registerUser.email)
    registerUser.password = await this._passwordHash.hash(registerUser.password)

    return this._userRepository.addUser(registerUser)
  }
}

module.exports = AddUserUseCase
