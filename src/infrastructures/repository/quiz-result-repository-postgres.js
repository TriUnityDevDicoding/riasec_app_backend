const QuizResultRepository = require('../../domains/quiz-results/quiz-result-repository')

class QuizResultRepositoryPostgres extends QuizResultRepository {
  constructor(prisma, idGenerator) {
    super()
    this._prisma = prisma
    this._idGenerator = idGenerator
  }

  async addQuizResult(credentialId, newQuizResult, groqResponse, sessionId) {
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

    return { id: addedQuizResult.id }
  }

  async getQuizResults(credentialId) {
    return this._prisma.quizResult.findMany({
      where: {
        owner: credentialId
      }
    })
  }
}

module.exports = QuizResultRepositoryPostgres
