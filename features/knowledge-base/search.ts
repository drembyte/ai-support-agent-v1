import fs from 'fs'
import path from 'path'

// Lee el archivo de KB — en producción esto sería Supabase + pgvector
const KB_PATH = path.join(process.cwd(), 'features/knowledge-base/data/product.md')

export function searchKnowledge(query: string): string {
  const content = fs.readFileSync(KB_PATH, 'utf-8')
  const sections = content.split('\n##')

  // Búsqueda simple por keywords — Sprint 2 lo reemplaza con RAG
  const queryWords = query.toLowerCase().split(' ')
  const relevantSections = sections.filter(section =>
    queryWords.some(word => section.toLowerCase().includes(word))
  )

  if (relevantSections.length === 0) {
    return 'No encontré información relevante en la base de conocimiento.'
  }

  // Retorna las 2 secciones más relevantes
  return relevantSections.slice(0, 2).join('\n##')
}