'use client'

import { useRef } from 'react'

interface ChatComposerProps {
  input: string
  onInputChange: (value: string) => void
  hasFile: boolean
  onPickFile: (file: File) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  isAnalyzing: boolean
}

export default function ChatComposer({
  input,
  onInputChange,
  hasFile,
  onPickFile,
  onSubmit,
  isLoading,
  isAnalyzing,
}: ChatComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) onPickFile(selected)
    e.target.value = ''
  }

  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-white">
      <form onSubmit={onSubmit} className="flex gap-2">
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
          className="cursor-pointer px-3 py-2.5 border border-gray-200 rounded-xl text-gray-400 hover:text-orange-600 hover:border-orange-400 transition-colors"
        >
          📎
        </button>

        <input
          value={input}
          onChange={e => onInputChange(e.target.value)}
          placeholder={hasFile ? 'Describe the problem (optional)…' : 'Type your message…'}
          disabled={isLoading}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={(!input.trim() && !hasFile) || isLoading}
          className="cursor-pointer px-4 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? '…' : 'Send'}
        </button>
      </form>
    </div>
  )
}
