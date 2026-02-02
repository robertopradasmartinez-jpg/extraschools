import SearchPageClient from '@/components/search/SearchPageClient'
import { Suspense } from 'react'

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
        <Suspense fallback={
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando búsqueda...</p>
          </div>
        }>
          <SearchPageClient />
        </Suspense>
      </div>
    </div>
  )
}
