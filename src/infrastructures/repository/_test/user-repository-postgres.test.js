const UsersTableTestHelper = require('../../../../tests/users-table-test-helper')
const InvariantError = require('../../../commons/exceptions/invariant-error')
const NotFoundError = require('../../../commons/exceptions/not-found-error')
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
    it('should persist register user and return added user id correctly', async () => {
      const userPayloadInDatabase = {
        id: 'user-123',
        fullname: 'John Doe',
        email: 'johndoe@email.com',
        password: 'johndoe123',
        dateOfBirth: new Date('2000-03-05'),
        gender: 'Male'
      }
      const fakeIdGenerator = () => '123'
      const userRepositoryPostgres = new UserRepositoryPostgres(prisma, fakeIdGenerator)

      const registeredUser = await userRepositoryPostgres.addUser(userPayloadInDatabase)

      const findUser = await UsersTableTestHelper.findUserById(registeredUser.id)
      expect(findUser.id).toStrictEqual(registeredUser.id)
      expect(registeredUser.id).toStrictEqual(userPayloadInDatabase.id)
    })
  })

  describe('getUserById function', () => {
    it('should throw NotFoundError when user not found.', async () => {
      const userRepositoryPostgres = new UserRepositoryPostgres(prisma, {})

      return expect(userRepositoryPostgres.getUserById('user-123')).rejects.toThrow(NotFoundError)
    })

    it('should run function getUserById correctly and return expected properties', async () => {
      const userPayloadInDatabase = {
        id: 'user-123',
        fullname: 'John Doe',
        email: 'johndoe@email.com',
        password: 'johndoe123',
        dateOfBirth: new Date('2000-03-05'),
        gender: 'Male'
      }
      await UsersTableTestHelper.addUser({ ...userPayloadInDatabase })
      const userRepositoryPostgres = new UserRepositoryPostgres(prisma, {})

      const detailUser = await userRepositoryPostgres.getUserById(userPayloadInDatabase.id)

      expect(detailUser.id).toStrictEqual(userPayloadInDatabase.id)
      expect(detailUser.fullname).toStrictEqual(userPayloadInDatabase.fullname)
      expect(detailUser.email).toStrictEqual(userPayloadInDatabase.email)
      expect(detailUser.dateOfBirth).toStrictEqual(userPayloadInDatabase.dateOfBirth)
      expect(detailUser.gender).toStrictEqual(userPayloadInDatabase.gender)
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

  describe('editUser function', () => {
    it('should throw NotFoundError when user not found', async () => {
      const updateUserPayloadInDatabase = {
        fullname: 'Mia Doe',
        dateOfBirth: new Date('1999-03-05'),
        gender: 'Female'
      }
      const userRepositoryPostgres = new UserRepositoryPostgres(prisma, {})

      return expect(userRepositoryPostgres.editUser('user-123', updateUserPayloadInDatabase)).rejects.toThrow(NotFoundError)
    })

    it('should run function editUser correctly and return expected properties', async () => {
      const userPayloadInDatabase = {
        id: 'user-123',
        fullname: 'John Doe',
        email: 'johndoe@email.com',
        password: 'johndoe123',
        dateOfBirth: new Date('2000-03-05'),
        gender: 'Male'
      }
      const updateUserPayloadInDatabase = {
        fullname: 'Mia Doe',
        dateOfBirth: new Date('1999-03-05'),
        gender: 'Female'
      }
      await UsersTableTestHelper.addUser({ ...userPayloadInDatabase })
      const userRepositoryPostgres = new UserRepositoryPostgres(prisma, {})

      const editedUser = await userRepositoryPostgres.editUser(userPayloadInDatabase.id, updateUserPayloadInDatabase)

      expect(editedUser.id).toStrictEqual(userPayloadInDatabase.id)
      expect(editedUser).toStrictEqual({
        id: 'user-123',
        fullname: updateUserPayloadInDatabase.fullname,
        email: 'johndoe@email.com',
        dateOfBirth: updateUserPayloadInDatabase.dateOfBirth,
        gender: updateUserPayloadInDatabase.gender
      })
    })
  })

  describe('getPasswordByEmail', () => {
    it('should throw InvariantError when user not found', () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(prisma, {})

      // Action & Assert
      return expect(userRepositoryPostgres.getPasswordByEmail('johndoe@email.com'))
        .rejects
        .toThrow(InvariantError)
    })

    it('should return email password when user is found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(prisma, {})
      await UsersTableTestHelper.addUser({
        email: 'johndoe@email.com',
        password: 'secret_password'
      })

      // Action & Assert
      const password = await userRepositoryPostgres.getPasswordByEmail('johndoe@email.com')
      expect(password).toBe('secret_password')
    })
  })

  describe('getIdByEmail', () => {
    it('should throw InvariantError when user not found', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(prisma, {})

      // Action & Assert
      await expect(userRepositoryPostgres.getIdByEmail('johndoe@email.com'))
        .rejects
        .toThrow(InvariantError)
    })

    it('should return user id correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-321', email: 'johndoe@email.com' })
      const userRepositoryPostgres = new UserRepositoryPostgres(prisma, {})

      // Action
      const userId = await userRepositoryPostgres.getIdByEmail('johndoe@email.com')

      // Assert
      expect(userId).toEqual('user-321')
    })
  })
})
