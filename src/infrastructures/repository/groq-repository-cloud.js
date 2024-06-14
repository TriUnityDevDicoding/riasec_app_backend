const GroqRepository = require('../../domains/groq/groq-repository')

class GroqRepositoryCloud extends GroqRepository {
  constructor(groq) {
    super()
    this._groq = groq
  }

  async beginPrompt(prompt) {
    const chatCompletion = await this._groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Kamu adalah seorang ahli dalam memahami kepribadian'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      model: 'gemma-7b-it',
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
      stop: null
    })

    const response = chatCompletion.choices[0].message.content

    return response
  }
}

module.exports = GroqRepositoryCloud
