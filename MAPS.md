# 🗺️ SISTEMA DE MAPAS INTERACTIVOS - LEAFLET

## ✅ Implementación Completada

Sistema de mapas interactivos usando Leaflet y react-leaflet para visualizar ubicaciones de actividades.

## 📦 Dependencias Instaladas

```bash
npm install react-leaflet leaflet @types/leaflet
```

- **react-leaflet**: v4.2.1 - Componentes React para Leaflet
- **leaflet**: v1.9.4 - Librería de mapas JavaScript
- **@types/leaflet**: v1.9.8 - TypeScript types

## 🧩 Componentes Creados

### 1. MapComponent.tsx
**Ubicación**: `/src/components/maps/MapComponent.tsx`

Componente para mostrar **un solo marcador** en el mapa.

**Props:**
```typescript
interface MapComponentProps {
  latitude: number;
  longitude: number;
  title?: string;          // Título mostrado en el popup
  address?: string;        // Dirección mostrada en el popup
  zoom?: number;          // Nivel de zoom (default: 15)
  height?: string;        // Altura del mapa (default: '400px')
}
```

**Uso:**
```tsx
<MapComponent
  latitude={40.4168}
  longitude={-3.7038}
  title="Escuela de Fútbol ABC"
  address="Calle Mayor 123, Madrid"
  zoom={15}
  height="300px"
/>
```

**Características:**
- ✅ Marcador con icono personalizado
- ✅ Popup con título y dirección
- ✅ Tiles de OpenStreetMap (gratis)
- ✅ Scroll wheel deshabilitado por defecto
- ✅ Bordes redondeados
- ✅ Responsive

### 2. MultipleMarkersMap.tsx
**Ubicación**: `/src/components/maps/MultipleMarkersMap.tsx`

Componente para mostrar **múltiples marcadores** en el mapa.

**Props:**
```typescript
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

interface MultipleMarkersMapProps {
  activities: Activity[];
  height?: string;        // Altura del mapa (default: '500px')
}
```

**Uso:**
```tsx
<MultipleMarkersMap 
  activities={activities}
  height="500px"
/>
```

**Características:**
- ✅ Múltiples marcadores con popups
- ✅ Auto-ajuste de bounds para mostrar todas las actividades
- ✅ Popup con imagen de preview
- ✅ Link directo a detalle de actividad
- ✅ Información de precio y categoría
- ✅ Filtrado automático de actividades sin coordenadas
- ✅ Scroll wheel habilitado
- ✅ Sombra y bordes redondeados

## 📄 Páginas Integradas

### 1. Página de Detalle de Actividad
**Ruta**: `/activity/[id]`
**Archivo**: `/src/app/activity/[id]/page.tsx`

**Implementación:**
```tsx
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/maps/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse" />
  ),
});

// En el JSX:
{activity.latitude && activity.longitude ? (
  <MapComponent
    latitude={activity.latitude}
    longitude={activity.longitude}
    title={activity.title}
    address={`${activity.address}, ${activity.city}`}
    height="300px"
    zoom={15}
  />
) : (
  <div className="fallback-message">
    Ubicación no disponible
  </div>
)}
```

**Características:**
- ✅ Mapa individual por actividad
- ✅ Información de ubicación exacta
- ✅ Fallback si no hay coordenadas
- ✅ Loading state con skeleton

### 2. Página de Búsqueda
**Ruta**: `/search`
**Archivo**: `/src/app/search/page.tsx`

**Implementación:**
```tsx
import dynamic from 'next/dynamic';
import { Map } from 'lucide-react';

const MultipleMarkersMap = dynamic(
  () => import('@/components/maps/MultipleMarkersMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] bg-gray-100 rounded-lg animate-pulse" />
    ),
  }
);

// En el JSX:
<div className="mb-8">
  <div className="bg-white rounded-lg shadow-sm p-4">
    <div className="flex items-center mb-4">
      <Map className="w-5 h-5 text-rose-500 mr-2" />
      <h2>Mapa de actividades</h2>
      <span className="ml-auto">
        {activities.length} ubicaciones
      </span>
    </div>
    <MultipleMarkersMap activities={activities} height="500px" />
  </div>
</div>
```

**Características:**
- ✅ Vista general de todas las actividades
- ✅ Contador de ubicaciones
- ✅ Marcadores clicables con preview
- ✅ Link directo desde el popup

## 🎨 Estilos y Configuración

### CSS de Leaflet
**Ubicación**: `/src/app/layout.tsx`

```tsx
import 'leaflet/dist/leaflet.css';
```

**Importante**: El CSS debe importarse en el layout principal para que funcione correctamente.

### Fix de Iconos
Los componentes incluyen un fix para los iconos de Leaflet en Next.js:

```tsx
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = new Icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
```

Sin este fix, los iconos no se muestran correctamente.

## 🚀 Carga Dinámica (SSR)

**Importante**: Los componentes de mapa se cargan dinámicamente con `ssr: false` porque:
1. Leaflet depende de `window` y `document`
2. No puede ejecutarse en el servidor
3. Next.js 15 requiere SSR por defecto en app router

