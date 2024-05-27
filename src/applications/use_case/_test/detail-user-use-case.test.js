const RegisteredUser = require('../../../domains/users/entities/registered-user')
const UserRepository = require('../../../domains/users/user-repository')
const DetailUserUseCase = require('../detail-user-use-case')

describe('ShowUserUseCase', () => {
  it('should orchestrating the show user action correctly', async () => {
    const useCasePayload = {
      id: 'user-123'
    }
    const user = {
      id: useCasePayload.id,
      fullname: 'John Doe',
      email: 'johndoe@email.com',
      dateOfBirth: '2000-03-05',
      gender: 'Male'
    }
    const expectedRegisteredUser = new RegisteredUser({
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender
    })

    const mockUserRepository = new UserRepository()

    mockUserRepository.getUserById = jest.fn(() => Promise.resolve(user))

    const detailUserUseCase = new DetailUserUseCase({
      userRepository: mockUserRepository
    })

    const detailUser = await detailUserUseCase.execute(useCasePayload)

    expect(detailUser).toEqual(expectedRegisteredUser)
    expect(mockUserRepository.getUserById).toHaveBeenCalledWith(useCasePayload.id)
  })
})
