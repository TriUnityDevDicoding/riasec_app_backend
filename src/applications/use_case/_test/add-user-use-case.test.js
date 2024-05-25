const RegisterUser = require('../../../domains/users/entities/register-user')
const RegisteredUser = require('../../../domains/users/entities/registered-user')
const UserRepository = require('../../../domains/users/user-repository')
const PasswordHash = require('../../security/password-hash')
const AddUserUseCase = require('../add-user-use-case')

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const useCasePayload = {
      fullname: 'John Doe',
      email: 'johndoe@email.com',
      password: 'johndoe123',
      dateOfBirth: new Date('2000-03-05'),
      gender: 'Male'
    }
    const mockRegisteredUser = new RegisteredUser({
      id: 'user-123',
      fullname: useCasePayload.fullname,
      email: useCasePayload.email,
      dateOfBirth: useCasePayload.dateOfBirth,
      gender: useCasePayload.gender
    })

    const mockUserRepository = new UserRepository()
    const mockPasswordHash = new PasswordHash()

    mockUserRepository.verifyAvailableEmail = jest.fn(() => Promise.resolve())
    mockPasswordHash.hash = jest.fn(() => Promise.resolve('encrypted_password'))
    mockUserRepository.addUser = jest.fn()
      .mockImplementation(() => Promise.resolve(
        new RegisteredUser({
          id: 'user-123',
          fullname: useCasePayload.fullname,
          email: useCasePayload.email,
          dateOfBirth: useCasePayload.dateOfBirth,
          gender: useCasePayload.gender
        })
      ))

    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash
    })

    const registeredUser = await addUserUseCase.execute(useCasePayload)

    expect(registeredUser).toStrictEqual(mockRegisteredUser)
    expect(mockUserRepository.verifyAvailableEmail).toHaveBeenCalledWith(useCasePayload.email)
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password)
    expect(mockUserRepository.addUser).toHaveBeenCalledWith(new RegisterUser({
      fullname: useCasePayload.fullname,
      email: useCasePayload.email,
      password: 'encrypted_password',
      dateOfBirth: useCasePayload.dateOfBirth,
      gender: useCasePayload.gender
    }))
  })
})
