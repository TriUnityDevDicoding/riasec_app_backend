class UserRepository {
  async addUser (registerUser) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyAvailableEmail (email) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getPasswordByEmail (email) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = UserRepository
