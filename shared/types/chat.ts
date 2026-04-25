import type { UIMessage } from 'ai'

export type ChatStatus = 'submitted' | 'streaming' | 'ready' | 'error'

export type ChatMessage = UIMessage
