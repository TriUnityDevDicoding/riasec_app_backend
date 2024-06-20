const AuthorizationError = require('../../commons/exceptions/authorization-error')
const InvariantError = require('../../commons/exceptions/invariant-error')
const NotFoundError = require('../../commons/exceptions/not-found-error')
const UserRepository = require('../../domains/users/user-repository')
const { mapDBToRegisteredUser } = require('../utils')

class UserRepositoryPostgres extends UserRepository {
  constructor (prisma, idGenerator) {
    super()
    this._prisma = prisma
    this._idGenerator = idGenerator
  }

  async addUser (registerUser) {
    const { fullname, email, password, dateOfBirth, gender, role } = registerUser
    const id = `user-${this._idGenerator()}`

    const registeredUser = await this._prisma.user.create({
      data: { id, full_name: fullname, email, password, date_of_birth: dateOfBirth, gender, role }
    })

    return { id: registeredUser.id }
  }

  async getUserById (id, userIdCredentials) {
    const findUser = await this._prisma.user.findUnique({
      where: {
        id
      }
    })

    if (id !== userIdCredentials) {
      throw new AuthorizationError('this user does not belong to credential user.')
    }

    if (!findUser) {
      throw new NotFoundError('user data not found.')
    }

    return mapDBToRegisteredUser(findUser)
  }

  async getUserByEmail (email) {
    const findUser = await this._prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!findUser) {
      throw new NotFoundError('user data not found.')
    }

    return mapDBToRegisteredUser(findUser)
  }

  async verifyAvailableEmail (email) {
    const findUserEmail = await this._prisma.user.findUnique({
      where: {
        email
      }
    })

    if (findUserEmail) {
      throw new InvariantError('email is not available.')
    }
  }

  async editUser (id, userIdCredentials, updateUser) {
    const { fullname, dateOfBirth, gender } = updateUser

    if (id !== userIdCredentials) {
      throw new AuthorizationError('this user does not belong to credential user.')
    }

    try {
      const updatedUser = await this._prisma.user.update({
        where: {
          id
        },
        data: {
          full_name: fullname,
          date_of_birth: dateOfBirth,
          gender
        }
      })
      return mapDBToRegisteredUser(updatedUser)
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundError('user failed to update, id not found.')
      }
      throw new InvariantError('an unexpected error occured.')
    }
  }
}

module.exports = UserRepositoryPostgres
