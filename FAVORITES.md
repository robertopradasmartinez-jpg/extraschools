# Sistema de Favoritos - ExtraSchools

## ✅ Completado

Sistema completo de favoritos para que los usuarios puedan guardar y gestionar sus actividades preferidas.

## 🎯 Características Implementadas

### 1. **Página de Favoritos** (`/favorites`)

**Funcionalidades:**
- ✅ Lista completa de actividades guardadas
- ✅ Grid responsive (1, 2 o 3 columnas según tamaño)
- ✅ Usa el mismo componente `ActivityCard` para consistencia
- ✅ Ordenamiento por fecha de añadido
- ✅ Contador de favoritos en el header
- ✅ Barra de filtros y ordenamiento preparada

**Empty State:**
- ✅ Diseño amigable cuando no hay favoritos
- ✅ Icono de corazón grande
- ✅ Mensaje motivador
- ✅ Botón CTA para explorar actividades

**CTA Section:**
- ✅ Banner gradiente con call-to-action
- ✅ Enlace a búsqueda de actividades

### 2. **Sistema de Toggle de Favoritos**

**API Endpoint:** `/api/favorites` (POST)
- ✅ Añadir actividad a favoritos
- ✅ Quitar actividad de favoritos
- ✅ Toggle automático (si existe, elimina; si no, crea)
- ✅ Validación de autenticación
- ✅ Respuesta con estado actual (isFavorite: true/false)

**Componente:** `AddToFavoritesButton`
- ✅ Botón con icono de corazón
- ✅ Estado visual (relleno cuando es favorito)
- ✅ Animación de hover
- ✅ Loading state durante la petición
- ✅ Refresco automático de la página después del toggle
- ✅ Manejo de errores

**Integración:**
- ✅ En página de detalle de actividad (header)
- ✅ En ActivityCard (para implementar después)

### 3. **Header Mejorado**

- ✅ Iconos con hover effects
- ✅ Backgrounds de color en hover
- ✅ Tooltips en los iconos
- ✅ Padding mejorado para mejor clickabilidad

### 4. **Página de Perfil** (`/profile`)

**Secciones:**
- ✅ Avatar con inicial del usuario
- ✅ Badge de rol (Admin, Empresa, Padre)
- ✅ Información de cuenta
- ✅ Accesos rápidos (Favoritos, Mensajes)
- ✅ Diseño limpio y profesional

## 📂 Estructura de Archivos

```
src/
├── app/
│   ├── favorites/
│   │   └── page.tsx              # Página de favoritos
│   ├── profile/
│   │   └── page.tsx              # Página de perfil
│   └── api/
│       └── favorites/
│           └── route.ts          # API toggle favoritos
└── components/
    └── activities/
        └── AddToFavoritesButton.tsx  # Botón de favoritos
```

## 🎨 Diseño

### Página de Favoritos:
- Header con icono grande de corazón
- Contador de actividades guardadas
- Barra de filtros/ordenamiento
- Grid responsive con ActivityCards
- Banner CTA con gradiente
- Info box con tips

### Empty State:
- Icono circular con corazón
- Título y descripción
- Botón primario para explorar

### Botón de Favoritos:
- Corazón outline cuando no es favorito
- Corazón relleno cuando es favorito
- Colores: gris neutral → rosa cuando es favorito
- Transiciones suaves

## 🚀 Cómo Funciona

### Añadir a Favoritos:
1. Usuario hace clic en el corazón
2. Se envía POST a `/api/favorites` con `activityId`
3. API verifica si ya existe el favorito
4. Si no existe, lo crea en la BD
5. Retorna `{ isFavorite: true }`
6. UI se actualiza con corazón relleno

### Quitar de Favoritos:
1. Usuario hace clic en el corazón (ya relleno)
2. Se envía POST a `/api/favorites` con `activityId`
3. API encuentra el favorito existente
4. Lo elimina de la BD
5. Retorna `{ isFavorite: false }`
6. UI se actualiza con corazón vacío

### Ver Favoritos:
1. Usuario navega a `/favorites`
2. Se cargan todos los favoritos del usuario desde BD
3. Se incluyen datos de actividad, empresa, reviews
4. Se muestran en grid con ActivityCards
5. Cada card mantiene el estado de favorito

