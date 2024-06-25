const QuizResultsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'quizResults',
  register: async (server, { container }) => {
    const quizResultsHandler = new QuizResultsHandler(container)
    server.route(routes(quizResultsHandler))
  }
}
