'use client'

const SUGGESTIONS = [
  'What plans do you offer?',
  'Show my tickets',
  'Report a problem',
]

interface EmptyStateProps {
  onPick: (text: string) => void
}

export default function EmptyState({ onPick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
        👋
      </div>
      <p className="font-medium text-gray-700">How can I help you today?</p>
      <div className="flex flex-wrap gap-2 justify-center mt-2">
        {SUGGESTIONS.map(suggestion => (
          <button
            key={suggestion}
            onClick={() => onPick(suggestion)}
            className="text-xs px-3 py-1.5 bg-white border border-gray-300 rounded-full text-gray-700 hover:border-orange-400 hover:text-orange-600 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}
