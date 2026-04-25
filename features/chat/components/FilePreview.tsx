'use client'

interface FilePreviewProps {
  file: File
  onClear: () => void
}

export default function FilePreview({ file, onClear }: FilePreviewProps) {
  return (
    <div className="px-6 py-2 bg-orange-50 border-t border-orange-100 flex items-center justify-between">
      <p className="text-xs text-orange-700 flex items-center gap-1">
        📎 {file.name}
      </p>
      <button
        onClick={onClear}
        className="cursor-pointer text-xs text-orange-400 hover:text-orange-600"
      >
        ✕
      </button>
    </div>
  )
}
