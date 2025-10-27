'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteActivityButton({ activityId }: { activityId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta actividad? Esta acción no se puede deshacer.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/company/activities/${activityId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar');
      }

      router.refresh();
    } catch (error) {
      alert('Error al eliminar la actividad');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
      title="Eliminar"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
