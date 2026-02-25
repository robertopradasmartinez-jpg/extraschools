import SearchPageClient from '@/components/search/SearchPageClient'
import { Suspense } from 'react'
import { Metadata } from 'next'

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Buscar Actividades Extraescolares',
  description: 'Busca y compara actividades extraescolares en toda España. Filtra por categoría, ciudad, edad y precio. Encuentra la actividad perfecta para tus hijos.',
  keywords: ['buscar actividades', 'extraescolares cerca', 'actividades por ciudad', 'comparar precios extraescolares'],
  openGraph: {
    title: 'Buscar Actividades Extraescolares | ExtraSchools',
    description: 'Encuentra la actividad perfecta para tus hijos. Filtra por categoría, ciudad, edad y precio.',
    url: 'https://extraschools.es/search',
  },
};

export default function SearchPage() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen relative z-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-3">
            Buscar Actividades
          </h1>
          <p className="text-lg text-gray-600 font-medium">
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
