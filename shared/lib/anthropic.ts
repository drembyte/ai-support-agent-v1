import Anthropic from '@anthropic-ai/sdk'

// Singleton — una sola instancia en toda la app
export const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})