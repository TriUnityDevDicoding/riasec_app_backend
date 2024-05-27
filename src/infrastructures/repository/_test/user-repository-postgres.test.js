const UsersTableTestHelper = require('../../../../tests/users-table-test-helper')
const InvariantError = require('../../../commons/exceptions/invariant-error')
const NotFoundError = require('../../../commons/exceptions/not-found-error')
const RegisterUser = require('../../../domains/users/entities/register-user')
const RegisteredUser = require('../../../domains/users/entities/registered-user')
const prisma = require('../../database/client/prisma-client')
const UserRepositoryPostgres = require('../user-repository-postgres')

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('addUser function', () => {
    it('should persist register user and return registered user correctly', async () => {
      const registerUser = new RegisterUser({
        fullname: 'John Doe',
        email: 'johndoe@email.com',
        password: 'johndoe123',
        dateOfBirth: '2000-03-05',
        gender: 'Male'
      })
      const fakeIdGenerator = () => '123'
      const userRepositoryPostgres = new UserRepositoryPostgres(prisma, fakeIdGenerator)

      const registeredUser = await userRepositoryPostgres.addUser(registerUser)

      const findUser = await UsersTableTestHelper.findUserById(registeredUser.id)
      expect(findUser.id).toStrictEqual(registeredUser.id)
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        fullname: 'John Doe',
        email: 'johndoe@email.com',
        dateOfBirth: '2000-03-05',
        gender: 'Male'
      }))
    })
  })

  describe('getUserById function', () => {
    it('should throw NotFoundError when user not found', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(prisma, {})

      return expect(userRepositoryPostgres.getUserById('user-123')).rejects.toThrow(NotFoundError)
    })

    it('should run function getUserById correctly and return expected properties', async () => {
      const user = {
        id: 'user-123',
        fullname: 'John Doe',
        email: 'johndoe@email.com',
        dateOfBirth: '2000-03-05',
        gender: 'Male'
      }
      await UsersTableTestHelper.addUser({ ...user })
      const userRepositoryPostgres = new UserRepositoryPostgres(prisma, {})

      const detailUser = await userRepositoryPostgres.getUserById(user.id)

      expect(detailUser.id).toStrictEqual(user.id)
      expect(detailUser.fullname).toStrictEqual(user.fullname)
      expect(detailUser.email).toStrictEqual(user.email)
      expect(detailUser.dateOfBirth).toStrictEqual(user.dateOfBirth)
      expect(detailUser.gender).toStrictEqual(user.gender)
      expect(detailUser).toHaveProperty('id')
      expect(detailUser).toHaveProperty('fullname')
      expect(detailUser).toHaveProperty('email')
      expect(detailUser).toHaveProperty('dateOfBirth')
      expect(detailUser).toHaveProperty('gender')
    })
  })

  describe('verifyAvailableEmail function', () => {
    it('should throw InvariantError when email not available', async () => {
      await UsersTableTestHelper.addUser({ email: 'johndoe@email.com' })
      const userRepositoryPostgres = new UserRepositoryPostgres(prisma, {})

      await expect(userRepositoryPostgres.verifyAvailableEmail('johndoe@email.com')).rejects.toThrow(InvariantError)
    })

    it('should not throw InvariantError when email available', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(prisma, {})

      await expect(userRepositoryPostgres.verifyAvailableEmail('johndoe@email.com')).resolves.not.toThrow(InvariantError)
    })
  })
})
