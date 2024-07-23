/* istanbul ignore file */
const prisma = require('../src/infrastructures/database/client/prisma-client')

const QuestionsAnswerTableTestHelper = {
  async addQuestionsAnswer({
    id = 'questions-answer-123',
    questionId = 'question-123',
    owner = 'user-123',
    score = 10,
    sessionId = 'session-123',
    categoryName = 'Social'
  }) {
    await prisma.questionsAnswer.create({
      data: { id, question_id: questionId, owner, score, session_id: sessionId, category_name: categoryName }
    })
  },

  async findQuestionsAnswerById(id) {
    const questionsAnswer = await prisma.questionsAnswer.findUnique({
      where: {
        id
      }
    })
    return questionsAnswer
  },

  async cleanTable() {
    await prisma.questionsAnswer.deleteMany({ where: {} })
  }
}

module.exports = QuestionsAnswerTableTestHelper
