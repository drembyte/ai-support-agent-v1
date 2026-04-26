'use client'

import type { ChatMessage } from '@/shared/types/chat'
import ToolCallIndicator from './ToolCallIndicator'
import MarkdownMessage from './MarkdownMessage'

interface MessageBubbleProps {
  message: ChatMessage
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
          isUser
            ? 'bg-orange-600 text-white'
            : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
        }`}
      >
        {message.parts.map((part, i) => {
          if (part.type === 'text') {
            if (isUser) {
              return (
                <p key={i} className="whitespace-pre-wrap leading-relaxed">
                  {part.text}
                </p>
              )
            }
            return <MarkdownMessage key={i} text={part.text} />
          }

          if (part.type.startsWith('tool-') && 'state' in part) {
            const isRunning =
              part.state === 'input-streaming' ||
              part.state === 'input-available'
            const toolName = part.type.replace('tool-', '')
            return <ToolCallIndicator key={i} toolName={toolName} isRunning={isRunning} />
          }

          return null
        })}
      </div>
    </div>
  )
}
