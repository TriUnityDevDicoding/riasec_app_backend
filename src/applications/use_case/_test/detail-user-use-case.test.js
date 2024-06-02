const RegisteredUser = require('../../../domains/users/entities/registered-user')
const UserRepository = require('../../../domains/users/user-repository')
const DateOfBirthParse = require('../../security/date-of-birth-parse')
const DetailUserUseCase = require('../detail-user-use-case')

describe('DetailUserUseCase', () => {
  it('should orchestrating the detail user action correctly', async () => {
    const dateOfBirthObj = new Date('2000-03-05')
    const useCasePayload = {
      id: 'user-123'
    }
    const userPayloadInDatabase = {
      id: 'user-123',
      fullname: 'John Doe',
      email: 'johndoe@email.com',
      dateOfBirth: dateOfBirthObj,
      gender: 'Male'
    }
    const expectedDetailUser = new RegisteredUser({
      id: userPayloadInDatabase.id,
      fullname: userPayloadInDatabase.fullname,
      email: userPayloadInDatabase.email,
      dateOfBirth: '2000-03-05',
      gender: userPayloadInDatabase.gender
    })

    const mockUserRepository = new UserRepository()
    const mockDateOfBirthParse = new DateOfBirthParse()

    mockUserRepository.getUserById = jest.fn(() => Promise.resolve(userPayloadInDatabase))
    mockDateOfBirthParse.parseToString = jest.fn(() => Promise.resolve('2000-03-05'))

    const detailUserUseCase = new DetailUserUseCase({
      userRepository: mockUserRepository,
      dateOfBirthParse: mockDateOfBirthParse
    })

    const detailUser = await detailUserUseCase.execute(useCasePayload)

    expect(detailUser).toEqual(expectedDetailUser)
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(useCasePayload.id)
    expect(mockDateOfBirthParse.parseToString).toHaveBeenCalledWith(dateOfBirthObj)
  })
})
