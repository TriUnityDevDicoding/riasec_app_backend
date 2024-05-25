class DetailUserUseCase {
  constructor ({ userRepository }) {
    this._userRepository = userRepository
  }

  async execute (useCasePayload) {
    const { id } = useCasePayload

    const detailUser = await this._userRepository.getUserById(id)

    return detailUser
  }
}

module.exports = DetailUserUseCase
