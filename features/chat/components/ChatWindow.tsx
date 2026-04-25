'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useRef, useEffect } from 'react'

export default function ChatWindow() {
  const [input, setInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })

  const isLoading = status === 'streaming' || status === 'submitted' || analyzing

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

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
      formData.append('question', messageText || 'Describe el problema que ves')

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            T
          </div>
          <div>
            <p className="font-semibold text-sm">TaskFlow Support</p>
            <p className="text-xs text-gray-500">Powered by Claude</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Nueva conversación
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
              👋
            </div>
            <p className="font-medium text-gray-700">¿En qué puedo ayudarte hoy?</p>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {[
                '¿Cuáles son los planes?',
                'Ver mis tickets',
                'Reportar un problema',
              ].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage({ text: suggestion })}
                  className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
              }`}
            >
              {message.parts.map((part, i) => {
                if (part.type === 'text') {
                  return (
                    <p key={i} className="whitespace-pre-wrap leading-relaxed">
                      {part.text}
                    </p>
                  )
                }

                if (part.type.startsWith('tool-') && 'state' in part) {
                  const isRunning =
                    part.state === 'input-streaming' ||
                    part.state === 'input-available'
                  const toolName = part.type.replace('tool-', '')

                  return (
                    <div
                      key={i}
                      className="text-xs text-gray-400 flex items-center gap-1 py-1"
                    >
                      {isRunning ? (
                        <>
                          <span className="animate-spin inline-block">⚙️</span>
                          Consultando {toolName}...
                        </>
                      ) : (
                        <>✅ {toolName}</>
                      )}
                    </div>
                  )
                }

                return null
              })}
            </div>
          </div>
        ))}

        {/* Loading states */}
        {analyzing && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm text-xs text-gray-500 flex items-center gap-2">
              <span className="animate-spin inline-block">⚙️</span>
              Analizando archivo...
            </div>
          </div>
        )}

        {status === 'streaming' || status === 'submitted' ? (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
              </span>
            </div>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>

      {/* File preview */}
      {file && (
        <div className="px-6 py-2 bg-blue-50 border-t border-blue-100 flex items-center justify-between">
          <p className="text-xs text-blue-700 flex items-center gap-1">
            📎 {file.name}
          </p>
          <button
            onClick={() => setFile(null)}
            className="text-xs text-blue-400 hover:text-blue-600"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          {/* Botón adjuntar */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf,.txt,.md"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-gray-400 hover:text-blue-600 hover:border-blue-400 transition-colors"
          >
            📎
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={file ? 'Describe el problema (opcional)...' : 'Escribe tu mensaje...'}
            disabled={isLoading}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={(!input.trim() && !file) || isLoading}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {analyzing ? '...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  )
}