/* istanbul ignore file */
const prisma = require('../src/infrastructures/database/client/prisma-client')

const QuestionsTableTestHelper = {
  async addQuestion({
    id = 'question-123',
    question = 'Saya lebih suka untuk bekerja sendiri dibanding dengan bekerja bersama orang lain',
    category = 'Social'
  }) {
    await prisma.question.create({
      data: { id, question, category }
    })
  },

  async findQuestionById(id) {
    const question = await prisma.question.findUnique({
      where: {
        id
      }
    })
    return question
  },

  async getQuestionsByCategory(category) {
    const questions = await prisma.question.findMany({
      where: {
        category
      }
    })

    return questions
  },

  async cleanTable() {
    await prisma.question.deleteMany({ where: {} })
  }
}

module.exports = QuestionsTableTestHelper
