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
const QuestionRepository = require('../domains/questions/question-repository')
const QuestionRepositoryPostgres = require('./repository/question-repository-postgres')
const QuestionsAnswerRepository = require('../domains/questions-answers/questions-answer-repository')
const QuestionsAnswerRepositoryPostgres = require('./repository/questions-answer-repository-postgres')
const SessionRepository = require('../domains/sessions/session-repository')
const SessionRepositoryPostgres = require('./repository/session-repository-postgres')
const QuizResultRepository = require('../domains/quiz-results/quiz-result-repository')
const QuizResultRepositoryPostgres = require('./repository/quiz-result-repository-postgres')
const PasswordHash = require('../applications/security/password-hash')
const BcryptPasswordHash = require('./security/bcrypt-password-hash')
const DateOfBirthParse = require('../applications/security/date-of-birth-parse')
const ParsingDateOfBirth = require('./security/parsing-date-of-birth')
const AuthenticationTokenManager = require('../applications/security/authentication-token-manager')
const JwtTokenManager = require('./security/jwt-token-manager')

// use case
const AddUserUseCase = require('../applications/use_case/add-user-use-case')
const DetailUserUseCase = require('../applications/use_case/detail-user-use-case')
const EditUserUseCase = require('../applications/use_case/edit-user-use-case')
const LoginUserUseCase = require('../applications/use_case/login-user-use-case')
const LogoutUserUseCase = require('../applications/use_case/logout-user-use-case')
const RefreshAuthenticationUseCase = require('../applications/use_case/refresh-authentication-use-case')
const AddQuestionUseCase = require('../applications/use_case/add-question-use-case')
const GetQuestionsUseCase = require('../applications/use_case/get-questions-use-case')
const AddQuestionsAnswerUseCase = require('../applications/use_case/add-questions-answer-use-case')

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
    key: QuestionRepository.name,
    Class: QuestionRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: prisma },
        { concrete: nanoid }
      ]
    }
  },
  {
    key: QuestionsAnswerRepository.name,
    Class: QuestionsAnswerRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: prisma },
        { concrete: nanoid }
      ]
    }
  },
  {
    key: SessionRepository.name,
    Class: SessionRepositoryPostgres,
    parameter: {
      dependencies: [
        { concrete: prisma },
        { concrete: nanoid }
      ]
    }
  },
  {
    key: QuizResultRepository.name,
    Class: QuizResultRepositoryPostgres,
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
    key: EditUserUseCase.name,
    Class: EditUserUseCase,
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
  },
  {
    key: AddQuestionUseCase.name,
    Class: AddQuestionUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'questionRepository',
          internal: QuestionRepository.name
        }
      ]
    }
  },
  {
    key: GetQuestionsUseCase.name,
    Class: GetQuestionsUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'questionRepository',
          internal: QuestionRepository.name
        }
      ]
    }
  },
  {
    key: AddQuestionsAnswerUseCase.name,
    Class: AddQuestionsAnswerUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'questionsAnswerRepository',
          internal: QuestionsAnswerRepository.name
        },
        {
          name: 'questionRepository',
          internal: QuestionRepository.name
        },
        {
          name: 'sessionRepository',
          internal: SessionRepository.name
        },
        {
          name: 'quizResultRepository',
          internal: QuizResultRepository.name
        }
      ]
    }
  },
])

module.exports = container
