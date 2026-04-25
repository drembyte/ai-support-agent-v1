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
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
            >
              Open the chat
              <span aria-hidden>→</span>
            </Link>
            <a
              href="https://github.com/stivenslop2/ai-support-agent-v1"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 transition-colors"
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
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Architecture</h2>
          <p className="text-sm text-gray-500">
            Two SDKs by design: the Vercel AI SDK handles streaming and the tool loop; the Anthropic SDK is
            used directly for file uploads where the lower-level surface is more convenient.
          </p>
          <pre className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-xs leading-relaxed text-gray-700 overflow-x-auto font-mono">
{`           ┌─────────────────────────────────┐
  Client ──►  app/chat (client component)   ──► useChat (Vercel AI SDK)
           │  features/chat/components/*    │
           └────────────────┬────────────────┘
                            │ stream / fetch
                            ▼
                   Route handlers (app/api/*)
                            │
              ┌─────────────┴──────────────┐
              ▼                            ▼
   Vercel AI SDK (streamText,     Anthropic SDK direct
   tools, stepCountIs)             (messages.create
              │                     with image / document)
              ▼                            │
        Anthropic API ◄────────────────────┘
              │
              ▼
   In-memory stores: tickets · usage · KB markdown`}
          </pre>
        </section>

        {/* CTA footer */}
        <section className="pt-4">
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
          >
            Try the chat
            <span aria-hidden>→</span>
          </Link>
        </section>
      </div>
    </main>
  )
}
