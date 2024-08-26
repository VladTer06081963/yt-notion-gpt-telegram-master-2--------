import OpenAI from 'openai'
import config from 'config'

const CHATGPT_MODEL = 'gpt-3.5-turbo'

const ROLES = {
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  USER: 'user',
}

const openai = new OpenAI({
  apiKey: config.get('OPENAI_KEY'),
})

const getMessage = (m) => `
Напиши на основе этих вопросов и заданий, ответ по программированию и написании кода: ${m}
Необходимо в итоге получить наглядный с возможным примером кода . Текст должен быть доступным и не превышать 150 слов. Главное — чтобы было понятно для непрофессионала, правильная последовательность и учитывался контекст.
`

export async function chatGPT(message = '') {
  const messages = [
    {
      role: ROLES.SYSTEM,
      content:
      'Ты опытный программист на Java Script и наставник, который пишет понятные и доступные уроки для своих учеников.',
    },
    { role: ROLES.USER, content: getMessage(message) },
  ]
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: CHATGPT_MODEL,
    })

    return completion.choices[0].message
  } catch (e) {
    console.error('Error while chat completion', e.message)
  }
}
