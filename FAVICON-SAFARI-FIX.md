# 🎨 Guía de Solución de Favicon en Safari

## Problema
Safari muestra el favicon de Vercel en lugar del de ExtraSchools.

## ✅ Cambios Realizados

1. **Actualizado `layout.tsx`**: Añadido parámetro `?v=2` a todos los favicons para forzar recarga
2. **Actualizado `site.webmanifest`**: Configurado nombre "ExtraSchools" y color de tema `#00A3FF`
3. **Añadido metadata adicional**: Color de tema para Safari y Microsoft

## 🧹 Limpiar Caché en Safari

### Método 1: Vaciar Cachés (Más Rápido)
1. Safari → Configuración → Avanzado
2. Marcar "Mostrar menú Desarrollo en la barra de menús"
3. Menú **Desarrollo** → **Vaciar cachés** (o presionar `⌥⌘E`)
4. Recargar la página con `⌘R`

### Método 2: Borrar Datos del Sitio Específico
1. Safari → Configuración → Privacidad
2. "Gestionar datos de sitios web..."
3. Buscar "localhost" (o tu dominio)
4. Hacer clic en "Eliminar"
5. Recargar la página

### Método 3: Forzar Recarga Completa
1. Cerrar completamente Safari (`⌘Q`)
2. Volver a abrir Safari
3. Ir a la página y presionar `⌘⇧R` (Command + Shift + R)

### Método 4: Limpiar Marcadores
Si tienes el sitio en favoritos/marcadores:
1. Eliminar el marcador
2. Limpiar caché (Método 1 o 2)
3. Volver a agregar el marcador

## 🔍 Verificación

Abre `test-favicon.html` en tu navegador para:
- Ver una preview de todos los tamaños de favicon
- Seguir instrucciones detalladas de limpieza de caché
- Verificar que los archivos se cargan correctamente

## 📱 Nota para iOS/iPadOS

En dispositivos móviles de Apple:
1. Configuración → Safari → Avanzado → Datos de sitios web
2. Buscar y eliminar el sitio
3. O eliminar todo: "Eliminar todos los datos de sitios web"

## 🎯 Archivos de Favicon en `/public/`

- `favicon.ico` - Icono principal
- `favicon-16x16.png` - 16×16 píxeles
- `favicon-32x32.png` - 32×32 píxeles  
- `apple-touch-icon.png` - 180×180 para iOS
- `android-chrome-192x192.png` - 192×192 para Android
- `android-chrome-512x512.png` - 512×512 para Android
- `site.webmanifest` - Configuración de PWA

## 🚀 Después de Limpiar Caché

1. Ve a `http://localhost:3000`
2. Deberías ver el favicon de ExtraSchools (azul/verde)
3. Si no aparece inmediatamente, espera unos segundos y recarga
4. Verifica en la pestaña del navegador y en marcadores

## ⚠️ Si Aún No Funciona

1. Asegúrate de que los archivos en `/public/` son correctos
2. Reinicia el servidor de desarrollo: `npm run dev`
3. Prueba en modo incógnito/privado
4. Verifica la consola del navegador por errores 404
