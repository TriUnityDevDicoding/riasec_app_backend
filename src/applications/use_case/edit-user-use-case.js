const UpdateUser = require('../../domains/users/entities/update-user')

class EditUserUseCase {
  constructor ({ userRepository, dateOfBirthParse }) {
    this._userRepository = userRepository
    this._dateOfBirthParse = dateOfBirthParse
  }

  async execute (useCaseParams, userIdCredentials, useCasePayload) {
    const { id } = useCaseParams
    const updateUser = new UpdateUser(useCasePayload)

    updateUser.dateOfBirth = await this._dateOfBirthParse.parseToDate(updateUser.dateOfBirth)
    const editedUser = await this._userRepository.editUser(id, userIdCredentials, updateUser)
    editedUser.dateOfBirth = await this._dateOfBirthParse.parseToString(editedUser.dateOfBirth)

    return editedUser
  }
}

module.exports = EditUserUseCase
