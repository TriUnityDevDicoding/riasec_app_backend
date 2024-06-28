const prisma = require('../../database/client/prisma-client')
const QuestionsTableTestHelper = require('../../../../tests/questions-table-test-helper')
const UsersTableTestHelper = require('../../../../tests/users-table-test-helper')
const AuthenticationsTableTestHelper = require('../../../../tests/authentications-table-test-helper')
const container = require('../../container')
const createServer = require('../create-server')

describe('/questions endpoint', () => {
  let server
  let accessToken

  const adminPayload = {
    fullname: 'Johnny Doe',
    email: 'johnnydoe@email.com',
    password: 'johnnydoe123',
    dateOfBirth: '2001-03-05',
    gender: 'Male',
    role: 'Admin'
  }

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

    await UsersTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()

    // Add admin user
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: adminPayload
    })

    // Login admin user
    const adminLoginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        email: adminPayload.email,
        password: adminPayload.password
      }
    })

    accessToken = JSON.parse(adminLoginResponse.payload).data.accessToken
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  afterEach(async () => {
    await QuestionsTableTestHelper.cleanTable()
  })

  describe('when POST /questions', () => {
    it('should respond with 201 and new question', async () => {
      // Arrange
      const requestPayload = {
        question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain',
        category: 'Social'
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/questions',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.question).toBeDefined()
      expect(responseJson.data.question.id).toBeDefined()
    })

    it('should respond with 403 if the user role is not Admin', async () => {
      // Arrange
      const serverUser = await createServer(container)

      // Add user
      await serverUser.inject({
        method: 'POST',
        url: '/users',
        payload: userPayload
      })

      // Login user
      const userLoginResponse = await serverUser.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          email: userPayload.email,
          password: userPayload.password
        }
      })

      const userAccessToken = JSON.parse(userLoginResponse.payload).data.accessToken

      // Action
      const response = await serverUser.inject({
        method: 'POST',
        url: '/questions',
        payload: {
          question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain',
          category: 'Social'
        },
        headers: {
          Authorization: `Bearer ${userAccessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('Unauthorized.')
    })

    it('should respond with 400 if question payload does not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain'
        // Missing category
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/questions',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('cannot create a new question: the required properties are missing.')
    })

    it('should respond with 400 if question payload has wrong data type', async () => {
      // Arrange
      const requestPayload = {
        question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain',
        category: 'Socialism' // Incorrect category
      }

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/questions',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('cannot create a new question: the data type does not match.')
    })
  })

  describe('when GET /questions', () => {
    it('should return 200 and show questions', async () => {
      // Arrange
      const requestPayload = {
        question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain',
        category: 'Social'
      }

      // Add a question
      await server.inject({
        method: 'POST',
        url: '/questions',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/questions'
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.question).toBeDefined()
      expect(responseJson.data.question[0].id).toBeDefined()
      expect(responseJson.data.question[0].question).toBeDefined()
      expect(responseJson.data.question[0].category).toBeDefined()
    })
  })
})
