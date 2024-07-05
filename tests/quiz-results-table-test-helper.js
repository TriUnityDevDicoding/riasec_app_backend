/* istanbul ignore file */
const prisma = require('../src/infrastructures/database/client/prisma-client')

const QuizResultsTableTestHelper = {
  async addQuizResult({
    id = 'quiz-result-123',
    owner = 'user-123',
    realisticScore = 3,
    investigativeScore = 3,
    artisticScore = 3,
    socialScore = 3,
    enterprisingScore = 3,
    conventionalScore = 3,
    sessionId = 'session-123',
    groqResponse = 'This is Groq AI response.'
  }) {
    await prisma.quizResult.create({
      data: {
        id,
        owner,
        realistic_score: realisticScore,
        investigative_score: investigativeScore,
        artistic_score: artisticScore,
        social_score: socialScore,
        enterprising_score: enterprisingScore,
        conventional_score: conventionalScore,
        session_id: sessionId,
        groq_response: groqResponse
      }
    })
  },

  async findQuizResultById(id) {
    const quizResult = await prisma.quizResult.findUnique({
      where: {
        id
      }
    })
    return quizResult
  },

  async cleanTable() {
    await prisma.quizResult.deleteMany({ where: {} })
  }
}

module.exports = QuizResultsTableTestHelper
