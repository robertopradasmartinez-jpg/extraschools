'use client'

import { useState, useEffect } from 'react'
import { Loader2, Frown } from 'lucide-react'
import ActivityCard from '@/components/activities/ActivityCard'
import Pagination from '@/components/search/Pagination'
import { FilterState } from '@/components/search/SearchFilters'

interface Activity {
  id: string
  title: string
  description: string
  price: number
  priceType?: string
  priceTypeCustom?: string
  city: string
  images: string[]
  category: string
  averageRating: number
  reviewCount: number
  latitude?: number | null
  longitude?: number | null
}

interface SearchResultsProps {
  filters: FilterState
  onActivitiesUpdate?: (activities: Activity[]) => void
  currentPage?: number
  onPageChange?: (page: number) => void
}

export default function SearchResults({ 
  filters, 
  onActivitiesUpdate,
  currentPage = 1,
  onPageChange 
}: SearchResultsProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchActivities()
  }, [filters, currentPage])

  const fetchActivities = async () => {
    setLoading(true)
    setError('')

    try {
      // Construir query params
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value)
        }
      })
      
      // Agregar paginación
      params.append('page', currentPage.toString())
      params.append('limit', '12')

      const response = await fetch(`/api/activities?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        const fetchedActivities = data.activities || []
        setActivities(fetchedActivities)
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 1)
        
        // Notify parent component of activities update
        if (onActivitiesUpdate) {
          onActivitiesUpdate(fetchedActivities)
        }
        
        // Scroll to top when page changes
        if (currentPage > 1) {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      } else {
        setError(data.error || 'Error al cargar actividades')
      }
    } catch (err) {
      setError('Error al cargar las actividades')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-12 h-12 animate-spin text-primary-500 mb-4" />
        <p className="text-gray-600">Buscando actividades...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchActivities}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <Frown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No se encontraron actividades
        </h3>
        <p className="text-gray-600 mb-4">
          Intenta ajustar los filtros para encontrar más resultados
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Results Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {total} {total === 1 ? 'actividad encontrada' : 'actividades encontradas'}
        </h2>
        {totalPages > 1 && (
          <p className="text-sm text-gray-600 mt-1">
            Página {currentPage} de {totalPages}
          </p>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            id={activity.id}
            title={activity.title}
            description={activity.description}
            price={activity.price}
            priceType={activity.priceType}
            priceTypeCustom={activity.priceTypeCustom}
            city={activity.city}
            images={activity.images}
            category={activity.category}
            averageRating={activity.averageRating}
            reviewCount={activity.reviewCount}
          />
        ))}
      </div>

      {/* Pagination */}
      {onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}
