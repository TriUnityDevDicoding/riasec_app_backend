/* istanbul ignore file */
const { createContainer } = require('instances-container')

// external agency
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const prisma = require('./database/postgres/prisma-client')

// services (repository, helper, manager, etc.)
const UserRepository = require('../domains/users/user-repository')
const UserRepositoryPostgres = require('./repository/user-repository-postgres')
const PasswordHash = require('../applications/security/password-hash')
const BcryptPasswordHash = require('./security/bcrypt-password-hash')

// use case
const AddUserUseCase = require('../applications/use_case/add-user-use-case')
const DetailUserUseCase = require('../applications/use_case/detail-user-use-case')

const container = createContainer()

container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: prisma },
        { concrete: nanoid }
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        { concrete: bcrypt }
      ]
    }
  }
])

container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: DetailUserUseCase.name,
    Class: DetailUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRpository',
          internal: UserRepository.name
        }
      ]
    }
  }
])

module.exports = container
