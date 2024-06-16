const prisma = require('../../database/client/prisma-client')
const QuestionsTableTestHelper = require('../../../../tests/questions-table-test-helper')
const container = require('../../container')
const createServer = require('../create-server')

describe('/questions endpoint', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  afterEach(async () => {
    await QuestionsTableTestHelper.cleanTable()
  })

  describe('when POST /questions', () => {
    it('should response 201 and new question', async () => {
      // Arrange
      const requestPayload = {
        question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain',
        category: 'Social'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/questions',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.question).toBeDefined()
      expect(responseJson.data.question.id).toBeDefined()
    })

    it('should response 400 if question payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/questions',
        payload: requestPayload
      })

      // Assert
      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('cannot create a new question: the required properties are missing.')
    })

    it('should response 400 if question payload wrong data type', async () => {
      // Arrange
      const requestPayload = {
        question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain',
        category: 'Socialism'
      }
      const server = await createServer(container)

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/questions',
        payload: requestPayload
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
      const server = await createServer(container)
      // add question
      await server.inject({
        method: 'POST',
        url: '/questions',
        payload: {
          question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain',
          category: 'Social'
        }
      })

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/questions'
      })

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
