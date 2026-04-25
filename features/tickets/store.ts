import type { Ticket, TicketPriority, TicketStore } from '@/shared/types/ticket'

const globalRef = globalThis as unknown as { __ticketStore?: TicketStore }

const store: TicketStore = (globalRef.__ticketStore ??= {
  tickets: [
    {
      id: 'TK-001',
      userId: 'user_123',
      subject: 'Cannot export my data',
      description: 'When I try to export to CSV the file comes out empty.',
      status: 'open',
      priority: 'high',
      createdAt: new Date('2026-04-20'),
      updatedAt: new Date('2026-04-20'),
    },
    {
      id: 'TK-002',
      userId: 'user_123',
      subject: 'Slack integration not working',
      description: 'Notifications are not arriving in the configured channel.',
      status: 'in_progress',
      priority: 'medium',
      createdAt: new Date('2026-04-21'),
      updatedAt: new Date('2026-04-22'),
    },
  ],
  nextId: 3,
})

export async function getTicketsByUser(userId: string): Promise<Ticket[]> {
  return store.tickets.filter(t => t.userId === userId)
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  return store.tickets.find(t => t.id === id) ?? null
}

export async function createTicket(
  userId: string,
  subject: string,
  description: string,
  priority: TicketPriority = 'medium'
): Promise<Ticket> {
  const ticket: Ticket = {
    id: `TK-00${store.nextId++}`,
    userId,
    subject,
    description,
    status: 'open',
    priority,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  store.tickets.push(ticket)
  return ticket
}
