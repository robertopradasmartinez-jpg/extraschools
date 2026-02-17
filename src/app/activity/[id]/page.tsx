import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Euro,
  Star,
  Heart,
  Share2,
  MessageSquare,
} from 'lucide-react';
import { formatPrice, getPriceTypeLabel } from '@/lib/utils';
import { auth } from '@/lib/auth';
import AddToFavoritesButton from '@/components/activities/AddToFavoritesButton';
import ActivityMapSection from '@/components/maps/ActivityMapSection';
import ContactButton from '@/components/messages/ContactButton';
import ReviewsSection from '@/components/reviews/ReviewsSection';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getActivity(id: string, userId?: string) {
  const activity = await prisma.activity.findUnique({
    where: { id },
    include: {
      company: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      favorites: userId ? {
        where: {
          userId,
        },
      } : false,
    },
  });

  if (!activity || !activity.published) {
    return null;
  }

  // TODO: Reactivar validación de suscripción cuando Stripe esté configurado
  // Verificar si la empresa tiene suscripción activa
  // if (!activity.company.stripeSubscriptionId || !activity.company.stripeCurrentPeriodEnd) {
  //   return null;
  // }
  
  // if (new Date(activity.company.stripeCurrentPeriodEnd) <= new Date()) {
  //   return null;
  // }

  return activity;
}

export default async function ActivityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const { id } = await params;
  const activity = await getActivity(id, session?.user.id);

  if (!activity) {
    notFound();
  }

  // Calcular rating promedio
  const avgRating = activity.reviews.length > 0
    ? (activity.reviews.reduce((acc, r) => acc + r.rating, 0) / activity.reviews.length).toFixed(1)
    : null;

  const isFavorite = session && activity.favorites && activity.favorites.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 relative z-0">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/search"
              className="flex items-center text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver a búsqueda
            </Link>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              {session && (
                <AddToFavoritesButton
                  activityId={activity.id}
                  initialIsFavorite={!!isFavorite}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {activity.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {avgRating && (
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                <span className="font-semibold">{avgRating}</span>
                <span className="mx-1">·</span>
                <span>{activity.reviews.length} reseñas</span>
              </div>
            )}
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {activity.city}, {activity.province}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          {activity.images && activity.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden">
              <div className="relative h-64 md:h-96">
                <Image
                  src={activity.images[0]}
                  alt={activity.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {activity.images.length > 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {activity.images.slice(1, 5).map((image, index) => (
                    <div key={index} className="relative h-32 md:h-[11.5rem]">
                      <Image
                        src={image}
                        alt={`${activity.title} ${index + 2}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p>Sin imágenes disponibles</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-2 mb-4">
                <span className="px-3 py-1 bg-secondary-100 text-primary-700 rounded-full text-sm font-medium">
                  {activity.category}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs text-gray-600">Edad</p>
                  <p className="font-semibold text-gray-900">
                    {activity.ageMin}-{activity.ageMax} años
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Euro className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs text-gray-600">Precio</p>
                  <p className="font-semibold text-gray-900">
                    {(activity as any).priceType === 'otro' && (activity as any).priceTypeCustom
                      ? `Precio: ${(activity as any).priceTypeCustom}`
                      : `${formatPrice(activity.price)}${getPriceTypeLabel((activity as any).priceType || 'mes', (activity as any).priceTypeCustom)}`
                    }
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Heart className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs text-gray-600">Favoritos</p>
                  <p className="font-semibold text-gray-900">
                    {activity.favorites ? activity.favorites.length : 0}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Star className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                  <p className="text-xs text-gray-600">Rating</p>
                  <p className="font-semibold text-gray-900">
                    {avgRating || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Descripción
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </div>

            {/* Location Map */}
            <ActivityMapSection
              latitude={activity.latitude}
              longitude={activity.longitude}
              title={activity.title}
              address={activity.address}
              city={activity.city}
              province={activity.province}
              postalCode={activity.postalCode}
            />

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <ReviewsSection
                activityId={activity.id}
                activityTitle={activity.title}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Booking Card */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                <div className="mb-6">
                  <div className="flex items-baseline">
                    {(activity as any).priceType === 'otro' && (activity as any).priceTypeCustom ? (
                      <span className="text-3xl font-bold text-gray-900">
                        Precio: {(activity as any).priceTypeCustom}
                      </span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-gray-900">
                          {formatPrice(activity.price)}
                        </span>
                        <span className="text-gray-600 ml-2">{getPriceTypeLabel((activity as any).priceType || 'mes', (activity as any).priceTypeCustom)}</span>
                      </>
                    )}
                  </div>
                </div>

                <ContactButton
                  activityId={activity.id}
                  activityTitle={activity.title}
                  companyName={activity.company.name}
                />

                {activity.company.website && (
                  <a
                    href={activity.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-3 py-3 bg-white border-2 border-primary-500 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors text-center"
                  >
                    Visitar su web
                  </a>
                )}
              </div>

              {/* Company Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Organizado por
                </h3>
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-primary-600">
                      {activity.company.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {activity.company.name}
                    </p>
                    {activity.company.phone && (
                      <>
                        <p className="text-sm text-gray-600 mb-2">
                          📞 {activity.company.phone}
                        </p>
                        {activity.company.whatsappEnabled && (
                          <a
                            href={`https://wa.me/${activity.company.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            Contactar por WhatsApp
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {activity.company.description && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {activity.company.description}
                  </p>
                )}

                <Link
                  href={`/empresas/${activity.company.id}`}
                  className="block w-full text-center py-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 font-medium hover:bg-blue-100 transition-colors"
                >
                  Ver perfil completo →
                </Link>
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Información adicional
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start">
                    <Users className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Edad recomendada</p>
                      <p className="text-gray-600">
                        De {activity.ageMin} a {activity.ageMax} años
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Ubicación</p>
                      <p className="text-gray-600">{activity.city}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MessageSquare className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Idioma</p>
                      <p className="text-gray-600">Español</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
