'use client'

import { useState } from 'react'
import { Star, Loader2, CheckCircle2 } from 'lucide-react'
import StarRating from './StarRating'

interface ReviewFormProps {
  activityId: string
  activityTitle: string
  onSuccess?: () => void
}

export default function ReviewForm({ activityId, activityTitle, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError('Por favor selecciona una calificación')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId,
          rating,
          comment: comment.trim() || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setRating(0)
        setComment('')
        
        setTimeout(() => {
          setSuccess(false)
          onSuccess?.()
        }, 2000)
      } else {
        setError(data.error || 'Error al enviar la reseña')
      }
    } catch (err) {
      setError('Error al enviar la reseña')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3 text-green-700">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <p className="font-semibold">¡Reseña enviada!</p>
            <p className="text-sm">Gracias por compartir tu experiencia.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Deja tu reseña para "{activityTitle}"
      </h3>

      {/* Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Calificación *
        </label>
        <div className="flex items-center gap-2">
          <StarRating rating={rating} onRatingChange={setRating} size="lg" />
          {rating > 0 && (
            <span className="text-sm text-gray-600">
              ({rating} {rating === 1 ? 'estrella' : 'estrellas'})
            </span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-6">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Comentario (opcional)
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Comparte tu experiencia con esta actividad..."
          disabled={loading}
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <p className="text-xs text-gray-500 mt-1">
          {comment.length}/500 caracteres
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Star className="w-5 h-5" />
            Publicar Reseña
          </>
        )}
      </button>
    </form>
  )
}
