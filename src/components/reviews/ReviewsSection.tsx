'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import ReviewForm from './ReviewForm'
import ReviewList from './ReviewList'

interface ReviewsSectionProps {
  activityId: string
  activityTitle: string
}

export default function ReviewsSection({ activityId, activityTitle }: ReviewsSectionProps) {
  const { data: session } = useSession()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleReviewSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="space-y-8">
      {/* Review Form - Solo para padres autenticados */}
      {session?.user && session.user.role === 'PARENT' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Deja tu reseña
          </h2>
          <ReviewForm
            activityId={activityId}
            activityTitle={activityTitle}
            onSuccess={handleReviewSuccess}
          />
        </div>
      )}

      {/* Reviews List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Reseñas de padres
        </h2>
        <ReviewList activityId={activityId} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  )
}
