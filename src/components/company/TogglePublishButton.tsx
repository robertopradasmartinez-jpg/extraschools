'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function TogglePublishButton({
  activityId,
  published,
}: {
  activityId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/company/activities/${activityId}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar');
      }

      router.refresh();
    } catch (error) {
      alert('Error al actualizar el estado');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition disabled:opacity-50 ${
        published
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      }`}
    >
      {published ? (
        <>
          <Eye className="w-3 h-3 mr-1" />
          Publicada
        </>
      ) : (
        <>
          <EyeOff className="w-3 h-3 mr-1" />
          Borrador
        </>
      )}
    </button>
  );
}
