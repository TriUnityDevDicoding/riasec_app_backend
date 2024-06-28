const UpdateUserPassword = require('../../../domains/users/entities/update-user-password')
const UserRepository = require('../../../domains/users/user-repository')
const PasswordHash = require('../../security/password-hash')
const EditUserPasswordUseCase = require('../edit-user-password-use-case')

describe('EditUserPasswordUseCase', () => {
  it('should update user password correctly', async () => {
    const userIdCredentials = 'user-123'
    const useCaseParams = {
      id: 'user-123'
    }
    const useCasePayload = new UpdateUserPassword({
      currentPassword: 'oldPassword',
      newPassword: 'newPassword'
    })

    const mockUserRepository = new UserRepository()
    const mockPasswordHash = new PasswordHash()

    // Mocking userRepository methods
    mockUserRepository.getUserPasswordById = jest.fn(() => Promise.resolve('hashedOldPassword'))
    mockUserRepository.editUserPassword = jest.fn(() => Promise.resolve())

    // Mocking passwordHash methods
    mockPasswordHash.compare = jest.fn(() => Promise.resolve())
    mockPasswordHash.compareSame = jest.fn(() => Promise.resolve())
    mockPasswordHash.hash = jest.fn((password) => Promise.resolve(`hashed_${password}`))

    const editUserPasswordUseCase = new EditUserPasswordUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash
    })

    await editUserPasswordUseCase.execute(useCaseParams, userIdCredentials, useCasePayload)

    // Assertions
    expect(mockUserRepository.getUserPasswordById).toHaveBeenCalledWith('user-123', userIdCredentials)
    expect(mockPasswordHash.compare).toHaveBeenCalledWith('oldPassword', 'hashedOldPassword')
    expect(mockPasswordHash.compareSame).toHaveBeenCalledWith('newPassword', 'hashedOldPassword')
    expect(mockPasswordHash.hash).toHaveBeenCalledWith('newPassword')
    expect(mockUserRepository.editUserPassword).toHaveBeenCalledWith(
      'user-123',
      userIdCredentials,
      'hashed_newPassword'
    )
  })

  it('should handle incorrect current password', async () => {
    const userIdCredentials = 'user-123'
    const useCaseParams = {
      id: 'user-123'
    }
    const useCasePayload = new UpdateUserPassword({
      currentPassword: 'wrongPassword',
      newPassword: 'newPassword'
    })

    const mockUserRepository = new UserRepository()
    const mockPasswordHash = new PasswordHash()

    // Mocking userRepository methods
    mockUserRepository.getUserPasswordById = jest.fn(() => Promise.resolve('hashedOldPassword'))
    mockUserRepository.editUserPassword = jest.fn()

    // Mocking passwordHash methods
    mockPasswordHash.compare = jest.fn(() => {
      throw new Error('Incorrect password')
    })
    mockPasswordHash.compareSame = jest.fn()
    mockPasswordHash.hash = jest.fn()

    const editUserPasswordUseCase = new EditUserPasswordUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash
    })

    await expect(editUserPasswordUseCase.execute(useCaseParams, userIdCredentials, useCasePayload)).rejects.toThrow(
      'Incorrect password'
    )

    // Assertions
    expect(mockUserRepository.getUserPasswordById).toHaveBeenCalledWith('user-123', userIdCredentials)
    expect(mockPasswordHash.compare).toHaveBeenCalledWith('wrongPassword', 'hashedOldPassword')
    expect(mockPasswordHash.compareSame).not.toHaveBeenCalled()
    expect(mockPasswordHash.hash).not.toHaveBeenCalled()
    expect(mockUserRepository.editUserPassword).not.toHaveBeenCalled()
  })
})
