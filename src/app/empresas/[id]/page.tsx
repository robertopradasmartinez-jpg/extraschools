import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Star,
} from 'lucide-react';
import ActivityCard from '@/components/activities/ActivityCard';
import { auth } from '@/lib/auth';

async function getCompanyProfile(id: string, userId?: string) {
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      activities: {
        where: {
          published: true,
        },
        include: {
          company: {
            select: {
              name: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          favorites: userId ? {
            where: {
              userId,
            },
            select: {
              id: true,
            },
          } : false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  return company;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const company = await getCompanyProfile(params.id);
  
  if (!company) {
    return {
      title: 'Empresa no encontrada | ExtraSchools',
    };
  }

  return {
    title: `${company.name} | ExtraSchools`,
    description: company.description || `Conoce las actividades de ${company.name}`,
  };
}

export default async function PublicCompanyProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const company = await getCompanyProfile(params.id, session?.user?.id);

  if (!company) {
    notFound();
  }

  // Calculate company stats
  const totalActivities = company.activities.length;
  const totalReviews = company.activities.reduce(
    (acc, activity) => acc + activity.reviews.length,
    0
  );
  const avgRating = totalReviews > 0
    ? (
        company.activities.reduce(
          (acc, activity) =>
            acc +
            activity.reviews.reduce((sum, review) => sum + review.rating, 0),
          0
        ) / totalReviews
      ).toFixed(1)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/search"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver a búsqueda
          </Link>
        </div>
      </div>

      {/* Company Profile Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
            {/* Logo */}
            <div className="flex-shrink-0 mb-4 md:mb-0">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {company.name}
                  </h1>
                  {company.description && (
                    <p className="text-gray-700 leading-relaxed max-w-3xl">
                      {company.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-semibold text-gray-900">
                      {avgRating || 'N/A'}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    ({totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'})
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Building2 className="w-5 h-5" />
                  <span className="font-medium">
                    {totalActivities} {totalActivities === 1 ? 'actividad' : 'actividades'}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">
                    Miembro desde{' '}
                    {new Date(company.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 mt-6">
                {company.user.email && (
                  <a
                    href={`mailto:${company.user.email}`}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-medium">Enviar email</span>
                  </a>
                )}

                {company.phone && (
                  <a
                    href={`tel:${company.phone}`}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-medium">{company.phone}</span>
                  </a>
                )}

                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">Visitar sitio web</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Actividades de {company.name}
          </h2>
          <p className="text-gray-600">
            Explora todas las actividades que ofrece esta empresa
          </p>
        </div>

        {company.activities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {company.activities.map((activity) => {
              const avgActivityRating = activity.reviews.length > 0
                ? activity.reviews.reduce((acc, r) => acc + r.rating, 0) /
                  activity.reviews.length
                : undefined;

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
                  averageRating={avgActivityRating}
                  reviewCount={activity.reviews.length}
                  isFavorite={activity.favorites ? activity.favorites.length > 0 : false}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay actividades publicadas
            </h3>
            <p className="text-gray-600">
              Esta empresa aún no ha publicado ninguna actividad
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
