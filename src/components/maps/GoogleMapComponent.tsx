'use client';

import { useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

interface GoogleMapComponentProps {
  latitude: number;
  longitude: number;
  title?: string;
  address?: string;
  zoom?: number;
  height?: string;
}

export default function GoogleMapComponent({
  latitude,
  longitude,
  title,
  address,
  zoom = 15,
  height = '400px',
}: GoogleMapComponentProps) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    const initMap = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key no configurada');
        return;
      }

      try {
        // Configurar opciones de la API
        setOptions({
          key: apiKey,
          v: 'weekly',
          language: 'es',
          region: 'ES',
        });

        // Importar librería de mapas
        const mapsLib = await importLibrary('maps');

        // Inicializar mapa
        if (mapDivRef.current && !mapRef.current) {
          mapRef.current = new mapsLib.Map(mapDivRef.current, {
            center: { lat: latitude, lng: longitude },
            zoom: zoom,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
          });

          // Crear marcador
          markerRef.current = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: mapRef.current,
            title: title || 'Ubicación',
            animation: google.maps.Animation.DROP,
          });

          // Crear InfoWindow si hay título o dirección
          if (title || address) {
            const contentString = `
              <div style="padding: 8px; max-width: 200px;">
                ${title ? `<div style="font-weight: 600; margin-bottom: 4px;">${title}</div>` : ''}
                ${address ? `<div style="font-size: 14px; color: #666;">${address}</div>` : ''}
              </div>
            `;

            infoWindowRef.current = new google.maps.InfoWindow({
              content: contentString,
            });

            // Abrir InfoWindow al hacer clic en el marcador
            markerRef.current.addListener('click', () => {
              if (infoWindowRef.current && markerRef.current) {
                infoWindowRef.current.open(mapRef.current, markerRef.current);
              }
            });
          }
        }
      } catch (error) {
        console.error('Error cargando Google Maps:', error);
      }
    };

    initMap();
  }, [latitude, longitude, title, address, zoom]);

  return (
    <div 
      ref={mapDivRef}
      style={{ height, width: '100%' }} 
      className="rounded-lg overflow-hidden shadow-lg"
    />
  );
}
