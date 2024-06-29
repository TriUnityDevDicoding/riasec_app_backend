const QuestionsTableTestHelper = require('../../../../tests/questions-table-test-helper')
const prisma = require('../../database/client/prisma-client')
const QuestionRepositoryPostgres = require('../question-repository-postgres')

describe('QuestionRepositoryPostgres', () => {
  afterEach(async () => {
    await QuestionsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('addQuestion function', () => {
    it('should persist new question and return added question id correctly', async () => {
      const questionPayloadInDatabase = {
        id: 'question-123',
        question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain',
        category: 'Social'
      }
      const fakeIdGenerator = () => '123'
      const questionRepositoryPostgres = new QuestionRepositoryPostgres(prisma, fakeIdGenerator)

      const addedQuestion = await questionRepositoryPostgres.addQuestion(questionPayloadInDatabase)

      const findQuestion = await QuestionsTableTestHelper.findQuestionById(addedQuestion.id)
      expect(findQuestion.id).toStrictEqual(addedQuestion.id)
      expect(addedQuestion.id).toStrictEqual(questionPayloadInDatabase.id)
    })
  })

  describe('getQuestionsByCategory function', () => {
    it('should run function getQuestionsByCategory correctly and return expected properties', async () => {
      const questionPayloadInDatabase = {
        id: 'question-123',
        question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain',
        category: 'Social'
      }
      await QuestionsTableTestHelper.addQuestion({ ...questionPayloadInDatabase })
      const questionRepositoryPostgres = new QuestionRepositoryPostgres(prisma, {})

      const questions = await questionRepositoryPostgres.getQuestionsByCategory(questionPayloadInDatabase.category)

      expect(questions[0].id).toStrictEqual(questionPayloadInDatabase.id)
      expect(questions[0].question).toStrictEqual(questionPayloadInDatabase.question)
      expect(questions[0].category).toStrictEqual(questionPayloadInDatabase.category)
      expect(questions[0]).toHaveProperty('id')
      expect(questions[0]).toHaveProperty('question')
      expect(questions[0]).toHaveProperty('category')
    })
  })

  describe('verifyQuestionExist function', () => {
    it('should check the question and return question id correctly', async () => {
      const questionPayloadInDatabase = [
        {
          id: 'question-123',
          question: 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain',
          category: 'Social'
        }
      ]
      const mapQuestionPayload = questionPayloadInDatabase.map(question => ({
        questionId: question.id
      }))
      await QuestionsTableTestHelper.addQuestion({ ...questionPayloadInDatabase })
      const questionRepositoryPostgres = new QuestionRepositoryPostgres(prisma, {})

      const questions = await questionRepositoryPostgres.verifyQuestionExist(mapQuestionPayload)

      expect(questions[0].id).toStrictEqual(questionPayloadInDatabase[0].id)
      expect(questions[0].categoryName).toStrictEqual(questionPayloadInDatabase[0].category)
      expect(questions[0]).toHaveProperty('id')
      expect(questions[0]).toHaveProperty('categoryName')
    })
  })
})
