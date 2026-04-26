const NODE_TONES = {
  neutral: 'bg-white border-gray-200 text-gray-800',
  accent: 'bg-orange-50 border-orange-200 text-orange-900',
  strong: 'bg-gray-900 border-gray-900 text-white',
  muted: 'bg-gray-50 border-gray-200 text-gray-600',
} as const

interface ArchNodeProps {
  label: string
  sub: string
  tone: keyof typeof NODE_TONES
}

function ArchNode({ label, sub, tone }: ArchNodeProps) {
  return (
    <div className={`rounded-xl border px-4 py-3 ${NODE_TONES[tone]}`}>
      <p className="text-sm font-semibold">{label}</p>
      <p className={`text-xs mt-0.5 font-mono ${tone === 'strong' ? 'text-gray-300' : 'text-gray-500'}`}>
        {sub}
      </p>
    </div>
  )
}

function ArchArrow() {
  return (
    <div className="flex justify-center text-gray-300" aria-hidden>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1v12M3 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

export function LandingHowItWorks() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-12 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">How it works</h2>
        <p className="text-sm text-gray-500">
          Two SDKs by design: the Vercel AI SDK drives streaming and the tool loop; the Anthropic SDK
          is used directly for file uploads, where the lower-level surface is a better fit.{' '}
          <a
            href="https://github.com/stivenslop2/ai-support-agent-v1#readme"
            target="_blank"
            rel="noreferrer"
            className="text-orange-600 hover:text-orange-700 underline"
          >
            Read the full README
          </a>
          .
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-6 sm:p-8 space-y-3">
        <ArchNode
          label="Browser"
          sub="app/chat · features/chat/components/*"
          tone="neutral"
        />
        <ArchArrow />
        <ArchNode
          label="Route handlers"
          sub="app/api/chat · app/api/analyze · app/api/usage"
          tone="neutral"
        />
        <ArchArrow />
        <div className="grid sm:grid-cols-2 gap-3">
          <ArchNode
            label="Vercel AI SDK"
            sub="streamText · tools · stepCountIs(5)"
            tone="accent"
          />
          <ArchNode
            label="Anthropic SDK"
            sub="messages.create · image + document blocks"
            tone="accent"
          />
        </div>
        <ArchArrow />
        <ArchNode label="Anthropic API" sub="Claude Haiku 4.5" tone="strong" />
        <ArchArrow />
        <ArchNode
          label="In-memory stores"
          sub="tickets · usage records · KB markdown"
          tone="muted"
        />
      </div>
    </section>
  )
}
