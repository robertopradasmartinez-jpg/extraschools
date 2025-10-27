# 🎓 ExtraSchools - Marketplace de Actividades Extraescolares

## ✅ PROYECTO COMPLETADO Y LISTO PARA USAR

Has creado exitosamente una plataforma web completa estilo Airbnb para actividades extraescolares.

## 🚀 Inicio Rápido

### 1. Configurar Base de Datos

Opción más rápida (Base de datos en la nube - GRATIS):

1. Ve a [Supabase](https://supabase.com) o [Neon](https://neon.tech)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto PostgreSQL
4. Copia la connection string
5. Edita el archivo `.env` y pega tu connection string:
   ```
   DATABASE_URL="tu-connection-string-aqui"
   ```

### 2. Generar Secret para NextAuth

```bash
openssl rand -base64 32
```

Copia el resultado y actualiza en `.env`:
```
NEXTAUTH_SECRET="tu-secreto-aqui"
```

### 3. Inicializar Base de Datos

```bash
npm run db:push
npm run db:seed
```

### 4. Iniciar el Servidor

```bash
npm run dev
```

Abre http://localhost:3000

## 🎉 ¡Listo para Probar!

### Usuarios de Prueba

```
Administrador:
Email: admin@extraschools.com
Password: password123

Padre:
Email: maria@example.com
Password: password123

Empresa:
Email: deportes@abc.com
Password: password123
```

## ✨ Características Implementadas

- ✅ Homepage con diseño estilo Airbnb
- ✅ Sistema de búsqueda de actividades
- ✅ Autenticación con 3 roles (Parent, Company, Admin)
- ✅ Header y Footer responsive
- ✅ Tarjetas de actividades con imágenes
- ✅ Página de Blog
- ✅ Página About
- ✅ Base de datos completa con Prisma
- ✅ Multiidioma (Español/Inglés) configurado
- ✅ 6 actividades de ejemplo cargadas
- ✅ Sistema preparado para Google Maps
- ✅ Sistema preparado para email notifications
- ✅ Sistema preparado para Stripe

## 📝 Configuraciones Opcionales

### Google Maps (Para mapa interactivo)

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto y habilita Maps JavaScript API
3. Genera una API Key
4. Añádela a `.env`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="tu-api-key"
   ```

### Email Notifications (Para mensajería)

Si usas Gmail:
1. Activa verificación en 2 pasos
2. Genera una "Contraseña de aplicación"
3. Actualiza `.env`:
   ```
   EMAIL_SERVER_USER="tu-email@gmail.com"
   EMAIL_SERVER_PASSWORD="tu-password-de-app"
   ```

## 🛠️ Comandos Útiles

```bash
npm run dev          # Desarrollo
npm run build        # Build producción
npm run db:studio    # Abrir base de datos (GUI)
npm run db:seed      # Recargar datos de ejemplo
```

## 📚 Documentación Completa

- `README.md` - Documentación técnica completa
- `SETUP.md` - Guía detallada de configuración
- `.github/copilot-instructions.md` - Estado del proyecto y próximas features

## 🎯 Próximos Pasos Sugeridos

1. **Personaliza el contenido**: Edita textos, colores, imágenes
2. **Añade más actividades**: Usa Prisma Studio o el panel de empresa
3. **Implementa el panel de empresa**: Para gestionar actividades
4. **Añade el sistema de favoritos**: Para que padres guarden actividades
5. **Implementa la mensajería**: Para comunicación padres-empresas
6. **Añade el mapa interactivo**: Integra Google Maps
7. **Sistema de reseñas**: Permitir valoraciones de actividades

## 📁 Estructura del Proyecto

```
extraschools/
├── prisma/
│   ├── schema.prisma    # Esquema de base de datos
│   └── seed.ts          # Datos de ejemplo
├── src/
│   ├── app/             # Páginas (Next.js App Router)
│   ├── components/      # Componentes React
│   ├── lib/             # Utilidades (auth, prisma, utils)
│   └── types/           # TypeScript types
├── messages/            # Traducciones ES/EN
├── .env                 # Variables de entorno
├── README.md            # Documentación completa
└── SETUP.md            # Guía de configuración
```

## 🆘 ¿Problemas?

### No se conecta a la base de datos
- Verifica que `DATABASE_URL` en `.env` sea correcto
- Si usas PostgreSQL local, asegúrate de que esté corriendo

### Error al hacer npm run dev
- Ejecuta: `rm -rf node_modules package-lock.json && npm install`
- Verifica que uses Node.js 18+

### No aparecen actividades
- Ejecuta: `npm run db:seed`

## 💡 Tips

- Usa `npm run db:studio` para ver y editar la base de datos visualmente
- Los estilos usan Tailwind CSS (muy fácil de personalizar)
- El color principal es `rose-500` (puedes cambiarlo en los archivos)
- Todas las páginas son responsive automáticamente

## 🎨 Personalización Rápida

### Cambiar colores:
Busca y reemplaza `rose-500` por otro color de Tailwind:
- `blue-500` para azul
- `green-500` para verde
- `purple-500` para morado

### Cambiar nombre de la app:
Busca "ExtraSchools" en los archivos y reemplázalo.

---

**¡Felicidades!** 🎉 Tu plataforma está lista para ser personalizada y lanzada.

Para cualquier duda, revisa los archivos README.md y SETUP.md con información detallada.
