'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';

export default function AddToFavoritesButton({
  activityId,
  initialIsFavorite,
}: {
  activityId: string;
  initialIsFavorite: boolean;
}) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar favoritos');
      }

      const data = await response.json();
      setIsFavorite(data.isFavorite);
      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar favoritos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-lg transition disabled:opacity-50 ${
        isFavorite
          ? 'bg-secondary-50 text-primary-600 hover:bg-secondary-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      <Heart
        className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}
      />
    </button>
  );
}
