const RegisterUser = require('../../domains/users/entities/register-user')

class AddUserUseCase {
  constructor ({ userRepository, passwordHash, dateOfBirthParse }) {
    this._userRepository = userRepository
    this._passwordHash = passwordHash
    this._dateOfBirthParse = dateOfBirthParse
  }

  async execute (useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload)

    await this._userRepository.verifyAvailableEmail(registerUser.email)
    registerUser.password = await this._passwordHash.hash(registerUser.password)
    registerUser.dateOfBirth = await this._dateOfBirthParse.parseToDate(registerUser.dateOfBirth)

    return this._userRepository.addUser(registerUser)
  }
}

module.exports = AddUserUseCase
