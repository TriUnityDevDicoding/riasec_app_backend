const QuestionsAnswerTableTestHelper = require('../../../../tests/questions-answers-table-test-helper')
const QuestionsTableTestHelper = require('../../../../tests/questions-table-test-helper')
const SessionsTableTestHelper = require('../../../../tests/sessions-table-test-helper')
const UsersTableTestHelper = require('../../../../tests/users-table-test-helper')
const prisma = require('../../database/client/prisma-client')
const QuestionsAnswerRepositoryPostgres = require('../questions-answer-repository-postgres')

describe('QuestionRepositoryPostgres', () => {
  afterEach(async () => {
    await QuestionsAnswerTableTestHelper.cleanTable()
    await QuestionsTableTestHelper.cleanTable()
    await SessionsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('addQuestionsAnswers function', () => {
    it('should persist new questions answer and return added question id correctly', async () => {
      const questionsAnswerPayloadInDatabase = [
        {
          questionId: 'question-123',
          score: 10,
          categoryName: 'Social'
        }
      ]
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await SessionsTableTestHelper.addSession({ id: 'session-123', quizResultId: null, owner: 'user-123' })
      await QuestionsTableTestHelper.addQuestion({ id: 'question-123' })
      const fakeIdGenerator = () => '123'
      const questionsAnswerRepositoryPostgres = new QuestionsAnswerRepositoryPostgres(prisma, fakeIdGenerator)

      const addedQuestionsAnswer = await questionsAnswerRepositoryPostgres.addQuestionsAnswers(
        'user-123',
        questionsAnswerPayloadInDatabase,
        'session-123'
      )

      const findQuestionsAnswer = await QuestionsAnswerTableTestHelper.findQuestionsAnswerById(
        addedQuestionsAnswer[0].id
      )
      expect(findQuestionsAnswer.id).toStrictEqual(addedQuestionsAnswer[0].id)
      expect(addedQuestionsAnswer[0].id).toStrictEqual('questions-answer-123')
    })
  })

  describe('countScores function', () => {
    it('should run function getQuestionsByCategory correctly and return expected properties', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' })
      await SessionsTableTestHelper.addSession({ id: 'session-123', quizResultId: null, owner: 'user-123' })
      await QuestionsTableTestHelper.addQuestion({ id: 'question-123', category: 'Social' })
      await QuestionsAnswerTableTestHelper.addQuestionsAnswer({ id: 'questions-answer-123', questionId: 'question-123', owner: 'user-123', score: 12, sessionId: 'session-123', categoryName: 'Social' })
      const questionsAnswerRepositoryPostgres = new QuestionsAnswerRepositoryPostgres(prisma, {})

      const countQuestionsAnswerScore = await questionsAnswerRepositoryPostgres.countScores('session-123')

      expect(countQuestionsAnswerScore[0]._sum.score).toStrictEqual(12)
      expect(countQuestionsAnswerScore[0].category_name).toStrictEqual('Social')
    })
  })
})
