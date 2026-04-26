import Link from 'next/link'

export function LandingHero() {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-16 sm:pt-24 pb-12 space-y-6">
      <p className="text-xs uppercase tracking-widest text-orange-600 font-semibold">
        Portfolio project &middot; Julian Lopez &middot; AI Engineer
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
          <span aria-hidden>&rarr;</span>
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
  )
}
