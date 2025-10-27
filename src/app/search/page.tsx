import SearchPageClient from '@/components/search/SearchPageClient'

export default function SearchPage() {
  return (
    <div className="bg-gray-50 min-h-screen relative z-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Buscar actividades extraescolares
          </h1>
          <p className="text-gray-600">
            Encuentra la actividad perfecta para tus hijos
          </p>
        </div>

        {/* Client Component with Filters and Results */}
        <SearchPageClient />
      </div>
    </div>
  )
}
