import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Search, Shield, MessageCircle } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import ActivityCard from '@/components/activities/ActivityCard'

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
      {/* Hero Section */}
      <section className="relative bg-black py-20 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            opacity: 0.85
          }}
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
        
        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Descubre las mejores
              <span className="block text-secondary-400">actividades extraescolares</span>
            </h1>
            <p className="text-xl text-gray-100 font-medium mb-8 max-w-3xl mx-auto drop-shadow-lg">
              Conectamos a padres con empresas que ofrecen actividades increíbles para niños
            </p>
            <Link
              href="/search"
              className="inline-flex items-center px-8 py-4 bg-primary-500 text-white rounded-full font-semibold hover:bg-primary-600 transition shadow-xl hover:shadow-2xl"
            >
              Explorar actividades
              <Search className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      {activities.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-gray-900">
                Actividades destacadas
              </h2>
              <Link
                href="/search"
                className="text-primary-500 font-semibold hover:text-primary-600 transition"
              >
                Ver todas →
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
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            ¿Por qué ExtraSchools?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-6">
                <Search className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Amplia variedad</h3>
              <p className="text-gray-600">
                Deportes, arte, música, idiomas y mucho más
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-6">
                <Shield className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Empresas verificadas</h3>
              <p className="text-gray-600">
                Todas las empresas están verificadas y cuentan con reseñas reales
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-6">
                <MessageCircle className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Fácil comunicación</h3>
              <p className="text-gray-600">
                Contacta directamente con las empresas a través de nuestra plataforma
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Eres una empresa de actividades extraescolares?
          </h2>
          <p className="text-xl text-rose-100 mb-8 max-w-2xl mx-auto">
            Únete a nuestra plataforma y conecta con miles de familias
          </p>
          <Link
            href="/auth/signup?type=company"
            className="inline-flex items-center px-8 py-4 bg-white text-primary-500 rounded-full font-semibold hover:bg-gray-50 transition shadow-lg hover:shadow-xl"
          >
            Registrar mi empresa
          </Link>
        </div>
      </section>
    </div>
  )
}
