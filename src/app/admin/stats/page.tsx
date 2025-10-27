import { prisma } from '@/lib/prisma';
import { TrendingUp, Users, Building2, FileText, Star, Heart, MessageSquare } from 'lucide-react';

async function getDetailedStats() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    usersLast30Days,
    usersLast7Days,
    usersByRole,
    totalCompanies,
    companiesLast30Days,
    totalActivities,
    publishedActivities,
    activitiesLast30Days,
    totalReviews,
    avgRating,
    totalMessages,
    messagesLast7Days,
    totalFavorites,
    topActivitiesByFavorites,
    topCompaniesByActivities,
  ] = await Promise.all([
    // Users
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.groupBy({
      by: ['role'],
      _count: true,
    }),
    // Companies
    prisma.company.count(),
    prisma.company.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    // Activities
    prisma.activity.count(),
    prisma.activity.count({ where: { published: true } }),
    prisma.activity.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    // Reviews
    prisma.review.count(),
    prisma.review.aggregate({
      _avg: { rating: true },
    }),
    // Messages
    prisma.message.count(),
    prisma.message.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    // Favorites
    prisma.favorite.count(),
    // Top activities
    prisma.activity.findMany({
      take: 5,
      orderBy: {
        favorites: {
          _count: 'desc',
        },
      },
      include: {
        company: {
          select: { name: true },
        },
        _count: {
          select: {
            favorites: true,
            reviews: true,
          },
        },
      },
    }),
    // Top companies
    prisma.company.findMany({
      take: 5,
      orderBy: {
        activities: {
          _count: 'desc',
        },
      },
      include: {
        _count: {
          select: {
            activities: true,
          },
        },
      },
    }),
  ]);

  return {
    users: {
      total: totalUsers,
      last30Days: usersLast30Days,
      last7Days: usersLast7Days,
      byRole: usersByRole,
    },
    companies: {
      total: totalCompanies,
      last30Days: companiesLast30Days,
    },
    activities: {
      total: totalActivities,
      published: publishedActivities,
      last30Days: activitiesLast30Days,
      publishedRate: totalActivities > 0 ? (publishedActivities / totalActivities) * 100 : 0,
    },
    reviews: {
      total: totalReviews,
      avgRating: avgRating._avg.rating || 0,
    },
    messages: {
      total: totalMessages,
      last7Days: messagesLast7Days,
    },
    favorites: {
      total: totalFavorites,
    },
    topActivities: topActivitiesByFavorites,
    topCompanies: topCompaniesByActivities,
  };
}

export default async function AdminStatsPage() {
  const stats = await getDetailedStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Estadísticas Detalladas</h1>
        <p className="text-gray-600 mt-2">Análisis completo de la plataforma</p>
      </div>

      {/* Users Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-600" />
          Usuarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Últimos 30 días</p>
            <p className="text-3xl font-bold text-green-600">+{stats.users.last30Days}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Últimos 7 días</p>
            <p className="text-3xl font-bold text-green-600">+{stats.users.last7Days}</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          {stats.users.byRole.map((roleData) => (
            <div key={roleData.role} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{roleData.role}</p>
              <p className="text-2xl font-bold text-gray-900">{roleData._count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Companies Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Building2 className="w-6 h-6 mr-2 text-green-600" />
          Empresas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-3xl font-bold text-gray-900">{stats.companies.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Nuevas (30 días)</p>
            <p className="text-3xl font-bold text-green-600">+{stats.companies.last30Days}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Promedio actividades</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.companies.total > 0
                ? (stats.activities.total / stats.companies.total).toFixed(1)
                : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Activities Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-primary-600" />
          Actividades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-3xl font-bold text-gray-900">{stats.activities.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Publicadas</p>
            <p className="text-3xl font-bold text-green-600">{stats.activities.published}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Nuevas (30 días)</p>
            <p className="text-3xl font-bold text-green-600">+{stats.activities.last30Days}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tasa de publicación</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.activities.publishedRate.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Engagement Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-primary-600" />
          Engagement
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 flex items-center">
              <Star className="w-4 h-4 mr-1" />
              Reseñas
            </p>
            <p className="text-3xl font-bold text-gray-900">{stats.reviews.total}</p>
            <p className="text-sm text-yellow-600 mt-1">
              ★ {stats.reviews.avgRating.toFixed(1)} promedio
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              Favoritos
            </p>
            <p className="text-3xl font-bold text-gray-900">{stats.favorites.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              Mensajes
            </p>
            <p className="text-3xl font-bold text-gray-900">{stats.messages.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mensajes (7 días)</p>
            <p className="text-3xl font-bold text-green-600">+{stats.messages.last7Days}</p>
          </div>
        </div>
      </div>

      {/* Top Activities */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Top Actividades (por favoritos)
        </h2>
        <div className="space-y-3">
          {stats.topActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                <div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600">{activity.company.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center text-primary-600">
                  <Heart className="w-4 h-4 mr-1" />
                  {activity._count.favorites}
                </div>
                <div className="flex items-center text-yellow-600">
                  <Star className="w-4 h-4 mr-1" />
                  {activity._count.reviews}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Companies */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Top Empresas (por actividades)
        </h2>
        <div className="space-y-3">
          {stats.topCompanies.map((company, index) => (
            <div
              key={company.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                )}
                <p className="font-medium text-gray-900">{company.name}</p>
              </div>
              <div className="flex items-center text-primary-600">
                <FileText className="w-4 h-4 mr-1" />
                {company._count.activities} actividades
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
