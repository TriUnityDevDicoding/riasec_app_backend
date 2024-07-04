const UsersTableTestHelper = require('../../../../tests/users-table-test-helper')
const QuizResultsTableTestHelper = require('../../../../tests/quiz-results-table-test-helper')
const SessionsTableTestHelper = require('../../../../tests/sessions-table-test-helper')
const prisma = require('../../database/client/prisma-client')
const SessionRepositoryPostgres = require('../session-repository-postgres')

describe('SessionRepositoryPostgres', () => {
  afterEach(async () => {
    await QuizResultsTableTestHelper.cleanTable()
    await SessionsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('addSession function', () => {
    it('should persist new session and return added session id correctly', async () => {
      const credentialId = 'user-123'
      await UsersTableTestHelper.addUser({ id: credentialId })
      const sessionPayload = {
        owner: credentialId
      }
      const fakeIdGenerator = () => '123'
      const sessionRepositoryPostgres = new SessionRepositoryPostgres(prisma, fakeIdGenerator)

      const addedSession = await sessionRepositoryPostgres.addSession(sessionPayload.owner)

      const findSession = await SessionsTableTestHelper.findSessionById(addedSession.id)
      expect(findSession.id).toStrictEqual(addedSession.id)
      expect(addedSession.id).toStrictEqual('session-123')
    })
  })

  describe('putQuizResultId function', () => {
    it('should run function putQuizResultId correctly', async () => {
      await UsersTableTestHelper.addUser({})
      await SessionsTableTestHelper.addSession({ quizResultId: null })
      await QuizResultsTableTestHelper.addQuizResult({})
      const addedQuizResult = await QuizResultsTableTestHelper.findQuizResultById('quiz-result-123')
      const sessionRepositoryPostgres = new SessionRepositoryPostgres(prisma, {})

      await sessionRepositoryPostgres.putQuizResultId(addedQuizResult.session_id, addedQuizResult.id)

      const updatedSession = await SessionsTableTestHelper.findSessionById('session-123')
      expect(updatedSession.id).toStrictEqual(addedQuizResult.session_id)
      expect(updatedSession.quiz_result_id).toStrictEqual(addedQuizResult.id)
    })
  })
})
