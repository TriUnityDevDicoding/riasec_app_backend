// const AuthorizationError = require('../../commons/exceptions/authorization-error')
const QuizResultRepository = require('../../domains/quiz-results/quiz-result-repository')
const createLog = require('../../infrastructures/logging/winston')

const log = createLog('quiz-result')

class QuizResultRepositoryPostgres extends QuizResultRepository {
  constructor(prisma, idGenerator) {
    super()
    this._prisma = prisma
    this._idGenerator = idGenerator
  }

  async addQuizResult(credentialId, newQuizResult, groqResponse, sessionId) {
    const startTime = Date.now()
    const { Realistic, Investigative, Artistic, Social, Enterprising, Conventional } = newQuizResult
    const id = `quiz-result-${this._idGenerator()}`

    const addedQuizResult = await this._prisma.quizResult.create({
      data: {
        id,
        realistic_score: Realistic,
        investigative_score: Investigative,
        artistic_score: Artistic,
        social_score: Social,
        enterprising_score: Enterprising,
        conventional_score: Conventional,
        owner_relation: {
          connect: {
            id: credentialId
          }
        },
        session_id_relation: {
          connect: {
            id: sessionId
          }
        },
        groq_response: groqResponse
      }
    })

    const durationMs = Date.now() - startTime
    log.info('time needed for adding quiz result to database', { meta: `duration ${durationMs}ms` })
    return { id: addedQuizResult.id }
  }

  async getQuizResults(credentialId) {
    const startTime = Date.now()
    const quizResults = await this._prisma.quizResult.findMany({
      where: {
        owner: credentialId
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    const durationMs = Date.now() - startTime
    log.info('time needed for get quiz results from database', { meta: `duration ${durationMs}ms` })
    return quizResults
  }
}

module.exports = QuizResultRepositoryPostgres
