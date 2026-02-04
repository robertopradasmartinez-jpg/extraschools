import Link from 'next/link'
import { Search, Shield, MessageCircle, Star, TrendingUp, Users, MapPin, Calendar, Award } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ActivityCard from '@/components/activities/ActivityCard'

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getFeaturedActivities() {
  const allActivities = await prisma.activity.findMany({
    where: { published: true },
    take: 20, // Traer más para compensar el filtrado
    orderBy: { createdAt: 'desc' },
    include: {
      company: {
        select: {
          name: true,
          logo: true,
          stripeSubscriptionId: true,
          stripeCurrentPeriodEnd: true,
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        }
      },
      reviews: {
        select: {
          rating: true
        }
      }
    }
  });

  // TODO: Reactivar validación de suscripción cuando Stripe esté configurado
  // Filtrar solo actividades de empresas con suscripción activa
  // const activeActivities = allActivities.filter(activity => {
  //   if (!activity.company.stripeSubscriptionId || !activity.company.stripeCurrentPeriodEnd) {
  //     return false;
  //   }
  //   return new Date(activity.company.stripeCurrentPeriodEnd) > new Date();
  // });

  // Tomar solo las primeras 6 (sin filtrar por suscripción)
  return allActivities.slice(0, 6);
}

export default async function Home() {
  const activities = await getFeaturedActivities()

  return (
    <div>
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 py-16 md:py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-400/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
              Encuentra la actividad
              <span className="block bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent">perfecta para tus hijos</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-12 max-w-3xl mx-auto">
              Miles de actividades extraescolares verificadas cerca de ti
            </p>
            
            {/* Search Button */}
            <div className="max-w-xl mx-auto mb-10">
              <Link
                href="/search"
                className="inline-flex items-center justify-center w-full px-12 py-6 text-xl md:text-2xl font-black text-primary-600 bg-white rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
              >
                <Search className="w-7 h-7 mr-3" />
                Buscar Actividades
              </Link>
            </div>
            
            {/* Popular Searches */}
            <div className="max-w-3xl mx-auto">
              <h3 className="text-white font-bold text-lg mb-5 text-center">Búsquedas populares:</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { name: 'Fútbol', icon: '⚽' },
                  { name: 'Inglés', icon: '🗣️' },
                  { name: 'Piano', icon: '🎹' },
                  { name: 'Pintura', icon: '🎨' },
                  { name: 'Robótica', icon: '🤖' }
                ].map((term) => (
                  <Link
                    key={term.name}
                    href={`/search?search=${term.name.toLowerCase()}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-800 font-semibold rounded-full hover:bg-yellow-300 hover:scale-110 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <span className="text-xl">{term.icon}</span>
                    {term.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-black text-primary-500 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Actividades</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-secondary-500 mb-2">100+</div>
              <div className="text-gray-600 font-medium">Empresas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-yellow-500 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Ciudades</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-primary-500 mb-2">4.8</div>
              <div className="text-gray-600 font-medium">Valoración media</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Explora por categorías
            </h2>
            <p className="text-lg text-gray-600">Encuentra la actividad perfecta para tu hijo</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: 'Deportes', icon: '⚽', color: 'from-blue-500 to-blue-600' },
              { name: 'Música', icon: '🎵', color: 'from-purple-500 to-purple-600' },
              { name: 'Arte', icon: '🎨', color: 'from-pink-500 to-pink-600' },
              { name: 'Idiomas', icon: '🗣️', color: 'from-green-500 to-green-600' },
              { name: 'Robótica', icon: '🤖', color: 'from-indigo-500 to-indigo-600' },
              { name: 'Danza', icon: '💃', color: 'from-teal-500 to-teal-600' },
            ].map((category) => (
              <Link
                key={category.name}
                href={`/search?category=${category.name}`}
                className="card p-6 text-center group hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl transform group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-primary-500 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      {activities.length > 0 && (
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                  Actividades destacadas
                </h2>
                <p className="text-lg text-gray-600">Las mejores opciones cerca de ti</p>
              </div>
              <Link
                href="/search"
                className="hidden md:inline-flex items-center text-primary-500 font-bold hover:text-primary-600 transition group"
              >
                Ver todas 
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity: any) => {
                const avgRating = activity.reviews.length > 0
                  ? activity.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / activity.reviews.length
                  : 0

                return (
                  <ActivityCard
                    key={activity.id}
                    id={activity.id}
                    title={activity.title}
                    description={activity.description}
                    price={activity.price}
                    city={activity.city}
                    images={activity.images}
                    category={activity.category}
                    averageRating={avgRating}
                    reviewCount={activity.reviews.length}
                  />
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              ¿Por qué elegir ExtraSchools?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              La plataforma más completa para encontrar actividades extraescolares
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-8 text-center group hover:-translate-y-2 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Búsqueda fácil</h3>
              <p className="text-gray-600">
                Encuentra actividades cerca de ti en segundos
              </p>
            </div>
            <div className="card p-8 text-center group hover:-translate-y-2 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">100% Verificado</h3>
              <p className="text-gray-600">
                Todas las empresas están verificadas y cuentan con reseñas reales
              </p>
            </div>
            <div className="card p-8 text-center group hover:-translate-y-2 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Reseñas auténticas</h3>
              <p className="text-gray-600">
                Lee opiniones de otros padres antes de decidir
              </p>
            </div>
            <div className="card p-8 text-center group hover:-translate-y-2 transition-all duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Contacto directo</h3>
              <p className="text-gray-600">
                Habla directamente con las empresas sin intermediarios
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-lg text-gray-600">Tres sencillos pasos para encontrar la actividad ideal</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full text-white text-3xl font-black mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Busca</h3>
              <p className="text-gray-600 text-lg">
                Explora cientos de actividades por categoría, ubicación o precio
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full text-white text-3xl font-black mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Compara</h3>
              <p className="text-gray-600 text-lg">
                Lee reseñas, compara precios y encuentra la mejor opción
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full text-white text-3xl font-black mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Contacta</h3>
              <p className="text-gray-600 text-lg">
                Envía un mensaje y empieza cuando quieras
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden" style={{background: 'linear-gradient(135deg, #00A3FF 0%, #FF006B 100%)'}}>
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-32 translate-y-32"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            ¿Eres una empresa de actividades extraescolares?
          </h2>
          <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-3xl mx-auto font-medium">
            Únete a nuestra plataforma y conecta con miles de familias que buscan actividades para sus hijos
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup?type=company"
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-primary-600 rounded-full font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-2xl hover:shadow-xl transform hover:scale-105"
            >
              Registrar mi empresa gratis
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-10 py-5 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300"
            >
              Más información
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-white/90">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="font-medium">+1000 familias</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Crece tu negocio</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Sin permanencia</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
