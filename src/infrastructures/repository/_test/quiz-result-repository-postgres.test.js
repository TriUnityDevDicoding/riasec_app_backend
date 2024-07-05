const UsersTableTestHelper = require('../../../../tests/users-table-test-helper')
const QuizResultsTableTestHelper = require('../../../../tests/quiz-results-table-test-helper')
const SessionsTableTestHelper = require('../../../../tests/sessions-table-test-helper')
const prisma = require('../../database/client/prisma-client')
const QuizResultRepositoryPostgres = require('../quiz-result-repository-postgres')

describe('QuizResultRepositoryPostgres', () => {
  afterEach(async () => {
    await QuizResultsTableTestHelper.cleanTable()
    await SessionsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('addQuizResult function', () => {
    it('should persist new quiz result and return added quiz result id correctly', async () => {
      await UsersTableTestHelper.addUser({})
      await SessionsTableTestHelper.addSession({ quizResultId: null })
      const groqResponse = 'This is Groq AI response.'
      const newQuizResult = {
        Realistic: 3,
        Investigative: 3,
        Artistic: 3,
        Social: 3,
        Enterprising: 3,
        Conventional: 3
      }
      const fakeIdGenerator = () => '123'
      const quizResultRepositoryPostgres = new QuizResultRepositoryPostgres(prisma, fakeIdGenerator)

      const addedQuizResult = await quizResultRepositoryPostgres.addQuizResult('user-123', newQuizResult, groqResponse, 'session-123')

      const findQuizResult = await QuizResultsTableTestHelper.findQuizResultById(addedQuizResult.id)
      expect(findQuizResult.id).toStrictEqual(addedQuizResult.id)
      expect(addedQuizResult.id).toStrictEqual('quiz-result-123')
    })
  })

  describe('getQuizResults function', () => {
    it('should run function getQuizResults correctly and return expected properties', async () => {
      await UsersTableTestHelper.addUser({})
      await SessionsTableTestHelper.addSession({ quizResultId: null })
      await QuizResultsTableTestHelper.addQuizResult({})
      const quizResultRepositoryPostgres = new QuizResultRepositoryPostgres(prisma, {})

      const quizResults = await quizResultRepositoryPostgres.getQuizResults('user-123')

      expect(quizResults[0].id).toStrictEqual('quiz-result-123')
      expect(quizResults[0].owner).toStrictEqual('user-123')
      expect(quizResults[0].session_id).toStrictEqual('session-123')
      expect(quizResults[0]).toHaveProperty('id')
      expect(quizResults[0]).toHaveProperty('owner')
      expect(quizResults[0]).toHaveProperty('session_id')
    })
  })
})
