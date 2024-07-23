const QuestionsAnswerRepository = require('../../domains/questions-answers/questions-answer-repository')
const AddedQuestionsAnswer = require('../../domains/questions-answers/entities/added-questions-answer')
const createLog = require('../../infrastructures/logging/winston')

const log = createLog('questions-answers')

class QuestionsAnswerRepositoryPostgres extends QuestionsAnswerRepository {
  constructor(prisma, idGenerator) {
    super()
    this._prisma = prisma
    this._idGenerator = idGenerator
  }

  async addQuestionsAnswers(credentialId, newQuestionsAnswer, sessionId) {
    const startTime = Date.now()
    const addedAnswers = []

    for (const item of newQuestionsAnswer) {
      const { questionId, score, categoryName } = item
      const id = `questions-answer-${this._idGenerator()}`

      const addedAnswer = await this._prisma.questionsAnswer.create({
        data: {
          id,
          score,
          category_name: categoryName,
          question_id_relation: {
            connect: {
              id: questionId
            }
          },
          owner_relation: {
            connect: {
              id: credentialId
            }
          },
          session_id_relation: {
            connect: {
              id: sessionId
            }
          }
        }
      })
      addedAnswers.push({ id: addedAnswer.id })
    }

    const durationMs = Date.now() - startTime
    log.info('time needed for adding questions answers to database', { meta: `duration ${durationMs}ms` })
    return addedAnswers.map((item) => new AddedQuestionsAnswer(item))
  }

  async countScores(sessionId) {
    const startTime = Date.now()
    const countScores = await this._prisma.questionsAnswer.groupBy({
      by: ['category_name'],
      where: {
        session_id: sessionId
      },
      _sum: {
        score: true
      }
    })

    const durationMs = Date.now() - startTime
    log.info('time needed for count a scores', { meta: `duration ${durationMs}ms` })
    return countScores
  }
}

module.exports = QuestionsAnswerRepositoryPostgres
