const GroqRepository = require('../../domains/groq/groq-repository')

class GroqRepositoryCloud extends GroqRepository {
  constructor(groq) {
    super()
    this._groq = groq
  }

  async beginPrompt(realisticScore, investigativeScore, artisticScore, socialScore, enterprisingScore, conventionalScore) {
    const chatCompletion = await this._groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Kamu adalah seorang ahli dalam memahami kepribadian'
        },
        {
          role: 'user',
          content: `Saya telah melakukan tes RIASEC atau tes Holland, dan hasilnya menunjukkan bahwa saya cenderung memiliki kepribadian Realistic ${realisticScore} dari 10, Artistic ${artisticScore} dari 10, Conventional ${conventionalScore} dari 10, Investigative ${investigativeScore} dari 10, Social ${socialScore} dari 10, dan Enterprising ${enterprisingScore} dari 10. Bisakah Anda membantu saya memilih jurusan atau studi yang sesuai, serta jenjang karier yang cocok berdasarkan hasil kepribadian ini? Mohon tulis rekomendasi Anda dalam bahasa Indonesia dan hanya dalam bahasa Indonesia. Dan jelaskan juga kepada ciri karakteristik dari hasil kepribadian saya`
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
