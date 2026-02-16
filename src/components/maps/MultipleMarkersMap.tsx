'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import Link from 'next/link';
import Image from 'next/image';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos por defecto de Leaflet en Next.js
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configurar icono por defecto
const DefaultIcon = new Icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface Activity {
  id: string;
  title: string;
  latitude: number | null;
  longitude: number | null;
  city: string;
  price: number;
  priceType?: string;
  priceTypeCustom?: string;
  images: string[];
  category: string;
}

interface MultipleMarkersMapProps {
  activities: Activity[];
  height?: string;
}

export default function MultipleMarkersMap({
  activities,
  height = '500px',
}: MultipleMarkersMapProps) {
  // Coordenadas del centro de España
  const SPAIN_CENTER: [number, number] = [40.4637, -3.7492]; // Madrid
  const SPAIN_ZOOM = 6; // Zoom para ver toda España

  // Filtrar actividades que tienen coordenadas
  const activitiesWithCoords = activities.filter(
    (activity) => activity.latitude !== null && activity.longitude !== null
  );

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden shadow-lg relative z-0">
      <MapContainer
        center={SPAIN_CENTER}
        zoom={SPAIN_ZOOM}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {activitiesWithCoords.map((activity) => (
          <Marker
            key={activity.id}
            position={[activity.latitude!, activity.longitude!]}
            icon={DefaultIcon}
          >
            <Popup maxWidth={250}>
              <div className="min-w-[200px]">
                {activity.images[0] && (
                  <div className="relative w-full h-32 mb-2 rounded overflow-hidden">
                    <Image
                      src={activity.images[0]}
                      alt={activity.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                  {activity.title}
                </h3>
                <p className="text-xs text-gray-600 mb-1">
                  📍 {activity.city}
                </p>
                <p className="text-xs text-gray-600 mb-2">
                  🏷️ {activity.category}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary-600">
                    {activity.price}€{activity.priceType === 'otro' ? `/${activity.priceTypeCustom || ''}` : `/${activity.priceType || 'mes'}`}
                  </span>
                  <Link
                    href={`/activity/${activity.id}`}
                    className="text-xs bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600 transition"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
