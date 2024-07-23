const AuthorizationError = require('../../commons/exceptions/authorization-error')
const InvariantError = require('../../commons/exceptions/invariant-error')
const NotFoundError = require('../../commons/exceptions/not-found-error')
const RegisteredUser = require('../../domains/users/entities/registered-user')
const UserRepository = require('../../domains/users/user-repository')
const { mapDBToRegisteredUser, mapDBToUpdatedUser } = require('../utils')
const createLog = require('../../infrastructures/logging/winston')

const log = createLog('users')

class UserRepositoryPostgres extends UserRepository {
  constructor(prisma, idGenerator) {
    super()
    this._prisma = prisma
    this._idGenerator = idGenerator
  }

  async addUser(registerUser) {
    const startTime = Date.now()
    const { fullname, email, password, dateOfBirth, gender, role } = registerUser
    const id = `user-${this._idGenerator()}`

    const registeredUser = await this._prisma.user.create({
      data: { id, full_name: fullname, email, password, date_of_birth: dateOfBirth, gender, role }
    })

    const durationMs = Date.now() - startTime
    log.info('time needed for adding user to database', { meta: `duration ${durationMs}ms` })
    return new RegisteredUser({ id: registeredUser.id })
  }

  async getUserById(id, userIdCredentials) {
    const startTime = Date.now()

    const findUser = await this._prisma.user.findUnique({
      where: {
        id
      }
    })

    if (id !== userIdCredentials) {
      log.error('this user does not belong to credential user.')
      throw new AuthorizationError('this user does not belong to credential user.')
    }

    if (!findUser) {
      log.error('user data not found')
      throw new NotFoundError('user data not found.')
    }

    const durationMs = Date.now() - startTime
    log.info('time needed for getting user from database', { meta: `duration ${durationMs}ms` })
    return mapDBToRegisteredUser(findUser)
  }

  async getUserByEmail(email) {
    const startTime = Date.now()
    const findUser = await this._prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!findUser) {
      log.error(`${email} data are not found in database`)
      throw new NotFoundError('user data not found.')
    }

    const durationMs = Date.now() - startTime
    log.info('time needed for getting user by email from database', { meta: `duration ${durationMs}ms` })
    return mapDBToRegisteredUser(findUser)
  }

  async verifyAvailableEmail(email) {
    const startTime = Date.now()
    const findUserEmail = await this._prisma.user.findUnique({
      where: {
        email
      }
    })

    if (findUserEmail) {
      log.error('email is not available on database')
      throw new InvariantError('email is not available.')
    }

    const durationMs = Date.now() - startTime
    log.info('time needed for verifying available email from database', { meta: `duration ${durationMs}ms` })
  }

  async editUser(id, userIdCredentials, updateUser) {
    const startTime = Date.now()
    const { fullname, dateOfBirth, gender } = updateUser

    if (id !== userIdCredentials) {
      log.error('failed to edit, user does not belong to credential user')
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

      const durationMs = Date.now() - startTime
      log.info('time needed for updating user from database', { meta: `duration ${durationMs}ms` })
      return mapDBToUpdatedUser(updatedUser)
    } catch (error) {
      if (error.code === 'P2025') {
        log.error('failed to update user, user id not found in database')
        throw new NotFoundError('user failed to update, id not found.')
      }
      log.error('failed to update user, message =>', error.message)
      throw new InvariantError('an unexpected error occured.')
    }
  }

  async editUserPassword(id, userIdCredentials, updateUserPassword) {
    const startTime = Date.now()
    if (id !== userIdCredentials) {
      log.error('failed to update password, this user does not belong to credential user')
      throw new AuthorizationError('this user does not belong to credential user.')
    }

    try {
      await this._prisma.user.update({
        where: {
          id
        },
        data: {
          password: updateUserPassword
        }
      })
      const durationMs = Date.now() - startTime

      log.info('time needed for updating user password from database', { meta: `duration ${durationMs}ms` })
    } catch (error) {
      if (error.code === 'P2025') {
        log.error('failed to update user password, user id not found in database')
        throw new NotFoundError('user failed to update, id not found.')
      }
      log.error('failed to update user, message =>', error.message)
      throw new InvariantError('an unexpected error occured.')
    }
  }

  async getUserPasswordById(id, userIdCredentials) {
    const startTime = Date.now()

    const findUser = await this._prisma.user.findUnique({
      where: {
        id
      },
      select: {
        password: true
      }
    })

    if (id !== userIdCredentials) {
      log.error('failed to get user password, this user does not belong to credential user')
      throw new AuthorizationError('this user does not belong to credential user.')
    }

    if (!findUser) {
      log.error('failed to get user password, this user does are not found in database')
      throw new NotFoundError('user data not found.')
    }

    const durationMs = Date.now() - startTime
    log.info('time needed for getting user password from database', { meta: `duration ${durationMs}ms` })
    return findUser.password
  }
}

module.exports = UserRepositoryPostgres
