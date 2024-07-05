const prisma = require('../../database/client/prisma-client')
const UsersTableTestHelper = require('../../../../tests/users-table-test-helper')
const AuthenticationsTableTestHelper = require('../../../../tests/authentications-table-test-helper')
const QuizResultsTableTestHelper = require('../../../../tests/quiz-results-table-test-helper')
const SessionsTableTestHelper = require('../../../../tests/sessions-table-test-helper')
const container = require('../../container')
const createServer = require('../create-server')

describe('/quiz-results endpoint', () => {
  let server
  let accessToken

  const userPayload = {
    fullname: 'John Doe',
    email: 'johndoe@email.com',
    password: 'johndoe123',
    dateOfBirth: '2000-03-05',
    gender: 'Male',
    role: 'User'
  }

  beforeEach(async () => {
    server = await createServer(container)

    const users = await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload
    })
    const addedUser = JSON.parse(users.payload).data.user
    const authentications = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        email: userPayload.email,
        password: userPayload.password
      }
    })
    accessToken = JSON.parse(authentications.payload).data.accessToken
  
    await SessionsTableTestHelper.addSession({ quizResultId: null, owner: addedUser.id })
    await QuizResultsTableTestHelper.addQuizResult({ owner: addedUser.id })
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  afterEach(async () => {
    await QuizResultsTableTestHelper.cleanTable()
    await SessionsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
  })

  describe('when GET /quiz-results', () => {
    it('should response 200 and persisted get quiz results', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/quiz-results',
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data).toBeDefined()
      expect(responseJson.data.quizResults).toBeDefined()
    })

    // it('should response 403 when user does not belong to credential user', async () => {
    //   const userDummyPayload = {
    //     fullname: 'Dummy',
    //     email: 'dummy@email.com',
    //     password: 'dummy123',
    //     dateOfBirth: '2001-01-01',
    //     gender: 'Male',
    //     role: 'User'
    //   }
    //   const userDummy = await server.inject({
    //     method: 'POST',
    //     url: '/users',
    //     payload: userDummyPayload
    //   })
    //   const addedUserDummy = JSON.parse(userDummy.payload).data.user
    //   const authentications = await server.inject({
    //     method: 'POST',
    //     url: '/authentications',
    //     payload: {
    //       email: userDummyPayload.email,
    //       password: userDummyPayload.password
    //     }
    //   })
    //   const accessTokenDummy = JSON.parse(authentications.payload).data.accessToken

    //   await SessionsTableTestHelper.addSession({ quizResultId: null, owner: addedUserDummy.id })
    //   await QuizResultsTableTestHelper.addQuizResult({ owner: addedUserDummy.id })
    //   // const checkSession = await SessionsTableTestHelper.findSessionById()

    //   const response = await server.inject({
    //     method: 'GET',
    //     url: '/quiz-results',
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`
    //     }
    //   })

    //   const responseJson = JSON.parse(response.payload)
    //   expect(response.statusCode).toEqual(403)
    //   expect(responseJson.status).toEqual('fail')
    //   expect(responseJson.message).toEqual('this quiz results does not belong to credential user.')
    // })

    it('should response 401 when user does not login', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/quiz-results',
        headers: {
          Authorization: 'Bearer accessToken'
        }
      })

      expect(response.statusCode).toStrictEqual(401)
    })
  })
})
