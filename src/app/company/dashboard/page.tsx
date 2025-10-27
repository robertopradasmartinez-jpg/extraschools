import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { useTranslations } from 'next-intl';
import { 
  FileText, 
  Eye, 
  Heart, 
  Star,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

async function getCompanyStats(userId: string) {
  // Obtener la empresa del usuario
  const company = await prisma.company.findUnique({
    where: { userId },
    include: {
      activities: {
        include: {
          reviews: true,
          favorites: true,
        },
      },
    },
  });

  if (!company) {
    return null;
  }

  // Calcular estadísticas
  const totalActivities = company.activities.length;
  const publishedActivities = company.activities.filter(a => a.published).length;
  const totalReviews = company.activities.reduce((acc, a) => acc + a.reviews.length, 0);
  const totalFavorites = company.activities.reduce((acc, a) => acc + a.favorites.length, 0);
  
  // Calcular rating promedio
  const allRatings = company.activities.flatMap(a => a.reviews.map(r => r.rating));
  const avgRating = allRatings.length > 0 
    ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
    : '0.0';

  // Obtener mensajes recibidos (simulado por ahora)
  const unreadMessages = await prisma.message.count({
    where: {
      receiverId: userId,
      read: false,
    },
  });

  return {
    company,
    stats: {
      totalActivities,
      publishedActivities,
      totalReviews,
      totalFavorites,
      avgRating,
      unreadMessages,
    },
  };
}

export default async function CompanyDashboardPage() {
  const session = await auth();
  const data = await getCompanyStats(session!.user.id);

  if (!data) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No se encontró el perfil de empresa
        </h2>
        <p className="text-gray-600 mb-6">
          Parece que tu cuenta no tiene un perfil de empresa asociado.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  const { company, stats } = data;

  const statCards = [
    {
      name: 'Actividades Totales',
      value: stats.totalActivities,
      subtext: `${stats.publishedActivities} publicadas`,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      name: 'Clics Totales',
      value: '0', // TODO: Implementar tracking de clics
      subtext: 'Este mes',
      icon: Eye,
      color: 'bg-primary-500',
    },
    {
      name: 'Favoritos',
      value: stats.totalFavorites,
      subtext: 'Usuarios interesados',
      icon: Heart,
      color: 'bg-primary-500',
    },
    {
      name: 'Reseñas',
      value: stats.totalReviews,
      subtext: `${stats.avgRating} ⭐ promedio`,
      icon: Star,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {company.name}
        </h1>
        <p className="mt-2 text-gray-600">
          Gestiona tus actividades y visualiza el rendimiento de tu empresa
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.name}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{card.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
                <p className="mt-1 text-sm text-gray-500">{card.subtext}</p>
              </div>
              <div className={`${card.color} rounded-lg p-3`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Actividades Recientes
            </h2>
          </div>
          <div className="p-6">
            {company.activities.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Aún no tienes actividades publicadas
                </p>
                <Link
                  href="/company/activities/new"
                  className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Crear primera actividad
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {company.activities.slice(0, 5).map((activity) => (
                  <Link
                    key={activity.id}
                    href={`/company/activities/${activity.id}/edit`}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{activity.title}</h3>
                      <p className="text-sm text-gray-500">{activity.category}</p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {activity.favorites.length}
                      </span>
                      <span className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {activity.reviews.length}
                      </span>
                    </div>
                  </Link>
                ))}
                {company.activities.length > 5 && (
                  <Link
                    href="/company/activities"
                    className="block text-center text-sm text-primary-500 hover:text-primary-600 font-medium pt-4"
                  >
                    Ver todas las actividades →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Messages & Performance */}
        <div className="space-y-6">
          {/* Messages Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Mensajes</h2>
              <Link
                href="/company/messages"
                className="text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                Ver todos
              </Link>
            </div>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">
                  {stats.unreadMessages}
                </p>
                <p className="text-sm text-gray-600">Mensajes sin leer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
