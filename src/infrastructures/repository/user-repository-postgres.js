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
    const { fullname, email, password, dateOfBirth, gender } = registerUser
    const id = `user-${this._idGenerator()}`

    const registeredUser = await this._prisma.user.create({
      data: { id, full_name: fullname, email, password, date_of_birth: dateOfBirth, gender }
    })

    return { id: registeredUser.id }
  }

  async getUserById (id) {
    const findUser = await this._prisma.user.findUnique({
      where: {
        id
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

  async getPasswordByEmail(email) {
    const result = await this._prisma.user.findUnique({
      where: {
        email
      },
      select: {
        password: true
      }
    })

    if (!result) {
      throw new InvariantError('email not found.')
    }

    return result.password
  }

  async getIdByEmail(email) {
    const result = await this._prisma.user.findUnique({
      where: {
        email
      },
      select: {
        id: true
      }
    })

    if (!result) {
      throw new InvariantError('user not found.')
    }

    return result.id
  }

  async getFullNameByEmail(email) {
    const result = await this._prisma.user.findUnique({
      where: {
        email
      },
      select: {
        full_name: true
      }
    })

    if (!result) {
      throw new InvariantError('Full name not found.')
    }

    return result.full_name
  }

  async getDateOfBirthByEmail(email) {
    const result = await this._prisma.user.findUnique({
      where: {
        email
      },
      select: {
        date_of_birth: true
      }
    })

    if (!result) {
      throw new InvariantError('user not found.')
    }

    return result.date_of_birth
  }

  async getGenderByEmail(email) {
    const result = await this._prisma.user.findUnique({
      where: {
        email
      },
      select: {
        gender: true
      }
    })

    if (!result) {
      throw new InvariantError('user not found.')
    }

    return result.gender
  }
}

module.exports = UserRepositoryPostgres
