# 🚀 Guía de Configuración Rápida

## Pasos para poner en marcha el proyecto:

### 1. Configurar Base de Datos

Tienes dos opciones:

#### Opción A: PostgreSQL Local
```bash
# Instalar PostgreSQL si no lo tienes
# Mac: brew install postgresql@14
# Linux: sudo apt-get install postgresql
# Windows: Descarga desde https://www.postgresql.org/download/

# Crear base de datos
createdb extraschools

# Actualizar DATABASE_URL en .env
DATABASE_URL="postgresql://tu-usuario:tu-password@localhost:5432/extraschools"
```

#### Opción B: Base de Datos en la Nube (Recomendado para desarrollo)
1. Crea una cuenta gratuita en [Supabase](https://supabase.com) o [Neon](https://neon.tech)
2. Crea un nuevo proyecto PostgreSQL
3. Copia la connection string y actualiza `.env`:
```bash
DATABASE_URL="tu-connection-string-aqui"
```

### 2. Configurar Google Maps (Opcional pero recomendado)

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto
3. Habilita estas APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Crea credenciales (API Key)
5. Actualiza `.env`:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="tu-api-key-aqui"
```

### 3. Inicializar Base de Datos

```bash
# Aplicar el schema a la base de datos
npm run db:push

# Cargar datos de ejemplo (usuarios, empresas, actividades)
npm run db:seed
```

### 4. Generar NextAuth Secret

```bash
# Genera un secreto seguro
openssl rand -base64 32

# Copia el resultado y actualiza .env
NEXTAUTH_SECRET="tu-secreto-generado-aqui"
```

### 5. Configurar Email (Opcional)

Para recibir notificaciones por email al recibir mensajes:

#### Gmail:
1. Activa la verificación en 2 pasos
2. Genera una "Contraseña de aplicación"
3. Actualiza `.env`:
```bash
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="tu-email@gmail.com"
EMAIL_SERVER_PASSWORD="tu-password-de-app"
EMAIL_FROM="noreply@extraschools.com"
```

### 6. Ejecutar el Proyecto

```bash
# Modo desarrollo
npm run dev
```

Abre http://localhost:3000

## 🎉 ¡Listo!

### Usuarios de Prueba

Después del seed, usa estas credenciales:

**Administrador:**
- Email: admin@extraschools.com
- Password: password123

**Padre:**
- Email: maria@example.com
- Password: password123

**Empresa:**
- Email: deportes@abc.com
- Password: password123

## 🛠️ Comandos Útiles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run db:push      # Aplicar cambios del schema
npm run db:seed      # Recargar datos de ejemplo
npm run db:studio    # Abrir Prisma Studio (GUI para DB)
npm run lint         # Verificar código
```

## 📝 Próximos Pasos

1. **Personaliza el diseño**: Los estilos están en Tailwind CSS
2. **Añade más actividades**: Usa el panel de empresa o Prisma Studio
3. **Configura el dominio**: Para producción, actualiza `NEXTAUTH_URL` y `NEXT_PUBLIC_APP_URL`
4. **Integra Stripe**: La configuración inicial está lista en `.env`

## ❓ Problemas Comunes

### Error de conexión a la base de datos
- Verifica que PostgreSQL esté corriendo
- Comprueba que el `DATABASE_URL` sea correcto

### Error de Google Maps
- Verifica que la API key sea válida
- Asegúrate de que las APIs necesarias estén habilitadas

### Error en npm run dev
- Borra `node_modules` y ejecuta `npm install` de nuevo
- Verifica que estés usando Node.js 18+

## 🆘 Necesitas Ayuda?

Revisa el README.md completo para más información detallada.
