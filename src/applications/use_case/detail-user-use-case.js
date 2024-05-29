class DetailUserUseCase {
  constructor ({ userRepository, dateOfBirthParse }) {
    this._userRepository = userRepository
    this._dateOfBirthParse = dateOfBirthParse
  }

  async execute (useCasePayload) {
    const { id } = useCasePayload

    const detailUser = await this._userRepository.getUserById(id)
    detailUser.dateOfBirth = await this._dateOfBirthParse.parseToString(detailUser.dateOfBirth)

    return detailUser
  }
}

module.exports = DetailUserUseCase
