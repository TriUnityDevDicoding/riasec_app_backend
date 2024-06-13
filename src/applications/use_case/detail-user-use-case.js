const RegisteredUser = require('../../domains/users/entities/registered-user')

class DetailUserUseCase {
  constructor ({ userRepository, dateOfBirthParse }) {
    this._userRepository = userRepository
    this._dateOfBirthParse = dateOfBirthParse
  }

  async execute (useCaseParams, userIdCredentials) {
    const { id } = useCaseParams

    const detailUser = await this._userRepository.getUserById(id, userIdCredentials)
    detailUser.dateOfBirth = await this._dateOfBirthParse.parseToString(detailUser.dateOfBirth)

    return new RegisteredUser(detailUser)
  }
}

module.exports = DetailUserUseCase
