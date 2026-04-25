'use client'

interface ToolCallIndicatorProps {
  toolName: string
  isRunning: boolean
}

export default function ToolCallIndicator({ toolName, isRunning }: ToolCallIndicatorProps) {
  return (
    <div className="text-xs text-gray-400 flex items-center gap-1 py-1">
      {isRunning ? (
        <>
          <span className="animate-spin inline-block">⚙️</span>
          Calling {toolName}…
        </>
      ) : (
        <>✅ {toolName}</>
      )}
    </div>
  )
}
