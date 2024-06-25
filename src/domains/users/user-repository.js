class UserRepository {
  async addUser (registerUser) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getUserById (id) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getUserByEmail (email) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyAvailableEmail (email) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async editUser (id, updateUser) {
    throw new Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = UserRepository
