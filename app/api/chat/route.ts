import { streamText, stepCountIs, convertToModelMessages, UIMessage } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { z } from 'zod'
import { searchKnowledge } from '@/features/knowledge-base/search'
import { getTicketsByUser, getTicketById, createTicket } from '@/features/tickets/store'
import { calculateCost } from '@/shared/lib/cost'
import { trackUsage } from '@/shared/lib/usage-tracker'
import { TICKET_PRIORITIES, type TicketPriority } from '@/shared/types/ticket'

export const maxDuration = 30

const CURRENT_USER_ID = 'user_123'
const MODEL = 'claude-haiku-4-5-20251001'

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: anthropic('claude-haiku-4-5'),
    system: `You are a support agent for TaskFlow, a project-management SaaS.
Your goal is to help users resolve their issues concisely and empathetically.

Rules:
- ALWAYS use the available tools before answering.
- If the user asks about their tickets, use getTickets.
- If they ask about product features, plans, or integrations, use searchKnowledge.
- If they want to file a problem you can't resolve directly, use createTicket.
- Reply in the same language the user wrote in.
- Be concise — three short paragraphs maximum.`,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      searchKnowledge: {
        description: 'Search the TaskFlow knowledge base for product features, plans, and integrations.',
        inputSchema: z.object({
          query: z.string().describe('The topic to search for'),
        }),
        execute: async ({ query }: { query: string }) => {
          return { result: searchKnowledge(query) }
        },
      },
      getTickets: {
        description: 'Fetch the current user\'s support tickets. Use it when they ask about the status of their reports.',
        inputSchema: z.object({}),
        execute: async () => {
          const tickets = await getTicketsByUser(CURRENT_USER_ID)
          return tickets.length === 0
            ? { message: 'You have no open tickets.' }
            : { tickets }
        },
      },
      getTicketById: {
        description: 'Fetch the details of a single ticket by its ID, e.g. TK-001.',
        inputSchema: z.object({
          id: z.string().describe('Ticket ID'),
        }),
        execute: async ({ id }: { id: string }) => {
          const ticket = await getTicketById(id)
          return ticket ?? { error: `Ticket ${id} was not found.` }
        },
      },
      createTicket: {
        description: 'Create a new support ticket when the issue cannot be resolved directly in chat.',
        inputSchema: z.object({
          subject: z.string().describe('Short title for the issue'),
          description: z.string().describe('Detailed description of the issue'),
          priority: z.enum(TICKET_PRIORITIES),
        }),
        execute: async ({ subject, description, priority }: {
          subject: string
          description: string
          priority: TicketPriority
        }) => {
          const ticket = await createTicket(CURRENT_USER_ID, subject, description, priority)
          return { success: true, ticketId: ticket.id, message: `Ticket ${ticket.id} created.` }
        },
      },
    },
  })

  // Fire-and-forget so the stream is never blocked.
  result.usage.then(usage => {
    const inputTokens = usage.inputTokens ?? 0
    const outputTokens = usage.outputTokens ?? 0
    const cost = calculateCost(MODEL, inputTokens, outputTokens)
    trackUsage(MODEL, inputTokens, outputTokens, cost)
    console.log(`$${cost.toFixed(8)} | ${inputTokens} in, ${outputTokens} out`)
  })

  return result.toUIMessageStreamResponse()
}
