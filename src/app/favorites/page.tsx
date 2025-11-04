import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Heart, Search, ArrowRight } from 'lucide-react';
import ActivityCard from '@/components/activities/ActivityCard';

async function getUserFavorites(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: {
      userId,
    },
    include: {
      activity: {
        include: {
          company: true,
          reviews: true,
          favorites: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return favorites;
}

export default async function FavoritesPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin?callbackUrl=/favorites');
  }

  const favorites = await getUserFavorites(session.user.id);
  const activities = favorites.map(f => f.activity);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-secondary-100 p-3 rounded-full mr-4">
              <Heart className="w-8 h-8 text-primary-500 fill-current" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Favoritos</h1>
              <p className="text-gray-600 mt-1">
                {activities.length === 0
                  ? 'Aún no tienes actividades guardadas'
                  : `${activities.length} ${activities.length === 1 ? 'actividad guardada' : 'actividades guardadas'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {activities.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                No tienes favoritos aún
              </h2>
              <p className="text-gray-600 mb-8">
                Explora actividades extraescolares y guarda tus favoritas para verlas más tarde.
                Podrás encontrarlas todas aquí.
              </p>
              <Link
                href="/search"
                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-semibold"
              >
                <Search className="w-5 h-5 mr-2" />
                Explorar Actividades
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Filters/Actions Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="text-sm font-medium text-gray-700 hover:text-primary-500 transition">
                  Todas ({activities.length})
                </button>
                {/* Future filters */}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Ordenar por:</span>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>Más recientes</option>
                  <option>Precio: menor a mayor</option>
                  <option>Precio: mayor a menor</option>
                  <option>Mejor valoradas</option>
                </select>
              </div>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {activities.map((activity) => {
                const avgRating = activity.reviews.length > 0
                  ? activity.reviews.reduce((acc, r) => acc + r.rating, 0) / activity.reviews.length
                  : 0;

                return (
                  <ActivityCard
                    key={activity.id}
                    id={activity.id}
                    title={activity.title}
                    description={activity.description}
                    price={activity.price}
                    city={activity.city}
                    images={activity.images || []}
                    category={activity.category}
                    averageRating={avgRating}
                    reviewCount={activity.reviews.length}
                    isFavorite={true}
                  />
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-3">
                ¿Buscas más actividades?
              </h2>
              <p className="mb-6 text-rose-50">
                Explora nuestra colección completa y encuentra la actividad perfecta para tus hijos
              </p>
              <Link
                href="/search"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-lg hover:bg-secondary-50 transition font-semibold"
              >
                Ver Todas las Actividades
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
