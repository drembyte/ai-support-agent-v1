import fs from 'fs'
import path from 'path'

const KB_PATH = path.join(process.cwd(), 'features/knowledge-base/data/product.md')

export function searchKnowledge(query: string): string {
  const content = fs.readFileSync(KB_PATH, 'utf-8')
  const sections = content.split('\n##')

  const queryWords = query.toLowerCase().split(' ')
  const relevantSections = sections.filter(section =>
    queryWords.some(word => section.toLowerCase().includes(word))
  )

  if (relevantSections.length === 0) {
    return 'No relevant information found in the knowledge base.'
  }

  return relevantSections.slice(0, 2).join('\n##')
}