## 🔧 Base de Datos

### Tabla `Favorite`
```prisma
model Favorite {
  id         String   @id @default(cuid())
  userId     String
  activityId String
  createdAt  DateTime @default(now())
  
  user     User     @relation(...)
  activity Activity @relation(...)
  
  @@unique([userId, activityId])
}
```

**Clave compuesta única:** Evita duplicados (un usuario no puede guardar la misma actividad dos veces)

## 📊 Queries Optimizadas

### En Página de Favoritos:
```typescript
prisma.favorite.findMany({
  where: { userId },
  include: {
    activity: {
      include: {
        company: true,
        reviews: true,
        favorites: true, // Para contar
      },
    },
  },
  orderBy: { createdAt: 'desc' },
})
```

### En Página de Detalle:
```typescript
// Solo verifica si existe el favorito
favorites: userId ? {
  where: { userId }
} : false
```

## 🎯 Casos de Uso

### Usuario Padre:
1. Navega por actividades
2. Ve una que le gusta
3. Hace clic en el corazón → se guarda
4. Continúa explorando
5. Va a `/favorites` para revisar todas las guardadas
6. Compara y decide cuál contactar
7. Puede quitar las que ya no le interesan

### Flujo Completo:
```
Home → Search → Activity Detail
           ↓
    Click ❤️ (add to favorites)
           ↓
    Continue browsing
           ↓
    Click "Favorites" in header
           ↓
    See all saved activities
           ↓
    Click activity to review
           ↓
    Contact company or remove from favorites
```

## 🔜 Mejoras Futuras

### Funcionalidades Adicionales:
- [ ] **Ordenamiento funcional** (por precio, rating, fecha)
- [ ] **Filtros** (por categoría, ciudad, edad)
- [ ] **Notas privadas** en cada favorito
- [ ] **Listas personalizadas** (ej: "Para verano", "Para mi hijo mayor")
- [ ] **Compartir lista** de favoritos con otros padres
- [ ] **Notificaciones** cuando un favorito baja de precio
- [ ] **Comparador** lado a lado de favoritos

### Optimizaciones:
- [ ] **Contador en tiempo real** en el icono del header
- [ ] **Animaciones** más fluidas al añadir/quitar
- [ ] **Optimistic UI** (actualizar UI antes de respuesta del server)
- [ ] **Caché** de favoritos en cliente
- [ ] **Infinite scroll** si hay muchos favoritos

### UX Mejorado:
- [ ] **Drag & drop** para reordenar favoritos
- [ ] **Vista de lista** además de grid
- [ ] **Vista compacta** vs expandida
- [ ] **Búsqueda** dentro de favoritos
- [ ] **Exportar** lista en PDF

## 🧪 Cómo Probar

1. **Iniciar sesión como padre**:
   ```
   Email: maria@example.com
   Password: password123
   ```

2. **Añadir favoritos**:
   - Ve a la home o búsqueda
   - Haz clic en cualquier actividad
   - Haz clic en el corazón del header

3. **Ver favoritos**:
   - Haz clic en el icono de corazón del header
   - O navega a: http://localhost:3002/favorites

4. **Quitar favorito**:
   - En la página de favoritos
   - Haz clic en una actividad
   - Haz clic en el corazón para quitar

## 📱 Responsive

- **Mobile**: 1 columna
- **Tablet**: 2 columnas
- **Desktop**: 3 columnas
- **Header icons**: Ocultos en mobile (disponibles en menú hamburguesa)

## ✅ Testing Checklist

- [x] Añadir favorito desde detalle de actividad
- [x] Quitar favorito desde detalle de actividad
- [x] Ver lista de favoritos
- [x] Empty state cuando no hay favoritos
- [x] Navegación desde favoritos a detalle
- [x] Contador correcto en header
- [x] Responsive en todas las pantallas
- [x] Loading states
- [x] Error handling

---

**Estado**: Sistema de favoritos completado ✅  
**Puerto**: http://localhost:3002  
**Ruta**: http://localhost:3002/favorites
