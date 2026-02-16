'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, MapPin, Star } from 'lucide-react'
import { formatPrice, getPriceTypeLabel } from '@/lib/utils'
import { useViewTracking } from '@/lib/viewTracking'

interface ActivityCardProps {
  id: string
  title: string
  description: string
  price: number
  priceType?: string
  priceTypeCustom?: string
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
  priceType = 'mes',
  priceTypeCustom = '',
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
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
      {/* Image */}
      <Link href={`/activity/${id}`} onClick={handleActivityClick}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={images[0] || '/placeholder-activity.jpg'}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Category Badge */}
          <div className="absolute top-4 left-4 bg-white px-4 py-1.5 rounded-full text-xs font-bold text-primary-600 shadow-md">
            {category}
          </div>
        </div>
      </Link>

      {/* Favorite Button */}
      {onToggleFavorite && (
        <button
          onClick={onToggleFavorite}
          className="absolute top-4 right-4 bg-white p-2.5 rounded-full hover:scale-110 transition-all shadow-md z-10"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? 'fill-secondary-500 text-secondary-500' : 'text-gray-600'
            }`}
          />
        </button>
      )}

      {/* Content */}
      <Link href={`/activity/${id}`} onClick={handleActivityClick}>
        <div className="p-5">
          {/* Location & Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-sm text-gray-600 font-medium">
              <MapPin className="w-4 h-4 mr-1.5 text-primary-500" />
              <span>{city}</span>
            </div>
            {reviewCount > 0 && (
              <div className="flex items-center text-sm bg-yellow-50 px-2.5 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-bold text-gray-900">{averageRating.toFixed(1)}</span>
                <span className="text-gray-500 ml-1">({reviewCount})</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-500 transition">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>

          {/* Price */}
          <div className="flex items-baseline pt-2 border-t border-gray-100">
            <span className="text-2xl font-black bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              {formatPrice(price)}
            </span>
            <span className="text-sm text-gray-500 ml-2 font-semibold">{getPriceTypeLabel(priceType, priceTypeCustom)}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
