# 🎓 ExtraSchools - Marketplace de Actividades Extraescolares

Una plataforma web completa estilo Airbnb para conectar padres con empresas que ofrecen actividades extraescolares en España.

## ✨ Características Principales

- 🎨 **Diseño moderno** inspirado en Airbnb, completamente responsive
- 🗺️ **Mapa interactivo** con Google Maps para visualizar actividades
- 👥 **Sistema de roles**: Padres, Empresas y Administrador
- 💬 **Mensajería interna** con notificaciones por email
- ⭐ **Sistema de reseñas** y valoraciones
- ❤️ **Favoritos** para padres registrados
- 🌐 **Multiidioma** (Español e Inglés)
- 📝 **Blog** integrado
- 🔐 **Autenticación** con NextAuth.js
- 💳 **Stripe** configurado (para futuras integraciones)

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: NextAuth.js v5
- **Mapa**: Google Maps API
- **i18n**: next-intl
- **Email**: Nodemailer
- **Iconos**: Lucide React
- **Pagos**: Stripe (configuración inicial)

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- Cuenta de Google Cloud (para Maps API)
- Cuenta de Email SMTP (opcional, para notificaciones)

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd extraschools
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
# Database - Usa tu servidor PostgreSQL local o en la nube
DATABASE_URL="postgresql://user:password@localhost:5432/extraschools"

# NextAuth - Genera un secreto seguro
NEXTAUTH_SECRET="tu-secreto-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Google Maps API - Obtén tu clave en https://console.cloud.google.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="tu-api-key-aqui"

# Email (opcional) - Configura tu servidor SMTP
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_USER="tu-email@gmail.com"
EMAIL_SERVER_PASSWORD="tu-contraseña-de-app"
```

### 4. Configurar la base de datos

```bash
# Crear las tablas en la base de datos
npm run db:push

# Cargar datos de ejemplo
npm run db:seed
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 👤 Usuarios de Prueba

Después de ejecutar el seed, puedes usar estas credenciales:

```
Administrador:
- Email: admin@extraschools.com
- Password: password123

Padre:
- Email: maria@example.com
- Password: password123

Empresa:
- Email: deportes@abc.com
- Password: password123
```

## 📁 Estructura del Proyecto

```
extraschools/
├── prisma/
│   ├── schema.prisma      # Esquema de base de datos
│   └── seed.ts            # Datos de ejemplo
├── public/                # Archivos estáticos
├── src/
│   ├── app/              # Rutas de Next.js (App Router)
│   ├── components/       # Componentes React
│   │   ├── layout/       # Header, Footer
│   │   └── activities/   # Componentes de actividades
│   ├── lib/              # Utilidades y configuración
│   │   ├── auth.ts       # Configuración de NextAuth
│   │   ├── prisma.ts     # Cliente de Prisma
│   │   └── utils.ts      # Funciones auxiliares
│   └── types/            # Tipos de TypeScript
├── messages/             # Traducciones (es.json, en.json)
└── .env                  # Variables de entorno
```

## 🎯 Roles de Usuario

### Padres (PARENT)
- Ver todas las actividades
- Buscar y filtrar actividades
- Guardar actividades en favoritos
- Enviar mensajes a empresas
- Dejar reseñas y valoraciones

### Empresas (COMPANY)
- Panel de gestión de actividades
- Crear, editar y eliminar actividades
- Recibir mensajes de padres (con notificación email)
- Ver estadísticas básicas

### Administrador (ADMIN)
- Acceso completo a todas las funcionalidades
- Gestionar usuarios y empresas
- Moderar contenido y reseñas

## 🗺️ Configuración de Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un proyecto nuevo
3. Habilita las APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Crea credenciales (API Key)
5. Añade la clave a `.env` como `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

## 📧 Configuración de Email

Para recibir notificaciones por email:

1. Si usas Gmail, crea una "Contraseña de aplicación"
2. Configura las variables en `.env`:
   - `EMAIL_SERVER_HOST`
   - `EMAIL_SERVER_USER`
   - `EMAIL_SERVER_PASSWORD`

## 🚀 Deployment

### Vercel (Recomendado)

1. Push tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura las variables de entorno
4. Despliega

### Otros Hosting

Asegúrate de:
- Tener Node.js 18+
- Configurar PostgreSQL
- Establecer todas las variables de entorno
- Ejecutar `npm run build && npm start`

## 🛠️ Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run db:push      # Sincronizar schema con DB
npm run db:seed      # Cargar datos de ejemplo
npm run db:studio    # Abrir Prisma Studio
```

## 📝 Próximas Funcionalidades

- [ ] Integración completa de Stripe para pagos
- [ ] Sistema de notificaciones en tiempo real
- [ ] Chat en vivo
- [ ] Calendario de disponibilidad
- [ ] Sistema de reservas
- [ ] Certificados y documentación
- [ ] App móvil

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 📞 Soporte

Para preguntas o soporte, contacta a través de [email o issue tracker].

---

Hecho con ❤️ para conectar familias con las mejores actividades extraescolares
# extraschools
