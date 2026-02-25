"use client";

import { useEffect, useRef, useState } from "react";
import { Loader, setOptions, importLibrary } from "@googlemaps/js-api-loader";

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
  const [isLoading, setIsLoading] = useState(true);

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
          // Detectar si es móvil para ajustar controles
          const isMobile = window.innerWidth < 640;
          
          mapRef.current = new mapsLib.Map(mapDivRef.current, {
            center: centerPoint,
            zoom: 6,
            mapTypeControl: !isMobile, // Ocultar control de tipo en móvil
            streetViewControl: false,
            fullscreenControl: !isMobile, // Ocultar pantalla completa en móvil
            zoomControl: true,
            // En móvil, posicionar controles de manera más compacta
            zoomControlOptions: {
              position: isMobile ? google.maps.ControlPosition.RIGHT_BOTTOM : google.maps.ControlPosition.RIGHT_CENTER,
            },
          });

          // Crear un solo InfoWindow para reutilizar
          // Con configuración optimizada para móvil
          infoWindowRef.current = new google.maps.InfoWindow({
            maxWidth: isMobile ? 280 : 320,
            pixelOffset: new google.maps.Size(0, isMobile ? -10 : 0),
            // Evitar scroll configurando maxHeight
            maxHeight: isMobile ? undefined : undefined,
          });
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
            // Diseño responsive: más compacto en móvil
            const isMobile = window.innerWidth < 640;
            
            if (isMobile) {
              // Versión móvil: ultra compacta para evitar scroll vertical
              container.className = 'w-[280px] max-h-[220px] overflow-hidden';
              container.innerHTML = `
                <div class="p-2">
                  ${act.images[0] ? `
                    <div class="relative w-full h-16 mb-1.5 rounded overflow-hidden">
                      <img 
                        src="${act.images[0]}" 
                        alt="${act.title}"
                        class="w-full h-full object-cover"
                      />
                    </div>
                  ` : ''}
                  <h3 class="font-bold text-sm mb-1 leading-tight text-gray-900 line-clamp-2" style="max-height: 2.5em; overflow: hidden;">
                    ${act.title}
                  </h3>
                  <div class="flex items-center gap-1 mb-1.5 flex-wrap">
                    <span class="text-xs text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded whitespace-nowrap">
                      📍 ${act.city}
                    </span>
                    <span class="text-xs text-gray-600 bg-blue-50 px-1.5 py-0.5 rounded whitespace-nowrap">
                      🏷️ ${act.category}
                    </span>
                  </div>
                  <a
                    href="/activity/${act.id}"
                    class="block text-center text-sm text-white px-3 py-1.5 rounded-lg transition font-semibold w-full"
                    style="background-color: #4A90E2;"
                    onmouseover="this.style.backgroundColor='#3b73b5'"
                    onmouseout="this.style.backgroundColor='#4A90E2'"
                    ontouchstart="this.style.backgroundColor='#3b73b5'"
                    ontouchend="this.style.backgroundColor='#4A90E2'"
                  >
                    Ver más →
                  </a>
                </div>
              `;
            } else {
              // Versión escritorio: con precio y más espaciosa
              container.className = 'min-w-[250px] max-w-[320px]';
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
                      ${act.price}€${act.priceType === 'otro' ? `/${act.priceTypeCustom || ''}` : `/${act.priceType || 'mes'}`}
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
            }
            
            return container;
          };

          // Evento click en el marcador
          marker.addListener('click', () => {
            if (infoWindowRef.current && mapRef.current) {
              const content = createInfoWindowContent(activity);
              infoWindowRef.current.setContent(content);
              
              // Configurar opciones del InfoWindow según el dispositivo
              const isMobile = window.innerWidth < 640;
              if (isMobile) {
                // En móvil, centrar el mapa en el marcador antes de abrir el InfoWindow
                // para que la tarjeta quede visible sin necesidad de scroll
                mapRef.current.panTo(marker.getPosition() as google.maps.LatLng);
                
                // Pequeño delay para suavizar la animación
                setTimeout(() => {
                  infoWindowRef.current?.open(mapRef.current!, marker);
                }, 150);
              } else {
                // En escritorio, abrir directamente
                infoWindowRef.current.open(mapRef.current, marker);
              }
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
          
          // Esperar a que el mapa termine de ajustarse y los marcadores se rendericen
          google.maps.event.addListenerOnce(mapRef.current, 'idle', () => {
            // El mapa ha terminado de cargar y renderizar
            setTimeout(() => setIsLoading(false), 300);
          });
        } else {
          // Si no hay actividades con coordenadas, ocultar loading inmediatamente
          setIsLoading(false);
        }

      } catch (error) {
        console.error('Error cargando Google Maps:', error);
        setIsLoading(false);
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
    <div className="relative" style={{ height, width: '100%' }}>
      {isLoading && (
        <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-600 font-medium">Cargando mapa...</p>
            <p className="text-sm text-gray-500 mt-1">
              {activities.length} {activities.length === 1 ? 'actividad' : 'actividades'}
            </p>
          </div>
        </div>
      )}
      <div 
        ref={mapDivRef}
        style={{ height: '100%', width: '100%' }} 
        className="rounded-lg overflow-hidden shadow-lg"
      />
    </div>
  );
}
