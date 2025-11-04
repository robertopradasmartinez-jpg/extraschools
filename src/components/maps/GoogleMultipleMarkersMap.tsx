"use client";

import { useEffect, useRef } from "react";
import { Loader, setOptions, importLibrary } from "@googlemaps/js-api-loader";

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

interface GoogleMultipleMarkersMapProps {
  activities: Activity[];
  height?: string;
}

export default function GoogleMultipleMarkersMap({
  activities,
  height = '500px',
}: GoogleMultipleMarkersMapProps) {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
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

        // Filtrar actividades con coordenadas válidas
        const activitiesWithCoords = activities.filter(
          (activity) => activity.latitude !== null && activity.longitude !== null
        );

        if (activitiesWithCoords.length === 0) {
          console.warn('No hay actividades con coordenadas para mostrar');
          return;
        }

        // Calcular el centro promedio de todas las actividades
        const calculateCenter = () => {
          if (activitiesWithCoords.length === 0) {
            return { lat: 40.4637, lng: -3.7492 }; // Madrid por defecto
          }
          
          const sum = activitiesWithCoords.reduce(
            (acc, activity) => ({
              lat: acc.lat + (activity.latitude || 0),
              lng: acc.lng + (activity.longitude || 0),
            }),
            { lat: 0, lng: 0 }
          );

          return {
            lat: sum.lat / activitiesWithCoords.length,
            lng: sum.lng / activitiesWithCoords.length,
          };
        };

        const centerPoint = calculateCenter();

        // Inicializar mapa si no existe
        if (mapDivRef.current && !mapRef.current) {
          mapRef.current = new mapsLib.Map(mapDivRef.current, {
            center: centerPoint,
            zoom: 6,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
          });

          // Crear un solo InfoWindow para reutilizar
          infoWindowRef.current = new google.maps.InfoWindow();
        }

        // Limpiar marcadores anteriores
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        // Crear bounds para ajustar el zoom
        const bounds = new google.maps.LatLngBounds();

        // Crear marcadores para cada actividad
        activitiesWithCoords.forEach((activity) => {
          if (!activity.latitude || !activity.longitude || !mapRef.current) return;

          const position = { lat: activity.latitude, lng: activity.longitude };
          
          // Extender bounds
          bounds.extend(position);

          // Crear marcador
          const marker = new google.maps.Marker({
            position,
            map: mapRef.current,
            title: activity.title,
            animation: google.maps.Animation.DROP,
          });

          // Crear contenido del InfoWindow
          const createInfoWindowContent = (act: Activity): HTMLDivElement => {
            const container = document.createElement('div');
            container.className = 'min-w-[250px] max-w-[300px]';
            
            container.innerHTML = `
              <div class="p-2">
                ${act.images[0] ? `
                  <div class="relative w-full h-32 mb-2 rounded overflow-hidden">
                    <img 
                      src="${act.images[0]}" 
                      alt="${act.title}"
                      class="w-full h-full object-cover"
                    />
                  </div>
                ` : ''}
                <h3 class="font-semibold text-sm mb-2 line-clamp-2">
                  ${act.title}
                </h3>
                <p class="text-xs text-gray-600 mb-1">
                  📍 ${act.city}
                </p>
                <p class="text-xs text-gray-600 mb-2">
                  🏷️ ${act.category}
                </p>
                <div class="flex items-center justify-between mt-3">
                  <span class="font-bold text-base" style="color: #4A90E2;">
                    ${act.price}€/mes
                  </span>
                  <a
                    href="/activity/${act.id}"
                    class="text-sm text-white px-4 py-2 rounded transition inline-block font-medium"
                    style="background-color: #4A90E2;"
                    onmouseover="this.style.backgroundColor='#3b73b5'"
                    onmouseout="this.style.backgroundColor='#4A90E2'"
                  >
                    Ver detalles
                  </a>
                </div>
              </div>
            `;
            
            return container;
          };

          // Evento click en el marcador
          marker.addListener('click', () => {
            if (infoWindowRef.current && mapRef.current) {
              infoWindowRef.current.setContent(createInfoWindowContent(activity));
              infoWindowRef.current.open(mapRef.current, marker);
            }
          });

          markersRef.current.push(marker);
        });

        // Ajustar el mapa para mostrar todos los marcadores
        if (mapRef.current && activitiesWithCoords.length > 0) {
          if (activitiesWithCoords.length === 1) {
            // Si solo hay una actividad, centrar en ella con zoom 12
            mapRef.current.setCenter(bounds.getCenter());
            mapRef.current.setZoom(12);
          } else {
            // Si hay múltiples, ajustar bounds con padding
            mapRef.current.fitBounds(bounds);
          }
        }

      } catch (error) {
        console.error('Error cargando Google Maps:', error);
      }
    };

    initMap();

    // Cleanup al desmontar
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [activities]);

  return (
    <div 
      ref={mapDivRef}
      style={{ height, width: '100%' }} 
      className="rounded-lg overflow-hidden shadow-lg"
    />
  );
}
