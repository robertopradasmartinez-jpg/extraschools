'use client';

import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';

// Cargar GoogleMapComponent solo en el cliente
const GoogleMapComponent = dynamic(() => import('@/components/maps/GoogleMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse" />
  ),
});

interface ActivityMapSectionProps {
  latitude: number | null;
  longitude: number | null;
  title: string;
  address: string | null;
  city: string;
  province: string;
  postalCode: string;
}

export default function ActivityMapSection({
  latitude,
  longitude,
  title,
  address,
  city,
  province,
  postalCode,
}: ActivityMapSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 relative z-0">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Ubicación
      </h2>
      <div className="mb-4">
        <p className="text-gray-700 flex items-start">
          <MapPin className="w-5 h-5 mr-2 mt-0.5 text-primary-500" />
          <span>
            {address && `${address}, `}
            {city}, {province} {postalCode}
          </span>
        </p>
      </div>

      {/* Interactive Map */}
      {latitude && longitude ? (
        <GoogleMapComponent
          latitude={latitude}
          longitude={longitude}
          title={title}
          address={`${address}, ${city}`}
          height="300px"
          zoom={15}
        />
      ) : (
        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="font-medium">Ubicación no disponible</p>
          </div>
        </div>
      )}
    </div>
  );
}
