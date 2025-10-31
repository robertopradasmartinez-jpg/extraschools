import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  Plus,
  PlusCircle,
  Edit,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import DeleteActivityButton from '@/components/company/DeleteActivityButton';
import TogglePublishButton from '@/components/company/TogglePublishButton';

async function getCompanyActivities(userId: string) {
  const company = await prisma.company.findUnique({
    where: { userId },
    include: {
      activities: {
        include: {
          reviews: true,
          favorites: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return company;
}

export default async function CompanyActivitiesPage() {
  const session = await auth();
  const company = await getCompanyActivities(session!.user.id);

  if (!company) {
    return <div>No se encontró el perfil de empresa</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Actividades</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona todas tus actividades extraescolares
          </p>
        </div>
        <Link
          href="/company/activities/new"
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Nueva Actividad
        </Link>
      </div>

      {/* Activities List */}
      {company.activities.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes actividades
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza creando tu primera actividad extraescolar
            </p>
            <Link
              href="/company/activities/new"
              className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Crear Primera Actividad
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actividad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estadísticas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {company.activities.map((activity) => (
                  <tr key={activity.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 relative rounded-lg overflow-hidden bg-gray-100">
                          {activity.images && activity.images.length > 0 ? (
                            <Image
                              src={activity.images[0]}
                              alt={activity.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <Eye className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {activity.city}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {activity.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(activity.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TogglePublishButton 
                        activityId={activity.id}
                        published={activity.published}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-4">
                        <span>❤️ {activity.favorites.length}</span>
                        <span>⭐ {activity.reviews.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/company/activities/${activity.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <DeleteActivityButton activityId={activity.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
