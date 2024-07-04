const prisma = require('../../database/client/prisma-client')
const UsersTableTestHelper = require('../../../../tests/users-table-test-helper')
const SessionsTableTestHelper = require('../../../../tests/sessions-table-test-helper')
const QuizResultsTableTestHelper = require('../../../../tests/quiz-results-table-test-helper')
const QuestionsTableTestHelper = require('../../../../tests/questions-table-test-helper')
const QuestionAnswersTableTestHelper = require('../../../../tests/questions-answers-table-test-helper')
const container = require('../../container')
const createServer = require('../create-server')

describe('/questions/answer endpoint', () => {
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

    await server.inject({
      method: 'POST',
      url: '/users',
      payload: userPayload
    })

    const authentications = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        email: userPayload.email,
        password: userPayload.password
      }
    })
    accessToken = JSON.parse(authentications.payload).data.accessToken
  
    await QuestionsTableTestHelper.addQuestion({ id: 'question-111', category: 'Realistic' })
    await QuestionsTableTestHelper.addQuestion({ id: 'question-222', category: 'Investigative' })
    await QuestionsTableTestHelper.addQuestion({ id: 'question-333', category: 'Artistic' })
    await QuestionsTableTestHelper.addQuestion({ id: 'question-444', category: 'Social' })
    await QuestionsTableTestHelper.addQuestion({ id: 'question-555', category: 'Enterprising' })
    await QuestionsTableTestHelper.addQuestion({ id: 'question-666', category: 'Conventional' })
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  afterEach(async () => {
    await QuestionAnswersTableTestHelper.cleanTable()
    await QuestionsTableTestHelper.cleanTable()
    await QuizResultsTableTestHelper.cleanTable()
    await SessionsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /questions/answers', () => {
    it('should response 201 and persisted question answers', async () => {
      const requestPayload = [
        { questionId: 'question-111', score: 3 },
        { questionId: 'question-222', score: 3 },
        { questionId: 'question-333', score: 3 },
        { questionId: 'question-444', score: 3 },
        { questionId: 'question-555', score: 3 },
        { questionId: 'question-666', score: 3 }
      ]

      const response = await server.inject({
        method: 'POST',
        url: '/questions/answers',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.questionsAnswers).toBeDefined()
      expect(responseJson.data.questionsAnswers[0].id).toBeDefined()
    })

    it('should response 401 when user does not login', async () => {
      const requestPayload = [
        { questionId: 'question-111', score: 3 },
        { questionId: 'question-222', score: 3 },
        { questionId: 'question-333', score: 3 },
        { questionId: 'question-444', score: 3 },
        { questionId: 'question-555', score: 3 },
        { questionId: 'question-666', score: 3 }
      ]

      const response = await server.inject({
        method: 'POST',
        url: '/questions/answers',
        payload: requestPayload,
        headers: {
          Authorization: 'Bearer accessToken'
        }
      })

      expect(response.statusCode).toStrictEqual(401)
    })

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = [
        { questionId: 'question-111'},
        { questionId: 'question-222'},
        { questionId: 'question-333'},
        { questionId: 'question-444'},
        { questionId: 'question-555'},
        { questionId: 'question-666'}
      ]

      const response = await server.inject({
        method: 'POST',
        url: '/questions/answers',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('cannot create a new questions answer: the required properties are missing.')
    })

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = [
        { questionId: 'question-111', score: [3] },
        { questionId: 'question-222', score: [3] },
        { questionId: 'question-333', score: [3] },
        { questionId: 'question-444', score: [3] },
        { questionId: 'question-555', score: [3] },
        { questionId: 'question-666', score: [3] }
      ]

      const response = await server.inject({
        method: 'POST',
        url: '/questions/answers',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('cannot create a new questions answer: the data type does not match.')
    })
  })
})
