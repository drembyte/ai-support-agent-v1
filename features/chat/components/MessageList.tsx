'use client'

import { useEffect, useRef } from 'react'
import type { ChatMessage } from '@/shared/types/chat'
import MessageBubble from './MessageBubble'
import EmptyState from './EmptyState'
import TypingDots from './TypingDots'
import AnalyzingIndicator from './AnalyzingIndicator'

interface MessageListProps {
  messages: ChatMessage[]
  isAnalyzing: boolean
  isStreaming: boolean
  onSuggestionPick: (text: string) => void
}

export default function MessageList({
  messages,
  isAnalyzing,
  isStreaming,
  onSuggestionPick,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAnalyzing, isStreaming])

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
      {messages.length === 0 && <EmptyState onPick={onSuggestionPick} />}

      {messages.map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isAnalyzing && <AnalyzingIndicator />}
      {isStreaming && <TypingDots />}

      <div ref={bottomRef} />
    </div>
  )
}
