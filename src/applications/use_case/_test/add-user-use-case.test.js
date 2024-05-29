const RegisterUser = require('../../../domains/users/entities/register-user')
const RegisteredUser = require('../../../domains/users/entities/registered-user')
const UserRepository = require('../../../domains/users/user-repository')
const PasswordHash = require('../../security/password-hash')
const DateofBirthParse = require('../../security/date-of-birth-parse')
const AddUserUseCase = require('../add-user-use-case')

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const useCasePayload = {
      fullname: 'John Doe',
      email: 'johndoe@email.com',
      password: 'johndoe123',
      dateOfBirth: '2000-03-05',
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
    const mockDateofBirthParse = new DateofBirthParse()

    mockDateofBirthParse.parseToDate = jest.fn(() => Promise.resolve('2000-03-05'))
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
      passwordHash: mockPasswordHash,
      dateOfBirthParse: mockDateofBirthParse
    })

    const registeredUser = await addUserUseCase.execute(useCasePayload)

    expect(registeredUser).toStrictEqual(mockRegisteredUser)
    expect(mockDateofBirthParse.parseToDate).toHaveBeenCalledWith(useCasePayload.dateOfBirth)
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
