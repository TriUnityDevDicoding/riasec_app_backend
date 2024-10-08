const UserRepository = require('../user-repository')

describe('UserRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const userRepository = new UserRepository()

    await expect(userRepository.addUser({})).rejects.toThrow(Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
    await expect(userRepository.getUserById('')).rejects.toThrow(Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
    await expect(userRepository.getUserByEmail('')).rejects.toThrow(Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
    await expect(userRepository.verifyAvailableEmail('')).rejects.toThrow(Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
    await expect(userRepository.editUser({})).rejects.toThrow(Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
    await expect(userRepository.editUserPassword({})).rejects.toThrow(Error('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED'))
  })
})
