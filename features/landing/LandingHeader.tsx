export function LandingHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <p className="text-sm font-semibold tracking-tight text-gray-900">
          TaskFlow AI Support Agent
        </p>
        <a
          href="https://stivenslop-staging.up.railway.app"
          className="text-sm text-gray-600 hover:text-orange-600 transition-colors"
        >
          <span aria-hidden>&larr;</span> Portfolio
        </a>
      </div>
    </header>
  )
}
