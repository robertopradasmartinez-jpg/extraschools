'use client'

import { useEffect, useState } from 'react'
import { Star, User, Loader2 } from 'lucide-react'
import StarRating from './StarRating'

interface Review {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  user: {
    name: string | null
  }
}

interface ReviewListProps {
  activityId: string
  refreshTrigger?: number
}

export default function ReviewList({ activityId, refreshTrigger = 0 }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [stats, setStats] = useState({ total: 0, average: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const reviewsPerPage = 5

  useEffect(() => {
    fetchReviews()
  }, [activityId, refreshTrigger])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews?activityId=${activityId}`)
      const data = await response.json()
      
      if (response.ok) {
        setReviews(data.reviews || [])
        setStats(data.stats || { total: 0, average: 0 })
      }
    } catch (error) {
      console.error('Error al cargar reseñas:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const paginatedReviews = reviews.slice(0, page * reviewsPerPage)
  const hasMore = reviews.length > paginatedReviews.length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aún no hay reseñas
        </h3>
        <p className="text-gray-600">
          Sé el primero en compartir tu experiencia con esta actividad
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Stats Summary */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 border border-secondary-200 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl font-bold text-gray-900">{stats.average.toFixed(1)}</span>
              <div>
                <StarRating rating={Math.round(stats.average)} readonly size="md" />
                <p className="text-sm text-gray-600 mt-1">
                  Basado en {stats.total} {stats.total === 1 ? 'reseña' : 'reseñas'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Rating Distribution (opcional para futuro) */}
          <div className="hidden lg:block">
            <p className="text-sm text-gray-600">Calidad excelente</p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {paginatedReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.user.name || 'Usuario'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>
              <StarRating rating={review.rating} readonly size="sm" />
            </div>

            {/* Review Comment */}
            {review.comment && (
              <p className="text-gray-700 leading-relaxed">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setPage(page + 1)}
            className="px-6 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-secondary-50 rounded-lg transition"
          >
            Ver más reseñas ({reviews.length - paginatedReviews.length} restantes)
          </button>
        </div>
      )}
    </div>
  )
}
