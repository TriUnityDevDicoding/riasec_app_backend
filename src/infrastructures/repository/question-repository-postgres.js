const NotFoundError = require('../../commons/exceptions/not-found-error')
const AddedQuestion = require('../../domains/questions/entities/added-question')
const QuestionRepository = require('../../domains/questions/question-repository')
const createLog = require('../../infrastructures/logging/winston')

const log = createLog('questions')

class QuestionRepositoryPostgres extends QuestionRepository {
  constructor(prisma, idGenerator) {
    super()
    this._prisma = prisma
    this._idGenerator = idGenerator
  }

  async addQuestion(newQuestion) {
    const startTime = Date.now()
    const { question, category } = newQuestion
    const id = `question-${this._idGenerator()}`

    const addedQuestion = await this._prisma.question.create({
      data: { id, question, category }
    })

    const durationMs = Date.now() - startTime
    log.info('time needed for adding questions to database', { meta: `duration ${durationMs}ms` })

    return new AddedQuestion({ id: addedQuestion.id })
  }

  async getQuestionsByCategory(category) {
    const startTime = Date.now()

    const result = await this._prisma.question.findMany({
      where: {
        category
      }
    })

    const durationMs = Date.now() - startTime
    log.info(`time needed for getting questions category ${category}`, { meta: `duration ${durationMs}ms` })

    return result
  }

  async verifyQuestionExist(question) {
    const startTime = Date.now()
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
        log.error(`question id ${questionId} not found in database`)
        throw new NotFoundError(`question id '${questionId}' not found.`)
      }

      questions.push({ id: question.id, categoryName: question.category })
    }

    const durationMs = Date.now() - startTime
    log.info('time needed to verify question', { meta: `duration ${durationMs}ms` })

    return questions
  }
}

module.exports = QuestionRepositoryPostgres
