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
}

export default function SearchMapSection({ activities }: SearchMapSectionProps) {
  return (
    <div className="mb-8 mt-4 relative z-0">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Map className="w-5 h-5 text-primary-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Mapa de España
            </h2>
          </div>
          <span className="text-sm text-gray-600 bg-primary-50 px-3 py-1 rounded-full">
            {activities.length} {activities.length === 1 ? 'actividad' : 'actividades'}
          </span>
        </div>
        <GoogleMultipleMarkersMap activities={activities} height="600px" />
      </div>
    </div>
  );
}
