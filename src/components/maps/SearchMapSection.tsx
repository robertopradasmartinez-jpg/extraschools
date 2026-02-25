'use client';

import dynamic from 'next/dynamic';
import { Map } from 'lucide-react';

// Cargar el mapa de Google solo en el cliente
const GoogleMultipleMarkersMap = dynamic(
  () => import('@/components/maps/GoogleMultipleMarkersMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-gray-100 rounded-lg animate-pulse" />
    ),
  }
);

interface Activity {
  id: string;
  title: string;
  latitude: number | null;
  longitude: number | null;
  city: string;
  price: number;
  images: string[];
  category: string;
}

interface SearchMapSectionProps {
  activities: Activity[];
  totalCount?: number;
}

export default function SearchMapSection({ activities, totalCount }: SearchMapSectionProps) {
  // Use totalCount if it's greater than 0, otherwise fall back to activities.length
  const displayCount = totalCount && totalCount > 0 ? totalCount : activities.length;
  
  return (
    <div className="mb-8 mt-4 relative z-0">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Map className="w-5 h-5 text-primary-500 mr-2" />
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Mapa de España
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-gray-600 bg-primary-50 px-2 sm:px-3 py-1 rounded-full">
            {displayCount} {displayCount === 1 ? 'actividad' : 'actividades'}
          </span>
        </div>
        {/* Altura responsive: más pequeña en móvil */}
        <div className="h-[400px] sm:h-[500px] md:h-[600px]">
          <GoogleMultipleMarkersMap activities={activities} height="100%" />
        </div>
      </div>
    </div>
  );
}
