'use client'

export default function AnalyzingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm text-xs text-gray-500 flex items-center gap-2">
        <span className="animate-spin inline-block">⚙️</span>
        Analyzing file…
      </div>
    </div>
  )
}
