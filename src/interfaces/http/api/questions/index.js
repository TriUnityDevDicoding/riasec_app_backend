const QuestionsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'questions',
  register: async (server, { container }) => {
    const questionsHandler = new QuestionsHandler(container)
    server.route(routes(questionsHandler))
  }
}