**Patrón usado:**
```tsx
const MapComponent = dynamic(() => import('@/components/maps/MapComponent'), {
  ssr: false,  // ← CRÍTICO
  loading: () => (
    <div className="skeleton-loader" />
  ),
});
```

## 📊 Base de Datos

Los mapas usan las coordenadas almacenadas en PostgreSQL:

```prisma
model Activity {
  // ...
  latitude  Float?
  longitude Float?
  // ...
}
```

**Coordenadas actuales (seed data):**
- Madrid: 40.4168, -3.7038
- Barcelona: 41.3851, 2.1734
- Valencia: 39.4699, -0.3763

## 🎯 Características Clave

### MapComponent (Individual)
- ✅ Un solo marcador
- ✅ Popup con info
- ✅ Zoom configurable
- ✅ Altura personalizable
- ✅ Scroll wheel deshabilitado
- ✅ Diseño minimalista

### MultipleMarkersMap (Múltiple)
- ✅ Múltiples marcadores
- ✅ Auto-bounds (muestra todos)
- ✅ Popups con imagen
- ✅ Link a detalle
- ✅ Info de precio y categoría
- ✅ Scroll wheel habilitado
- ✅ Padding en bounds

## 🔧 Configuración de Tiles

Actualmente usando **OpenStreetMap** (gratis):

```tsx
<TileLayer
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>
```

**Alternativas disponibles:**
- Mapbox (requiere API key)
- Google Maps (requiere API key)
- CartoDB (gratis)
- Stamen (gratis)

## 🐛 Troubleshooting

### Problema: Los iconos no se muestran
**Solución**: Asegúrate de importar el CSS y configurar el DefaultIcon

### Problema: Error "window is not defined"
**Solución**: Usa `dynamic` con `ssr: false`

### Problema: El mapa no se ve
**Solución**: Define una altura explícita (`height` prop o inline style)

### Problema: El mapa está gris
**Solución**: Verifica que el CSS de Leaflet esté importado

### Problema: Las coordenadas son null
**Solución**: Usa Google Maps Geocoding en el form de crear actividad

## 📱 Responsive

Los mapas son completamente responsive:

```tsx
<div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden">
  <MapContainer style={{ height: '100%', width: '100%' }}>
    {/* ... */}
  </MapContainer>
</div>
```

- Desktop: Vista completa con detalles
- Tablet: Ajustado al contenedor
- Mobile: Full width, height fija

## 🎨 Personalización

### Cambiar colores de marcador
Crea un icono personalizado:

```tsx
const CustomIcon = new Icon({
  iconUrl: '/path/to/custom-marker.png',
  iconSize: [30, 45],
  // ...
});
```

### Cambiar estilo de tiles
Usa diferentes tiles:

```tsx
url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
```

### Cambiar zoom inicial
```tsx
<MapComponent zoom={12} />  // Más alejado
<MapComponent zoom={18} />  // Más cerca
```

## ✅ Testing Checklist

- [x] MapComponent se renderiza correctamente
- [x] Marcador aparece en la posición correcta
- [x] Popup muestra título y dirección
- [x] MultipleMarkersMap muestra todos los marcadores
- [x] Bounds se ajustan automáticamente
- [x] Popups tienen imagen y link
- [x] Links llevan a la página correcta
- [x] CSS de Leaflet carga correctamente
- [x] Iconos se muestran (no cuadrados rotos)
- [x] Loading states funcionan
- [x] Fallback se muestra cuando no hay coordenadas
- [x] Mapas son responsive
- [x] No hay errores de SSR

## 🚀 Próximas Mejoras

### Alta Prioridad
- [ ] Clustering de marcadores (react-leaflet-cluster)
- [ ] Filtros del mapa sincronizados con búsqueda
- [ ] Direcciones desde ubicación del usuario

### Media Prioridad
- [ ] Marcadores personalizados por categoría
- [ ] Heatmap de densidad de actividades
- [ ] Geolocalización del usuario
- [ ] Búsqueda dentro del mapa visible

### Baja Prioridad
- [ ] Tiles premium (Mapbox)
- [ ] Modo oscuro para el mapa
- [ ] Capas adicionales (tráfico, transporte)
- [ ] Export de ubicaciones

## 📝 Notas Técnicas

- **Leaflet**: v1.9.4 - Librería madura y estable
- **react-leaflet**: v4.2.1 - Compatible con React 18
- **TypeScript**: Fully typed
- **Performance**: Lazy loading con dynamic imports
- **SEO**: Los mapas no impactan SEO (cargados client-side)
- **Bundle size**: ~140KB (leaflet) + ~20KB (react-leaflet)

## 🔗 Referencias

- [Leaflet Docs](https://leafletjs.com/)
- [react-leaflet Docs](https://react-leaflet.js.org/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Next.js Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)

---

**Estado**: ✅ Completamente funcional
**Última actualización**: Octubre 2025
**Autor**: GitHub Copilot
