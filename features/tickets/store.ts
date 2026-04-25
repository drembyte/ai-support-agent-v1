export interface Ticket {
  id: string
  userId: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  updatedAt: Date
}

// Misma técnica que task-manager-ai — globalThis para HMR
interface TicketStore {
  tickets: Ticket[]
  nextId: number
}

const globalRef = globalThis as unknown as { __ticketStore?: TicketStore }

const store: TicketStore = (globalRef.__ticketStore ??= {
  tickets: [
    {
      id: 'TK-001',
      userId: 'user_123',
      subject: 'No puedo exportar mis datos',
      description: 'Al intentar exportar en CSV el archivo sale vacío',
      status: 'open',
      priority: 'high',
      createdAt: new Date('2026-04-20'),
      updatedAt: new Date('2026-04-20'),
    },
    {
      id: 'TK-002',
      userId: 'user_123',
      subject: 'Integración con Slack no funciona',
      description: 'Las notificaciones no llegan al canal configurado',
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
  priority: Ticket['priority'] = 'medium'
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