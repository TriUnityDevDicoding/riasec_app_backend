const RegisterUser = require('../../../domains/users/entities/register-user')
const UserRepository = require('../../../domains/users/user-repository')
const PasswordHash = require('../../security/password-hash')
const DateofBirthParse = require('../../security/date-of-birth-parse')
const AddUserUseCase = require('../add-user-use-case')

describe('AddUserUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    const dateOfBirthObj = new Date('2000-03-05')
    const useCasePayload = new RegisterUser({
      fullname: 'John Doe',
      email: 'johndoe@email.com',
      password: 'johndoe123',
      dateOfBirth: '2000-03-05',
      gender: 'Male',
      role: 'User'
    })
    const addedUser = {
      id: 'user-123'
    }

    const mockUserRepository = new UserRepository()
    const mockPasswordHash = new PasswordHash()
    const mockDateOfBirthParse = new DateofBirthParse()

    mockUserRepository.verifyAvailableEmail = jest.fn(() => Promise.resolve())
    mockPasswordHash.hash = jest.fn(() => Promise.resolve('encrypted_password'))
    mockDateOfBirthParse.parseToDate = jest.fn(() => Promise.resolve(dateOfBirthObj))
    mockUserRepository.addUser = jest.fn(() => Promise.resolve({ id: addedUser.id }))

    const addUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      dateOfBirthParse: mockDateOfBirthParse
    })

    const registeredUser = await addUserUseCase.execute(useCasePayload)

    expect(registeredUser).toStrictEqual(addedUser)
    expect(mockUserRepository.verifyAvailableEmail).toHaveBeenCalledWith(useCasePayload.email)
    expect(mockPasswordHash.hash).toHaveBeenCalledWith(useCasePayload.password)
    expect(mockDateOfBirthParse.parseToDate).toHaveBeenCalledWith(useCasePayload.dateOfBirth)
    expect(mockUserRepository.addUser).toHaveBeenCalledWith({
      fullname: useCasePayload.fullname,
      email: useCasePayload.email,
      password: 'encrypted_password',
      dateOfBirth: dateOfBirthObj,
      gender: useCasePayload.gender,
      role: useCasePayload.role
    })
  })
})
