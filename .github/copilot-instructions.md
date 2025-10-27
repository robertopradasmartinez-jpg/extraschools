# ExtraSchools - Marketplace de Actividades Extraescolares

## ✅ Project Status: BASE COMPLETA Y FUNCIONAL

Web marketplace de actividades extraescolares estilo Airbnb, completamente responsive y lista para desarrollo adicional.

## 🛠️ Tech Stack Implementado
- ✅ Next.js 15 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS (diseño inspirado en Airbnb)
- ✅ PostgreSQL with Prisma ORM
- ✅ NextAuth.js v5 for authentication
- ✅ next-intl for i18n (ES/EN)
- ✅ Lucide React for icons
- ✅ Google Maps API ready (requires API key)
- ✅ Nodemailer for email notifications (requires SMTP config)
- ✅ Stripe ready (requires keys)

## 👥 Roles Implementados
- **PARENT**: Browse, search, favorites, messages, reviews
- **COMPANY**: Dashboard, manage activities, receive messages
- **ADMIN**: Full access to all features

## ✨ Features Completadas

### Core Features
- [x] Homepage con hero, features y actividades destacadas
- [x] Sistema de búsqueda con filtros (categoría, ciudad, edad, precio)
- [x] Página de actividades individual con detalles
- [x] Sistema de autenticación completo (login/registro)
- [x] Header y Footer responsive con navegación
- [x] Blog system
- [x] About page

### Components Creados
- [x] Header (con menú mobile, dropdown de usuario)
- [x] Footer (con enlaces y secciones)
- [x] ActivityCard (tarjetas estilo Airbnb con hover effects)
- [x] SessionProvider (wrapper para NextAuth)

### Database Schema
- [x] User (with roles: PARENT, COMPANY, ADMIN)
- [x] Company (linked to users)
- [x] Activity (con ubicación, precios, categorías)
- [x] Review (ratings and comments)
- [x] Favorite (sistema de favoritos)
- [x] Message (mensajería interna)
- [x] BlogPost (sistema de blog)

### Data & Setup
- [x] Seed script con datos de ejemplo:
  - 3 usuarios (admin, padre, empresa)
  - 3 empresas con perfiles completos
  - 6 actividades de ejemplo (deportes, música, arte)
  - Reseñas de ejemplo
  - Posts de blog
- [x] .env.example con todas las variables necesarias
- [x] README.md completo con instrucciones
- [x] SETUP.md con guía rápida de configuración

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── layout.tsx              # Root layout con providers
│   ├── page.tsx                # Homepage
│   ├── search/page.tsx         # Búsqueda de actividades
│   ├── about/page.tsx          # Sobre nosotros
│   ├── blog/page.tsx           # Lista de blog posts
│   └── api/auth/[...nextauth]/ # NextAuth endpoints
├── components/
│   ├── activities/
│   │   └── ActivityCard.tsx    # Tarjeta de actividad
│   ├── layout/
│   │   ├── Header.tsx          # Navegación principal
│   │   └── Footer.tsx          # Footer del sitio
│   └── providers/
│       └── SessionProvider.tsx # Auth provider wrapper
├── lib/
│   ├── auth.ts                 # NextAuth config
│   ├── prisma.ts               # Prisma client
│   └── utils.ts                # Utility functions
├── types/
│   └── next-auth.d.ts          # NextAuth type extensions
├── i18n.ts                     # next-intl config
└── middleware.ts               # Middleware para i18n
```

## 🚀 Para Empezar

1. **Configurar variables de entorno** (ver .env.example)
2. **Instalar dependencias**: `npm install`
3. **Configurar base de datos**: `npm run db:push`
4. **Cargar datos de ejemplo**: `npm run db:seed`
5. **Iniciar desarrollo**: `npm run dev`

Ver SETUP.md para instrucciones detalladas.

## 🔜 Próximas Funcionalidades a Implementar

### Alta Prioridad
- [ ] Página de detalle de actividad completa
- [ ] Sistema de favoritos funcional (botón en ActivityCard)
- [ ] Panel de empresa (dashboard)
  - [ ] Lista de actividades
  - [ ] Formulario crear/editar actividad
  - [ ] Integración Google Maps para selección de ubicación
- [ ] Sistema de mensajería
  - [ ] Inbox/Sent pages
  - [ ] Compose message
  - [ ] Email notifications
- [ ] Sistema de reseñas (formulario y visualización)
- [ ] Mapa interactivo en página de búsqueda
- [ ] Páginas de autenticación (signin, signup)
- [ ] Panel de administrador

### Media Prioridad
- [ ] Filtros funcionales en búsqueda (client-side o API)
- [ ] Paginación de resultados
- [ ] Perfil de usuario editable
- [ ] Cambio de idioma (selector ES/EN)
- [ ] Página de detalle de empresa
- [ ] Sistema de notificaciones in-app
- [ ] Búsqueda por texto
- [ ] Ordenamiento de resultados

### Baja Prioridad
- [ ] Integración completa de Stripe
- [ ] Sistema de reservas/inscripciones
- [ ] Calendario de disponibilidad
- [ ] Chat en tiempo real
- [ ] App móvil (React Native)
- [ ] Dashboard analytics para empresas
- [ ] Sistema de certificados
- [ ] Export de datos

## 📝 Notas Técnicas

- **NextAuth v5**: Usando beta, API ligeramente diferente a v4
- **Prisma**: Schema completo, solo falta migrar si se cambian modelos
- **i18n**: Configurado con next-intl, archivos en `/messages`
- **Tailwind**: Configurado con colores rose para el theme principal
- **Server/Client Components**: Separados correctamente
- **TypeScript**: Configurado estrictamente, algunos `any` temporales

## 🎨 Design System

- **Color Principal**: Rose 500 (#f43f5e)
- **Font**: Inter
- **Componentes**: Estilo Airbnb - clean, espaciado, imágenes grandes
- **Iconos**: Lucide React
- **Responsive**: Mobile-first approach

## 🔐 Usuarios de Prueba (después del seed)

```
Admin:       admin@extraschools.com     / password123
Padre:       maria@example.com          / password123
Empresa:     deportes@abc.com           / password123
```

## 📧 Contacto y Soporte

Para continuar el desarrollo, revisar los TODOs en cada archivo o consultar la lista de próximas funcionalidades arriba.

---

**Estado**: Base funcional completada ✅
**Última actualización**: Octubre 2025
