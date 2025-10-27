'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
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
});

interface MapComponentProps {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
  zoom?: number;
  height?: string;
}

export default function MapComponent({
  latitude,
  longitude,
  title,
  address,
  zoom = 15,
  height = '400px',
}: MapComponentProps) {
  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden relative z-0">
      <MapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={DefaultIcon}>
          {(title || address) && (
            <Popup>
              {title && <div className="font-semibold">{title}</div>}
              {address && <div className="text-sm text-gray-600">{address}</div>}
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
}
