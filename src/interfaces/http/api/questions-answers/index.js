const QuestionsAnswersHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'questionsAnswers',
  register: async (server, { container }) => {
    const questionsAnswersHandler = new QuestionsAnswersHandler(container)
    server.route(routes(questionsAnswersHandler))
  }
}
