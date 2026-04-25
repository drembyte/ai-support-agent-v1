import { streamText, stepCountIs, convertToModelMessages, UIMessage } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'
import { searchKnowledge } from '@/features/knowledge-base/search'
import { getTicketsByUser, getTicketById, createTicket } from '@/features/tickets/store'

export const maxDuration = 30

const CURRENT_USER_ID = 'user_123'

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: anthropic('claude-haiku-4-5'),
    system: `Eres un agente de soporte para TaskFlow, un SaaS de gestión de proyectos.
Tu objetivo es ayudar a los usuarios a resolver sus problemas de forma concisa y empática.

Reglas:
- Usa SIEMPRE las tools disponibles antes de responder
- Si el usuario pregunta por sus tickets, usa getTickets
- Si pregunta por funcionalidades del producto, usa searchKnowledge
- Si quiere crear un ticket, usa createTicket
- Responde en el mismo idioma que el usuario
- Sé conciso — máximo 3 párrafos`,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      searchKnowledge: {
        description: 'Busca información en la KB de TaskFlow sobre funcionalidades, planes e integraciones.',
        inputSchema: z.object({
          query: z.string().describe('El tema a buscar'),
        }),
        execute: async ({ query }: { query: string }) => {
          return { result: searchKnowledge(query) }
        },
      },
      getTickets: {
        description: 'Obtiene los tickets del usuario. Úsala cuando pregunte por el estado de sus reportes.',
        inputSchema: z.object({}),
        execute: async () => {
          const tickets = await getTicketsByUser(CURRENT_USER_ID)
          return tickets.length === 0
            ? { message: 'No tienes tickets abiertos.' }
            : { tickets }
        },
      },
      getTicketById: {
        description: 'Obtiene el detalle de un ticket por su ID, ejemplo TK-001.',
        inputSchema: z.object({
          id: z.string().describe('ID del ticket'),
        }),
        execute: async ({ id }: { id: string }) => {
          const ticket = await getTicketById(id)
          return ticket ?? { error: `No encontré el ticket ${id}` }
        },
      },
      createTicket: {
        description: 'Crea un nuevo ticket cuando el problema no se puede resolver directamente.',
        inputSchema: z.object({
          subject: z.string().describe('Título del problema'),
          description: z.string().describe('Descripción detallada'),
          priority: z.enum(['low', 'medium', 'high']),
        }),
        execute: async ({ subject, description, priority }: {
          subject: string
          description: string
          priority: 'low' | 'medium' | 'high'
        }) => {
          const ticket = await createTicket(CURRENT_USER_ID, subject, description, priority)
          return { success: true, ticketId: ticket.id, message: `Ticket ${ticket.id} creado.` }
        },
      },
    },
  })

  return result.toUIMessageStreamResponse()
}