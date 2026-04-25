'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState } from 'react'
import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import FilePreview from './FilePreview'
import ChatComposer from './ChatComposer'

export default function ChatWindow() {
  const [input, setInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })

  const isStreaming = status === 'streaming' || status === 'submitted'
  const isLoading = isStreaming || analyzing

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if ((!input.trim() && !file) || isLoading) return

    const messageText = input.trim()

    if (file) {
      const currentFile = file
      const userBubbleText = messageText
        ? `${messageText}\n📎 ${currentFile.name}`
        : `📎 ${currentFile.name}`

      setInput('')
      setFile(null)
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'user',
          parts: [{ type: 'text', text: userBubbleText }],
        },
      ])

      setAnalyzing(true)
      const formData = new FormData()
      formData.append('file', currentFile)
      formData.append('question', messageText || 'Describe the issue you see.')

      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      const data = await res.json()
      setAnalyzing(false)

      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          parts: [{ type: 'text', text: data.analysis }],
        },
      ])
      return
    }

    setInput('')
    sendMessage({ text: messageText })
  }

  return (
    <div className="flex flex-col h-screen w-full max-w-2xl mx-auto bg-white">
      <ChatHeader hasMessages={messages.length > 0} onReset={() => setMessages([])} />
      <MessageList
        messages={messages}
        isAnalyzing={analyzing}
        isStreaming={isStreaming}
        onSuggestionPick={text => sendMessage({ text })}
      />
      {file && <FilePreview file={file} onClear={() => setFile(null)} />}
      <ChatComposer
        input={input}
        onInputChange={setInput}
        hasFile={file !== null}
        onPickFile={setFile}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isAnalyzing={analyzing}
      />
    </div>
  )
}
