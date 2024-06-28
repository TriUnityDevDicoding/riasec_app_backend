class SessionRepository {
  async addSession(credentialId) {
    throw new Error('SESSION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async putQuizResultId(sessionId, quizResultId) {
    throw new Error('SESSION_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = SessionRepository
