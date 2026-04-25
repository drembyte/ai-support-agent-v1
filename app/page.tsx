import Link from 'next/link'

const TECHNIQUES = [
  {
    name: 'Streaming chat',
    description:
      'Token-by-token responses over Server-Sent Events using the Vercel AI SDK\'s streamText.',
    location: 'app/api/chat/route.ts · features/chat/components/ChatWindow.tsx',
  },
  {
    name: 'Tool calling (agentic loop)',
    description:
      'Multi-step agent that searches the knowledge base, reads tickets, and creates new ones. stepCountIs(5) caps the loop.',
    location: 'app/api/chat/route.ts',
  },
  {
    name: 'File analysis',
    description:
      'Image and PDF attachments routed through the Anthropic SDK directly — vision + document understanding for visual diagnosis.',
    location: 'app/api/analyze/route.ts',
  },
  {
    name: 'Cost & usage tracking',
    description:
      'Every chat turn records token usage and USD cost via a fire-and-forget result.usage.then(…) so the stream is never blocked.',
    location: 'shared/lib/cost.ts · shared/lib/usage-tracker.ts · app/api/usage/route.ts',
  },
]

const STACK = [
  ['Framework', 'Next.js 16 (App Router, Turbopack)'],
  ['AI — streaming & tools', 'Vercel AI SDK v6 + @ai-sdk/anthropic'],
  ['AI — file analysis', '@anthropic-ai/sdk (direct)'],
  ['Model', 'Claude Haiku 4.5'],
  ['Language', 'TypeScript 5'],
  ['Styling', 'Tailwind CSS 4'],
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24 space-y-16">
        {/* Hero */}
        <section className="space-y-6">
          <p className="text-xs uppercase tracking-widest text-orange-600 font-semibold">
            Portfolio project · Julian Lopez · AI Engineer
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
            TaskFlow AI Support Agent
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
            A production-style customer support agent that showcases the LLM patterns I reach for in real
            products: streaming responses, tool-calling agents, file analysis with vision models, and
            per-turn cost tracking.
          </p>
          <p className="text-sm text-gray-500 max-w-2xl">
            Built on Next.js 16 (App Router) with the Vercel AI SDK v6, the Anthropic SDK, and Tailwind 4.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/chat"
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
            >
              Open the chat
              <span aria-hidden>→</span>
            </Link>
            <a
              href="https://github.com/stivenslop2/ai-support-agent-v1"
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 transition-colors"
            >
              View source
            </a>
          </div>
        </section>

        {/* Techniques */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">AI techniques demonstrated</h2>
          <p className="text-sm text-gray-500">
            Each row maps to a specific pattern from the Anthropic + Vercel AI SDK playbook and the file
            where it lives.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-medium">Technique</th>
                  <th className="px-4 py-3 font-medium">What it does here</th>
                  <th className="px-4 py-3 font-medium">Where to look</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {TECHNIQUES.map(t => (
                  <tr key={t.name} className="align-top">
                    <td className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">{t.name}</td>
                    <td className="px-4 py-4 text-gray-700">{t.description}</td>
                    <td className="px-4 py-4 text-gray-500 font-mono text-xs whitespace-pre-line">
                      {t.location.split(' · ').join('\n')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Stack */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Stack</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left">
              <tbody className="divide-y divide-gray-200">
                {STACK.map(([area, choice]) => (
                  <tr key={area}>
                    <td className="px-4 py-3 font-medium text-gray-900 w-1/3">{area}</td>
                    <td className="px-4 py-3 text-gray-700">{choice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Architecture */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">Architecture</h2>
            <p className="text-sm text-gray-500">
              Two SDKs by design: the Vercel AI SDK drives streaming and the tool loop; the Anthropic SDK
              is used directly for file uploads, where the lower-level surface is a better fit.
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

        {/* CTA footer */}
        <section className="pt-4">
          <Link
            href="/chat"
            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
          >
            Try the chat
            <span aria-hidden>→</span>
          </Link>
        </section>
      </div>
    </main>
  )
}

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
