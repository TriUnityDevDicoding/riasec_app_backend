const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const fs = require('fs')
const yml = require('js-yaml')
const { nanoid } = require('nanoid')

const questions = async () => {
  const readQuestions = yml.load(fs.readFileSync('src/commons/locales/id.questions.yml', 'utf-8'))
  const createQuestions = readQuestions.id.questions
  const questionsData = []

  for (const key in createQuestions) {
    if (createQuestions.hasOwnProperty(key)) {
      questionsData.push({
        id: `question-${nanoid(16)}`,
        question: createQuestions[key].question,
        category: createQuestions[key].category
      })
    }
  }

  const questionsCount = await prisma.question.createMany({
    data: questionsData,
    skipDuplicates: true
  })

  console.log({ questionsCount })
}

module.exports = questions