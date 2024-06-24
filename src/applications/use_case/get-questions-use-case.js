class GetQuestionsUseCase {
  constructor({ questionRepository }) {
    this._questionRepository = questionRepository
  }

  async execute() {
    const categories = ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional']
    let questions = []

    for (const category of categories) {
      // get questions for each category
      const categoryQuestions = await this._questionRepository.getQuestionsByCategory(category)
      // randomize the questions
      const shuffledQuestions = this._shuffleArray(categoryQuestions)
      // append the first two randomly shuffled questions from the current category
      // to the `questions` array, thus making each category only have two questions
      questions = questions.concat(shuffledQuestions.slice(0, 2))
    }

    return questions
  }

  _shuffleArray(array) {
    let currentIndex = array.length
    let randomIndex

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }

    return array
  }
}

module.exports = GetQuestionsUseCase
