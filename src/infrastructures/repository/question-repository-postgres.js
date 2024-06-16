const AddedQuestion = require('../../domains/questions/entities/added-question')
const QuestionRepository = require('../../domains/questions/question-repository')

class QuestionRepositoryPostgres extends QuestionRepository {
  constructor(prisma, idGenerator) {
    super()
    this._prisma = prisma
    this._idGenerator = idGenerator
  }

  async addQuestion(newQuestion) {
    const { question, category } = newQuestion
    const id = `question-${this._idGenerator()}`

    const addedQuestion = await this._prisma.question.create({
      data: { id, question, category }
    })

    return new AddedQuestion({ id: addedQuestion.id })
  }

  async getQuestionsByCategory(category) {
    const questions = await this._prisma.question.findMany({
      where: {
        category
      }
    })

    return questions
  }
}

module.exports = QuestionRepositoryPostgres
