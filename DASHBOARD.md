# Dashboard de Empresa - ExtraSchools

## ✅ Completado

El dashboard de empresa está completamente funcional con todas las características solicitadas.

## 🎯 Características Implementadas

### 1. **Layout y Navegación**
- ✅ Sidebar responsive con navegación
- ✅ Menú mobile con hamburger
- ✅ Protección de rutas (solo empresas y admin)
- ✅ Navegación entre secciones

### 2. **Dashboard Principal** (`/company/dashboard`)
- ✅ Tarjetas de estadísticas:
  - Actividades totales y publicadas
  - Clics totales (preparado para implementar tracking)
  - Favoritos de usuarios
  - Reseñas y rating promedio
- ✅ Lista de actividades recientes
- ✅ Panel de mensajes sin leer
- ✅ Tarjeta de rendimiento

### 3. **Gestión de Actividades** (`/company/activities`)
- ✅ Lista completa de actividades en tabla
- ✅ Vista previa con imagen miniatura
- ✅ Toggle de publicación (publicada/borrador)
- ✅ Estadísticas por actividad (favoritos, reseñas)
- ✅ Botones de editar y eliminar
- ✅ Estado vacío con CTA

### 4. **Crear Actividad** (`/company/activities/new`)
- ✅ Formulario completo con validación
- ✅ Información básica (título, descripción, categoría)
- ✅ Precio y edades
- ✅ **Integración con Google Maps Geocoding API**:
  - Búsqueda de direcciones
  - Autocompletado de ciudad, provincia, código postal
  - Extracción automática de coordenadas (lat/lng)
  - Vista previa de ubicación
- ✅ Múltiples imágenes (URLs)
- ✅ Toggle de publicación inmediata

### 5. **Editar Actividad** (`/company/activities/[id]/edit`)
- ✅ Formulario precargado con datos existentes
- ✅ Mismas funcionalidades que crear
- ✅ Actualización en tiempo real

### 6. **Mensajes** (`/company/messages`)
- ✅ Estadísticas de mensajes (total, recibidos, enviados)
- ✅ Lista de mensajes recibidos
- ✅ Indicador de mensajes no leídos
- ✅ Vista de remitente y asunto
- ✅ Preparado para sistema completo de chat

### 7. **Suscripción** (`/company/subscription`)
- ✅ Tres planes: Gratis, Básico, Premium
- ✅ Comparación de características
- ✅ Tabla de comparación detallada
- ✅ Banner de plan actual
- ✅ Preparado para integración con Stripe

## 🗺️ Google Maps Integration

### Configuración Requerida

Para usar la funcionalidad de geocoding con Google Maps:

1. **Obtener API Key de Google Maps**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un proyecto nuevo o selecciona uno existente
   - Habilita la API "Geocoding API"
   - Crea credenciales (API Key)
   - Opcionalmente, restringe la API key a tu dominio

2. **Añadir a `.env`**:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aqui
   ```

3. **Reiniciar el servidor**:
   ```bash
   npm run dev
   ```

### ¿Cómo Funciona?

1. El componente `GoogleMapsLocationPicker` permite buscar direcciones
2. Usa la Geocoding API de Google Maps para obtener coordenadas
3. Extrae automáticamente: ciudad, provincia, código postal
4. Guarda las coordenadas (latitude, longitude) en la base de datos
5. **Más adelante**: Estas coordenadas se usarán con Leaflet para mostrar mapas interactivos

### Sin API Key

- El formulario sigue funcionando
- Puedes ingresar las direcciones manualmente
- Aparece un aviso indicando que falta la API key
- Las coordenadas por defecto son Madrid (40.4168, -3.7038)

## 📂 Estructura de Archivos

```
src/
├── app/
│   ├── company/
│   │   ├── layout.tsx                    # Layout protegido del dashboard
│   │   ├── dashboard/
│   │   │   └── page.tsx                  # Página principal con stats
│   │   ├── activities/
│   │   │   ├── page.tsx                  # Lista de actividades
│   │   │   ├── new/
│   │   │   │   └── page.tsx              # Formulario crear
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx          # Formulario editar
│   │   ├── messages/
│   │   │   └── page.tsx                  # Sistema de mensajes
│   │   └── subscription/
│   │       └── page.tsx                  # Gestión de planes
│   └── api/
│       └── company/
│           └── activities/
│               ├── route.ts              # POST crear actividad
│               └── [id]/
│                   ├── route.ts          # DELETE eliminar
│                   ├── publish/
│                   │   └── route.ts      # PATCH toggle publicación
│                   └── update/
│                       └── route.ts      # PUT actualizar
├── components/
│   └── company/
│       ├── CompanyDashboardLayout.tsx    # Sidebar y navegación
│       ├── GoogleMapsLocationPicker.tsx  # Selector de ubicación con Maps
│       ├── EditActivityForm.tsx          # Formulario de edición
│       ├── DeleteActivityButton.tsx      # Botón eliminar con confirmación
│       └── TogglePublishButton.tsx       # Toggle publicar/borrador
```

## 🚀 Cómo Probar

1. **Iniciar sesión como empresa**:
   - Email: `deportes@abc.com`
   - Password: `password123`

2. **Acceder al dashboard**:
   - URL: http://localhost:3002/company/dashboard

3. **Probar funcionalidades**:
   - Ver estadísticas en el dashboard principal
   - Ir a "Mis actividades" para ver las existentes
   - Crear una nueva actividad
   - Buscar una dirección con Google Maps (si tienes API key)
   - Editar una actividad existente
   - Publicar/despublicar actividades
   - Ver mensajes (vacío por ahora)
   - Ver planes de suscripción

## 📊 Estadísticas Disponibles

### Actualmente Implementadas:
- ✅ Total de actividades
- ✅ Actividades publicadas vs borradores
- ✅ Total de favoritos
- ✅ Total de reseñas
- ✅ Rating promedio
- ✅ Mensajes sin leer

### Por Implementar:
- ⏳ Tracking de clics (vistas de actividad)
- ⏳ Conversión de clics a contactos
- ⏳ Analytics avanzado (gráficos temporales)
- ⏳ Ranking de actividades más populares

## 🔜 Próximas Mejoras

1. **Sistema de Clics/Vistas**
   - Tracking cuando un usuario ve una actividad
   - Analytics de rendimiento por actividad

2. **Mensajería Completa**
   - Chat en tiempo real
   - Responder mensajes
   - Notificaciones push
   - Emails automáticos

3. **Integración Stripe**
   - Checkout de suscripciones
   - Webhook handlers
   - Gestión de pagos recurrentes
   - Upgrades/downgrades

4. **Subida de Imágenes**
   - Integración con Cloudinary o S3
   - Upload directo desde formulario
   - Resize automático
   - Gestión de galería

5. **Analytics Avanzado**
   - Gráficos de rendimiento
   - Comparativas temporales
   - Export de reportes

## 🎨 Diseño

- Sidebar responsive con iconos
- Tarjetas de estadísticas coloridas
- Tablas con hover states
- Formularios con validación visual
- Estados vacíos amigables
- Badges y tags de estado

## 🔐 Seguridad

- ✅ Rutas protegidas con NextAuth
- ✅ Verificación de rol (COMPANY o ADMIN)
- ✅ Validación en API routes
- ✅ Verificación de ownership (solo editar propias actividades)
- ✅ Confirmación antes de eliminar

---

**Estado**: Dashboard completo y funcional ✅
**Puerto**: http://localhost:3002
**Usuario de prueba**: deportes@abc.com / password123
