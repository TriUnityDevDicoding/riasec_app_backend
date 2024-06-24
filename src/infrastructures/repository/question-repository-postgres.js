const NotFoundError = require('../../commons/exceptions/not-found-error')
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
    return await this._prisma.question.findMany({
      where: {
        category
      }
    })
  }

  async verifyQuestionExist(question) {
    const questions = []

    for (const item of question) {
      const { questionId } = item

      const question = await this._prisma.question.findUnique({
        where: {
          id: questionId
        },
        select: {
          id: true,
          category: true
        }
      })

      if (!question) {
        throw new NotFoundError(`question id '${questionId}' not found.`)
      }

      questions.push({ id: question.id, categoryName: question.category })
    }

    return questions
  }
}

module.exports = QuestionRepositoryPostgres
