'use client'

interface ChatHeaderProps {
  hasMessages: boolean
  onReset: () => void
}

export default function ChatHeader({ hasMessages, onReset }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-sm font-bold">
          T
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">TaskFlow Support</p>
          <p className="text-xs text-gray-500">Powered by Claude</p>
        </div>
      </div>
      {hasMessages && (
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          New conversation
        </button>
      )}
    </div>
  )
}
