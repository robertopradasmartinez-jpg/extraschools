'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { SPANISH_CITIES } from '@/lib/constants';

interface LocationPickerProps {
  initialLocation: {
    address: string;
    latitude: number;
    longitude: number;
  };
  onLocationSelect: (location: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  }) => void;
}

export default function GoogleMapsLocationPicker({
  initialLocation,
  onLocationSelect,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState(initialLocation.address);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<any>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);

  // Inicializar servicios de Google Maps
  useEffect(() => {
    const initGoogleMaps = async () => {
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

        // Importar las librerías necesarias
        const placesLib = await importLibrary('places');
        const geocodingLib = await importLibrary('geocoding');
        const mapsLib = await importLibrary('maps');

        // Inicializar servicios
        autocompleteServiceRef.current = new placesLib.AutocompleteService();
        geocoderRef.current = new geocodingLib.Geocoder();
        
        // PlacesService necesita un elemento del DOM
        const dummyDiv = document.createElement('div');
        placesServiceRef.current = new placesLib.PlacesService(dummyDiv);

        // Inicializar mapa
        if (mapDivRef.current) {
          mapRef.current = new mapsLib.Map(mapDivRef.current, {
            center: { lat: initialLocation.latitude || 40.4168, lng: initialLocation.longitude || -3.7038 },
            zoom: initialLocation.latitude ? 15 : 6,
            mapTypeControl: false,
            streetViewControl: true,
            fullscreenControl: false,
          });

          // Agregar marcador tradicional si hay ubicación inicial
          if (initialLocation.latitude && initialLocation.longitude) {
            markerRef.current = new google.maps.Marker({
              position: { lat: initialLocation.latitude, lng: initialLocation.longitude },
              map: mapRef.current,
              title: initialLocation.address,
              animation: google.maps.Animation.DROP,
            });
          }
        }

        console.log('✅ Google Maps API cargada correctamente');
      } catch (error) {
        console.error('❌ Error cargando Google Maps API:', error);
      }
    };

    initGoogleMaps();
  }, []);

  // Autocompletado de Places API
  const fetchSuggestions = useCallback(async (input: string) => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (!autocompleteServiceRef.current) {
      console.warn('⚠️ AutocompleteService aún no está inicializado');
      return;
    }

    console.log('🔍 Buscando sugerencias para:', input);

    try {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: 'es' },
          language: 'es',
        },
        (predictions, status) => {
          console.log('📦 Respuesta de Google:', status, '- Predicciones:', predictions?.length || 0);
          
          if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
            console.log('✅ Sugerencias encontradas:', predictions.length);
            setSuggestions(predictions);
            setShowSuggestions(true);
          } else {
            console.log('⚠️ Sin sugerencias. Status:', status);
            setSuggestions([]);
          }
        }
      );
    } catch (error) {
      console.error('❌ Error fetching suggestions:', error);
      setSuggestions([]);
    }
  }, []);

  // Debounce para el autocompletado
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchSuggestions]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectPlace = useCallback(async (placeId: string, description: string) => {
    setSearchQuery(description);
    setShowSuggestions(false);
    setIsSearching(true);

    if (!geocoderRef.current) {
      console.error('❌ Geocoder no está inicializado');
      setIsSearching(false);
      return;
    }

    try {
      // Obtener detalles del lugar usando Geocoder con place_id
      geocoderRef.current.geocode({ placeId }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
          const result = results[0];
          const location = result.geometry.location;

          // Extraer componentes de dirección
          const components = result.address_components;
          let city = '';
          let province = '';
          let postalCode = '';

          components.forEach((component) => {
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
            if (component.types.includes('administrative_area_level_2')) {
              province = component.long_name;
            }
            if (component.types.includes('postal_code')) {
              postalCode = component.long_name;
            }
          });

          // Si no se encuentra la ciudad como locality, buscar en administrative_area_level_3
          if (!city) {
            components.forEach((component) => {
              if (component.types.includes('administrative_area_level_3')) {
                city = component.long_name;
              }
            });
          }

          // Hacer match inteligente con las ciudades de la lista
          let matchedCity = city;
          if (city) {
            // Buscar coincidencia exacta (ignorando mayúsculas/minúsculas y tildes)
            const normalizedCity = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            const found = SPANISH_CITIES.find(c => 
              c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === normalizedCity
            );
            
            if (found) {
              matchedCity = found;
            } else {
              // Buscar si la ciudad contiene alguna de las ciudades de la lista o viceversa
              const partialMatch = SPANISH_CITIES.find(c => {
                const normalizedListCity = c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                return normalizedCity.includes(normalizedListCity) || normalizedListCity.includes(normalizedCity);
              });
              
              if (partialMatch) {
                matchedCity = partialMatch;
              }
            }
          }

          const newLocation = {
            address: result.formatted_address,
            city: matchedCity || 'Madrid',
            province: province || 'Madrid',
            postalCode: postalCode || '28001',
            latitude: location.lat(),
            longitude: location.lng(),
          };

          console.log('✅ Ubicación seleccionada:', newLocation);
          console.log('🏙️ Ciudad extraída:', city, '→ Ciudad coincidente:', matchedCity);
          setSelectedLocation(newLocation);
          onLocationSelect(newLocation);

          // Actualizar mapa y marcador
          if (mapRef.current) {
            const position = { lat: location.lat(), lng: location.lng() };
            mapRef.current.setCenter(position);
            mapRef.current.setZoom(17);
            
            if (markerRef.current) {
              // Actualizar marcador existente
              markerRef.current.setPosition(position);
              markerRef.current.setTitle(result.formatted_address);
            } else {
              // Crear nuevo marcador
              markerRef.current = new google.maps.Marker({
                position,
                map: mapRef.current,
                title: result.formatted_address,
                animation: google.maps.Animation.DROP,
              });
            }
          }

          setIsSearching(false);
        } else {
          console.error('❌ Error en geocoding:', status);
          alert('Error al obtener la ubicación');
          setIsSearching(false);
        }
      });
    } catch (error) {
      console.error('❌ Error selecting place:', error);
      alert('Error al seleccionar la ubicación');
      setIsSearching(false);
    }
  }, [onLocationSelect]);

  return (
    <div className="space-y-4">
      {/* Search Input with Autocomplete */}
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Escribe una dirección (Ej: Calle Mayor 1, Madrid)"
            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            autoComplete="off"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                type="button"
                onClick={() => selectPlace(suggestion.place_id, suggestion.description)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition"
              >
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {suggestion.structured_formatting?.main_text || suggestion.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {suggestion.structured_formatting?.secondary_text || ''}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Location Display */}
      {selectedLocation.address && (
        <div className="p-4 bg-secondary-50 border border-secondary-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-primary-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Ubicación seleccionada:
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {selectedLocation.address}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Coordenadas: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Map Preview */}
      <div 
        ref={mapDivRef}
        className="w-full h-80 bg-gray-100 rounded-lg border border-gray-300 overflow-hidden"
      />

    </div>
  );
}
