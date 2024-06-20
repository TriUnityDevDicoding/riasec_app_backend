const QuestionsAnswerRepository = require('../../domains/questions-answers/questions-answer-repository')

class QuestionsAnswerRepositoryPostgres extends QuestionsAnswerRepository {
  constructor(prisma, idGenerator) {
    super()
    this._prisma = prisma
    this._idGenerator = idGenerator
  }

  async addQuestionsAnswers(credentialId, newQuestionsAnswer, sessionId) {
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

    return addedAnswers
  }

  async countScores(sessionId) {
    return await this._prisma.questionsAnswer.groupBy({
      by: ['category_name'],
      where: {
        session_id: sessionId
      },
      _sum: {
        score: true
      }
    })
  }
}

module.exports = QuestionsAnswerRepositoryPostgres
