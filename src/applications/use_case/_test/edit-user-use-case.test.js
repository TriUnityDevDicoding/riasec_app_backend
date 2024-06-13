const UpdateUser = require('../../../domains/users/entities/update-user')
const RegisteredUser = require('../../../domains/users/entities/registered-user')
const UserRepository = require('../../../domains/users/user-repository')
const DateofBirthParse = require('../../security/date-of-birth-parse')
const EditUserUseCase = require('../edit-user-use-case')

describe('EditUserUseCase', () => {
  it('should orchestrating the edit user action correctly', async () => {
    const userIdCredentials = 'user-123'
    const dateOfBirthObj = new Date('2000-03-05')
    const useCaseParams = {
      id: 'user-123'
    }
    const useCasePayload = new UpdateUser({
      fullname: 'John Doe',
      dateOfBirth: '2000-03-05',
      gender: 'Male'
    })
    const expectedUpdatedUser = new RegisteredUser({
      id: useCaseParams.id,
      fullname: useCasePayload.fullname,
      email: 'johndoe@email.com',
      dateOfBirth: useCasePayload.dateOfBirth,
      gender: useCasePayload.gender
    })

    const mockUserRepository = new UserRepository()
    const mockDateOfBirthParse = new DateofBirthParse()

    mockDateOfBirthParse.parseToDate = jest.fn(() => Promise.resolve(dateOfBirthObj))
    mockUserRepository.editUser = jest.fn()
      .mockImplementation(() => Promise.resolve({
        id: useCaseParams.id,
        fullname: useCasePayload.fullname,
        email: 'johndoe@email.com',
        dateOfBirth: dateOfBirthObj,
        gender: useCasePayload.gender
      }))
    mockDateOfBirthParse.parseToString = jest.fn(() => Promise.resolve('2000-03-05'))

    const editUserUseCase = new EditUserUseCase({
      userRepository: mockUserRepository,
      dateOfBirthParse: mockDateOfBirthParse
    })

    const editedUser = await editUserUseCase.execute(useCaseParams, userIdCredentials, useCasePayload)

    expect(editedUser).toEqual(expectedUpdatedUser)
    expect(mockDateOfBirthParse.parseToDate).toHaveBeenCalledWith(useCasePayload.dateOfBirth)
    expect(mockUserRepository.editUser).toHaveBeenCalledWith(useCaseParams.id, userIdCredentials, {
      fullname: useCasePayload.fullname,
      dateOfBirth: dateOfBirthObj,
      gender: useCasePayload.gender
    })
    expect(mockDateOfBirthParse.parseToString).toHaveBeenCalledWith(dateOfBirthObj)
  })
})
