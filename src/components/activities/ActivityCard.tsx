'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Star } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useViewTracking } from '@/lib/viewTracking'

interface ActivityCardProps {
  id: string
  title: string
  description: string
  price: number
  city: string
  images: string[]
  category: string
  averageRating?: number
  reviewCount?: number
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

export default function ActivityCard({
  id,
  title,
  description,
  price,
  city,
  images,
  category,
  averageRating = 0,
  reviewCount = 0,
  isFavorite = false,
  onToggleFavorite,
}: ActivityCardProps) {
  const { trackView } = useViewTracking()

  const handleActivityClick = async () => {
    // Trackear la visualización antes de navegar
    await trackView(id)
  }

  // Always use Spanish text directly - no translation needed
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      {/* Image */}
      <Link href={`/activity/${id}`} onClick={handleActivityClick}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={images[0] || '/placeholder-activity.jpg'}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700">
            {category}
          </div>
        </div>
      </Link>

      {/* Favorite Button */}
      {onToggleFavorite && (
        <button
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition z-10"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-primary-500 text-primary-500' : 'text-gray-700'
            }`}
          />
        </button>
      )}

      {/* Content */}
      <Link href={`/activities/${id}`}>
        <div className="p-4">
          {/* Location & Rating */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{city}</span>
            </div>
            {reviewCount > 0 && (
              <div className="flex items-center text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500 ml-1">({reviewCount})</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-500 transition">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {description}
          </p>

          {/* Price */}
          <div className="flex items-baseline">
            <span className="text-lg font-semibold text-gray-900">
              {formatPrice(price)}
            </span>
            <span className="text-sm text-gray-500 ml-1">/mes</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
