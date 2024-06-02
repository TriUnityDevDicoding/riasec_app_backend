const UpdateUser = require('../../domains/users/entities/update-user')

class EditUserUseCase {
  constructor ({ userRepository, passwordHash, dateOfBirthParse }) {
    this._userRepository = userRepository
    this._passwordHash = passwordHash
    this._dateOfBirthParse = dateOfBirthParse
  }

  async execute (useCaseParams, useCasePayload) {
    const { id } = useCaseParams
    const updateUser = new UpdateUser(useCasePayload)

    updateUser.password = await this._passwordHash.hash(updateUser.password)
    updateUser.dateOfBirth = await this._dateOfBirthParse.parseToDate(updateUser.dateOfBirth)
    const editedUser = await this._userRepository.editUser(id, useCasePayload)
    editedUser.dateOfBirth = await this._dateOfBirthParse.parseToString(editedUser.dateOfBirth)

    return editedUser
  }
}

module.exports = EditUserUseCase
