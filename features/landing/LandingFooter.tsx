export function LandingFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-3 text-sm">
        <p className="font-medium text-gray-900">
          Built by Julian Lopez &mdash; AI Engineer
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 text-gray-600">
          <a
            href="https://julianlopez.dev"
            className="hover:text-orange-600 transition-colors"
          >
            Portfolio
          </a>
          <span aria-hidden className="text-gray-400">&middot;</span>
          <a
            href="https://www.linkedin.com/in/stiven-julian-lopez/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-orange-600 transition-colors"
          >
            LinkedIn
          </a>
          <span aria-hidden className="text-gray-400">&middot;</span>
          <a
            href="https://github.com/stivenslop2"
            target="_blank"
            rel="noreferrer"
            className="hover:text-orange-600 transition-colors"
          >
            GitHub
          </a>
          <span aria-hidden className="text-gray-400">&middot;</span>
          <a
            href="mailto:stivenslop@hotmail.com"
            className="hover:text-orange-600 transition-colors"
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  )
}
