# 🚀 Guía de SEO y Configuración para ExtraSchools

## ✅ Implementaciones Completadas

Se han implementado las siguientes mejoras de SEO:

### 1. **robots.txt** ✅
- Ubicación: `/public/robots.txt`
- Permite rastreo de Google
- Bloquea páginas privadas (admin, company, profile)
- Incluye enlace al sitemap

### 2. **Sitemap.xml Dinámico** ✅
- Ubicación: `/src/app/sitemap.xml/route.ts`
- Se genera automáticamente con todas las páginas
- Incluye: actividades, blog posts, páginas estáticas
- Se actualiza cada hora (revalidate: 3600)
- Accesible en: `https://extraschools.es/sitemap.xml`

### 3. **Metadata SEO Mejorada** ✅
- **Layout principal**: Metadata completa con Open Graph y Twitter Cards
- **Páginas individuales**: Metadata específica en search, about, contact
- **Actividades**: Metadata dinámica generada por cada actividad
- **Keywords**: Palabras clave relevantes en todas las páginas

### 4. **Schema.org Markup** ✅
- Componente: `/src/components/seo/ActivitySchema.tsx`
- Markup JSON-LD para actividades
- Incluye: Product, LocalBusiness, Reviews, AggregateRating
- Mejora la apariencia en resultados de búsqueda (Rich Snippets)

---

## 🛠️ Configuración Necesaria en Vercel

### ✅ NO necesitas cambiar nada en Vercel

El sitio ya está configurado correctamente para SEO:
- ✅ `robots.txt` se sirve automáticamente desde `/public`
- ✅ `sitemap.xml` es una API route que funciona de inmediato
- ✅ Metadata se genera server-side (SSR)
- ✅ Next.js 15 maneja todo automáticamente

**Vercel ya está listo** - No requiere configuración adicional. 🎉

---

## 📊 Google Search Console (IMPORTANTE)

Para que Google indexe tu sitio, **DEBES registrarlo en Google Search Console**:

### Paso 1: Registrar el Sitio

1. Ve a: https://search.google.com/search-console
2. Haz clic en "Añadir propiedad"
3. Selecciona "Prefijo de URL"
4. Ingresa: `https://extraschools.es`

### Paso 2: Verificar Propiedad

**Opción A: Meta Tag (Recomendado)**
1. Google te dará un código como: `<meta name="google-site-verification" content="ABC123...">`
2. Copia solo el código `ABC123...`
3. Añádelo en `/src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  // ... otras configuraciones
  verification: {
    google: 'ABC123...', // ← Pega tu código aquí
  },
}
```

**Opción B: Archivo HTML**
1. Google te dará un archivo `google-verification.html`
2. Súbelo a `/public/google-verification.html`

**Opción C: DNS (Avanzado)**
1. Añade un registro TXT a tu dominio
2. Usa el valor que te proporcione Google

### Paso 3: Enviar Sitemap

1. Una vez verificado, ve a "Sitemaps" en el menú izquierdo
2. Añade la URL: `https://extraschools.es/sitemap.xml`
3. Haz clic en "Enviar"

### Paso 4: Solicitar Indexación

1. Ve a "Inspección de URLs"
2. Ingresa: `https://extraschools.es`
3. Haz clic en "Solicitar indexación"
4. Repite con páginas clave:
   - `https://extraschools.es/search`
   - `https://extraschools.es/about`
   - URLs de actividades populares

---

## ⏱️ Tiempos de Indexación

**¿Cuánto tarda Google en indexar el sitio?**

- **Primera indexación**: 24-72 horas
- **Indexación completa**: 1-2 semanas
- **Ranking en resultados**: 2-4 semanas

**Factores que aceleran la indexación:**
- ✅ Sitio nuevo registrado en Search Console
- ✅ Sitemap enviado correctamente
- ✅ Contenido de calidad y único
- ✅ Estructura técnica correcta (ya implementado)
- ✅ Links desde otras webs (promoción)

---

## 🎯 Herramientas Adicionales Recomendadas

### 1. **Google Analytics 4** (Opcional pero recomendado)
- Monitorea tráfico y comportamiento de usuarios
- Configura en: https://analytics.google.com

### 2. **Bing Webmaster Tools** (Opcional)
- Similar a Google Search Console para Bing
- Configura en: https://www.bing.com/webmasters

### 3. **Schema Markup Validator**
- Verifica que el Schema.org funcione correctamente
- Prueba en: https://validator.schema.org
- URL a probar: `https://extraschools.es/activity/[id]`

---

## 📈 Mejores Prácticas Adicionales

### Contenido de Calidad
- ✅ Actualiza actividades regularmente
- ✅ Publica posts de blog semanalmente
- ✅ Añade descripciones detalladas a las actividades
- ✅ Solicita reseñas a usuarios

### Link Building
- 🔗 Registra el sitio en directorios locales
- 🔗 Colabora con blogs de padres/educación
- 🔗 Crea perfiles en redes sociales con enlace al sitio
- 🔗 Contacta con empresas de actividades para que enlacen

### Rendimiento
- ⚡ Optimiza imágenes (usa WebP)
- ⚡ Habilita caché en Vercel (ya configurado)
- ⚡ Mantén el sitio rápido (<2s de carga)

### Mobile-First
- 📱 Prueba todo en móvil (ya es responsive)
- 📱 Usa Google Mobile-Friendly Test
- 📱 Verifica velocidad en mobile con PageSpeed Insights

---

## 🔍 Cómo Verificar que Todo Funciona

### 1. Probar robots.txt
```
https://extraschools.es/robots.txt
```
Debe mostrar el contenido del archivo.

### 2. Probar sitemap.xml
```
https://extraschools.es/sitemap.xml
```
Debe mostrar XML con todas las URLs.

### 3. Probar Schema.org
1. Ve a: https://validator.schema.org
2. Pega: `https://extraschools.es/activity/[id-real]`
3. Verifica que no haya errores

### 4. Probar Open Graph
1. Ve a: https://www.opengraph.xyz
2. Pega: `https://extraschools.es`
3. Verifica preview para redes sociales

### 5. Probar en Google
Después de 3-7 días, busca en Google:
```
site:extraschools.es
```
Debe mostrar páginas indexadas.

---

## 📞 Soporte

Si algo no funciona:
1. Verifica que el sitio esté desplegado en Vercel
2. Comprueba que las URLs funcionan
3. Revisa Google Search Console para errores
4. Espera 3-7 días antes de preocuparte

---

## ✨ Resumen de Próximos Pasos

1. ✅ **YA IMPLEMENTADO**: robots.txt, sitemap, metadata, schema.org
2. 🔲 **TÚ DEBES HACER**: 
   - Registrar en Google Search Console
   - Verificar propiedad
   - Enviar sitemap
   - Solicitar indexación
3. 🔲 **OPCIONAL**: Google Analytics, Bing Webmaster Tools
4. ⏱️ **ESPERAR**: 3-7 días para ver resultados en Google

---

**Última actualización**: Febrero 2026
**Estado**: ✅ Implementación SEO completa - Lista para indexación
