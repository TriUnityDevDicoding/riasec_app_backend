/* istanbul ignore file */
const { createContainer } = require('instances-container')

// external agency
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')
const prisma = require('./database/client/prisma-client')

// services (repository, helper, manager, etc.)
const UserRepository = require('../domains/users/user-repository')
const UserRepositoryPostgres = require('./repository/user-repository-postgres')
const AuthenticationRepository = require('../domains/authentications/authentication-repository')
const AuthenticationRepositoryPostgres = require('./repository/authentication-repository-postgres')
const PasswordHash = require('../applications/security/password-hash')
const BcryptPasswordHash = require('./security/bcrypt-password-hash')
const DateOfBirthParse = require('../applications/security/date-of-birth-parse')
const ParsingDateOfBirth = require('./security/parsing-date-of-birth')
const AuthenticationTokenManager = require('../applications/security/authentication-token-manager')
const JwtTokenManager = require('./security/jwt-token-manager')

// use case
const AddUserUseCase = require('../applications/use_case/add-user-use-case')
const DetailUserUseCase = require('../applications/use_case/detail-user-use-case')
const LoginUserUseCase = require('../applications/use_case/login-user-use-case')
const LogoutUserUseCase = require('../applications/use_case/logout-user-use-case')
const RefreshAuthenticationUseCase = require('../applications/use_case/refresh-authentication-use-case')

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
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: prisma
        }
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
  },
  {
    key: DateOfBirthParse.name,
    Class: ParsingDateOfBirth
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token
        }
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
        },
        {
          name: 'dateOfBirthParse',
          internal: DateOfBirthParse.name
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
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'dateOfBirthParse',
          internal: DateOfBirthParse.name
        }
      ]
    }
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        },
        {
          name: 'dateOfBirthParse',
          internal: DateOfBirthParse.name
        }
      ]
    }
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        }
      ]
    }
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        }
      ]
    }
  }
])

module.exports = container
