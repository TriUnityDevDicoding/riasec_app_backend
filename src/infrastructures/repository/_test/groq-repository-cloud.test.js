const GroqRepositoryCloud = require('../groq-repository-cloud')
const Groq = require('groq-sdk')

describe('GorqRepositoryCloud ', () => {
  jest.setTimeout(30000)
  describe('beginPrompt function', () => {
    it('should successfully promt and return a response', async () => {
      // Arrange
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
      const groqRepositoryCloud = new GroqRepositoryCloud(groq)
      const prompt =
        'Saya telah melakukan tes RIASEC atau tes Holland, dan hasilnya menunjukkan bahwa saya cenderung memiliki kepribadian Realistic 60%, Artistic 19%, Conventional 10%, Investigative 5%, Social 4%, dan Enterprising 2%. Bisakah Anda membantu saya memilih jurusan atau studi yang sesuai, serta jenjang karier yang cocok berdasarkan hasil kepribadian ini? Mohon tulis rekomendasi Anda dalam bahasa Indonesia dan hanya dalam bahasa Indonesia. Dan jelaskan juga kepada ciri karakteristik dari hasil kepribadian saya'

      // Action
      const response = await groqRepositoryCloud.beginPrompt(prompt)

      // Assert
      expect(response).not.toBeNull()
    })
  })
})
