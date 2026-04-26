const TECHNIQUES = [
  {
    name: 'Streaming chat',
    description:
      "Token-by-token responses over Server-Sent Events using the Vercel AI SDK's streamText.",
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

export function LandingSkills() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-12 space-y-4">
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
  )
}
