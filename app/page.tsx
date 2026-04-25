import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          TaskFlow Support
        </h1>
        <p className="text-gray-500">
          Asistente de soporte con IA
        </p>
        <Link
          href="/chat"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Abrir chat →
        </Link>
      </div>
    </main>
  )
}