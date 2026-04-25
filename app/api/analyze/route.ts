import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  const question = formData.get('question') as string ?? 'Describe el problema que ves en este archivo'

  if (!file) {
    return Response.json({ error: 'file is required' }, { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const mimeType = file.type

  const isImage = mimeType.startsWith('image/')
  const isPdf = mimeType === 'application/pdf'
  const isText = mimeType === 'text/plain' || mimeType === 'text/markdown'

  if (!isImage && !isPdf && !isText) {
    return Response.json(
      { error: 'Formato no soportado. Usa imagen (jpg, png) o documento (pdf, txt, md)' },
      { status: 400 }
    )
  }

  const fileContent = isImage
    ? {
        type: 'image' as const,
        source: {
          type: 'base64' as const,
          media_type: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
          data: base64,
        },
      }
    : isPdf
      ? {
          type: 'document' as const,
          source: {
            type: 'base64' as const,
            media_type: 'application/pdf' as const,
            data: base64,
          },
        }
      : {
          type: 'document' as const,
          source: {
            type: 'text' as const,
            media_type: 'text/plain' as const,
            data: Buffer.from(arrayBuffer).toString('utf-8'),
          },
        }

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system: `Eres un agente de soporte técnico para TaskFlow.
Analiza el archivo que te envía el usuario e identifica:
1. El problema específico que se observa
2. Posible causa
3. Pasos recomendados para resolverlo
Sé conciso y práctico.`,
    messages: [
      {
        role: 'user',
        content: [
          fileContent,
          {
            type: 'text' as const,
            text: question,
          },
        ],
      },
    ],
  })

  const text = response.content
    .filter(block => block.type === 'text')
    .map(block => block.text)
    .join('')

  return Response.json({
    analysis: text,
    fileType: isImage ? 'image' : 'document',
    usage: response.usage,
  })
}