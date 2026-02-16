'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Heart,
  Star,
  MapPin,
} from 'lucide-react';

interface Activity {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string;
  ageMin: number;
  ageMax: number;
  price: number;
  city: string;
  published: boolean;
  createdAt: string;
  company: {
    id: string;
    name: string;
    logo: string | null;
  };
  _count: {
    reviews: number;
    favorites: number;
  };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });

  useEffect(() => {
    fetchActivities();
  }, [pagination.page, publishedFilter, categoryFilter]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
        published: publishedFilter,
        category: categoryFilter,
      });

      const response = await fetch(`/api/admin/activities?${params}`);
      const data = await response.json();

      if (response.ok) {
        setActivities(data.activities);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination({ ...pagination, page: 1 });
    fetchActivities();
  };

  const handleTogglePublished = async (activityId: string, published: boolean) => {
    try {
      const response = await fetch('/api/admin/activities', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activityId, published }),
      });

      if (response.ok) {
        fetchActivities();
      }
    } catch (error) {
      console.error('Error toggling published:', error);
      alert('Error al actualizar estado de publicación');
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (
      !confirm(
        '¿Estás seguro de eliminar esta actividad? Esta acción no se puede deshacer.'
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/activities?activityId=${activityId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchActivities();
      } else {
        const data = await response.json();
        alert(data.error || 'Error al eliminar actividad');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Error al eliminar actividad');
    }
  };

  const categories = [
    'SPORTS',
    'ARTS',
    'MUSIC',
    'TECHNOLOGY',
    'LANGUAGES',
    'SCIENCE',
    'OTHER',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Actividades</h1>
          <p className="text-gray-600 mt-2">Total: {pagination.total} actividades</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por título o empresa..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium"
            >
              Buscar
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <select
                value={publishedFilter}
                onChange={(e) => setPublishedFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Todos los estados</option>
                <option value="true">Publicadas</option>
                <option value="false">Borradores</option>
              </select>
            </div>
            <div className="flex-1">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="ALL">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>

      {/* Activities Grid */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Cargando actividades...
          </div>
        ) : activities.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No se encontraron actividades
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  {/* Image */}
                  {activity.image && (
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-48 object-cover"
                    />
                  )}

                  <div className="p-4 space-y-3">
                    {/* Title and Company */}
                    <div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600">{activity.company.name}</p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {activity.description}
                    </p>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {activity.city}
                      </div>
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {activity.category}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {activity._count.favorites}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        {activity._count.reviews}
                      </div>
                      <div className="flex-1 text-right font-bold text-gray-900">
                        €{activity.price}{(activity as any).priceType === 'otro' ? `/${(activity as any).priceTypeCustom || ''}` : `/${(activity as any).priceType || 'mes'}`}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="pt-2 border-t">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          activity.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {activity.published ? 'Publicada' : 'Borrador'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/activity/${activity.id}`}
                        target="_blank"
                        className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium text-center flex items-center justify-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Ver
                      </Link>
                      <button
                        onClick={() =>
                          handleTogglePublished(activity.id, !activity.published)
                        }
                        className={`px-3 py-2 rounded-lg transition text-sm font-medium ${
                          activity.published
                            ? 'bg-gray-600 text-white hover:bg-gray-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                        title={activity.published ? 'Despublicar' : 'Publicar'}
                      >
                        {activity.published ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Mostrando {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                {pagination.total} actividades
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </button>
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  disabled={pagination.page >= pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
