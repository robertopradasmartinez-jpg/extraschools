import { prisma } from '@/lib/prisma';
import {
  Users,
  Building2,
  FileText,
  MessageSquare,
  TrendingUp,
  Activity,
  Star,
  Heart,
} from 'lucide-react';
import Link from 'next/link';

async function getDashboardStats() {
  try {
    // Get basic counts first
    const totalUsers = await prisma.user.count();
    const totalCompanies = await prisma.company.count();
    const totalActivities = await prisma.activity.count();
    const publishedActivities = await prisma.activity.count({ where: { published: true } });
    
    // Get secondary counts
    const totalMessages = await prisma.message.count();
    const totalReviews = await prisma.review.count();
    const totalFavorites = await prisma.favorite.count();
    
    // Get recent data
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    
    const recentCompanies = await prisma.company.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });
    
    const recentActivities = await prisma.activity.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      stats: {
        totalUsers,
        totalCompanies,
        totalActivities,
        publishedActivities,
        totalMessages,
        totalReviews,
        totalFavorites,
      },
      recent: {
        users: recentUsers,
        companies: recentCompanies,
        activities: recentActivities,
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values if database fails
    return {
      stats: {
        totalUsers: 0,
        totalCompanies: 0,
        totalActivities: 0,
        publishedActivities: 0,
        totalMessages: 0,
        totalReviews: 0,
        totalFavorites: 0,
      },
      recent: {
        users: [],
        companies: [],
        activities: [],
      },
    };
  }
}

export default async function AdminDashboardPage() {
  const { stats, recent } = await getDashboardStats();

  const statCards = [
    {
      name: 'Total Usuarios',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      href: '/admin/users',
    },
    {
      name: 'Total Empresas',
      value: stats.totalCompanies,
      icon: Building2,
      color: 'bg-green-500',
      href: '/admin/companies',
    },
    {
      name: 'Total Actividades',
      value: stats.totalActivities,
      icon: FileText,
      color: 'bg-primary-500',
      href: '/admin/activities',
    },
    {
      name: 'Actividades Publicadas',
      value: stats.publishedActivities,
      icon: Activity,
      color: 'bg-indigo-500',
      href: '/admin/activities',
    },
    {
      name: 'Total Mensajes',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'bg-primary-500',
      href: '/admin/messages',
    },
    {
      name: 'Total Reseñas',
      value: stats.totalReviews,
      icon: Star,
      color: 'bg-yellow-500',
      href: '/admin/activities',
    },
    {
      name: 'Total Favoritos',
      value: stats.totalFavorites,
      icon: Heart,
      color: 'bg-secondary-500',
      href: '/admin/activities',
    },
    {
      name: 'Tasa de Publicación',
      value: `${stats.totalActivities > 0 ? Math.round((stats.publishedActivities / stats.totalActivities) * 100) : 0}%`,
      icon: TrendingUp,
      color: 'bg-teal-500',
      href: '/admin/stats',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Bienvenido al panel de administración de ExtraSchools
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Usuarios Recientes</h2>
            <Link
              href="/admin/users"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todos →
            </Link>
          </div>
          <div className="space-y-4">
            {recent.users.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || 'Sin nombre'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  user.role === 'ADMIN' ? 'bg-primary-100 text-primary-800' :
                  user.role === 'COMPANY' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Companies */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Empresas Recientes</h2>
            <Link
              href="/admin/companies"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todas →
            </Link>
          </div>
          <div className="space-y-4">
            {recent.companies.map((company) => (
              <div key={company.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {company.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{company.user.email}</p>
                </div>
                <Building2 className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Actividades Recientes</h2>
            <Link
              href="/admin/activities"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todas →
            </Link>
          </div>
          <div className="space-y-4">
            {recent.activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{activity.company.name}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  activity.published
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {activity.published ? 'Publicada' : 'Borrador'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
