'use client'

import { Star } from 'lucide-react'

interface StarRatingProps {
  rating: number
  onRatingChange?: (rating: number) => void
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  showNumber?: boolean
}

export default function StarRating({
  rating,
  onRatingChange,
  size = 'md',
  readonly = false,
  showNumber = false,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const starSize = sizeClasses[size]

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
          aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
        >
          <Star
            className={`${starSize} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-none text-gray-300'
            }`}
          />
        </button>
      ))}
      {showNumber && (
        <span className="ml-1 text-sm font-medium text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
