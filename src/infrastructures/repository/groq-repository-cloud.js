const GroqRepository = require('../../domains/groq/groq-repository')

class GroqRepositoryCloud extends GroqRepository {
  constructor(groq) {
    super()
    this._groq = groq
  }

  async beginPrompt(
    realisticScore,
    investigativeScore,
    artisticScore,
    socialScore,
    enterprisingScore,
    conventionalScore
  ) {
    const chatCompletion = await this._groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Kamu adalah seorang ahli dalam memahami kepribadian'
        },
        {
          role: 'user',
          content: `Saya telah melakukan tes RIASEC atau tes Holland, dan hasilnya menunjukkan bahwa saya cenderung memiliki kepribadian Realistic ${realisticScore}%, Artistic ${artisticScore}%, Conventional ${conventionalScore}%, Investigative ${investigativeScore}%, Social ${socialScore}%, dan Enterprising ${enterprisingScore}%. Bisakah Anda membantu saya memilih jurusan atau studi yang sesuai? Mohon tulis rekomendasi Anda dalam bahasa Indonesia dan hanya dalam bahasa Indonesia. Dan tulis kesimpulan kepribadian milik saya berdasarkan hasil tes.`
        }
      ],
      model: 'llama3-8b-8192',
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
