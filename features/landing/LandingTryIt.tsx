import Link from 'next/link'

export function LandingTryIt() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-12 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-900">Try it</h2>
      <p className="text-sm text-gray-600 max-w-2xl">
        Open the chat to ask the agent a support question, attach a screenshot of an error, or have
        it file a ticket on your behalf.
      </p>
      <div className="pt-2">
        <Link
          href="/chat"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-colors"
        >
          Try the chat
          <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </section>
  )
}
