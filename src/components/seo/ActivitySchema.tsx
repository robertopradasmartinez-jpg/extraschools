/**
 * Componente para añadir Schema.org JSON-LD markup
 * Mejora el SEO y la apariencia en resultados de búsqueda
 */

interface ActivitySchemaProps {
  activity: {
    id: string;
    title: string;
    description: string;
    price: number;
    priceType: string;
    category: string;
    city: string;
    province: string;
    address: string | null;
    images: string[];
    ageMin: number;
    ageMax: number;
    company: {
      name: string;
      phone: string;
    };
    reviews?: {
      rating: number;
      comment: string | null;
      user: {
        name: string | null;
      };
    }[];
  };
}

export default function ActivitySchema({ activity }: ActivitySchemaProps) {
  // Calcular rating promedio si hay reviews
  const averageRating = activity.reviews && activity.reviews.length > 0
    ? activity.reviews.reduce((sum, review) => sum + review.rating, 0) / activity.reviews.length
    : null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: activity.title,
    description: activity.description,
    image: activity.images,
    category: activity.category,
    brand: {
      '@type': 'Organization',
      name: activity.company.name,
    },
    offers: {
      '@type': 'Offer',
      price: activity.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: activity.price,
        priceCurrency: 'EUR',
        unitText: activity.priceType,
      },
    },
    ...(averageRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: activity.reviews!.length,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    ...(activity.reviews && activity.reviews.length > 0 && {
      review: activity.reviews.map((review) => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: '5',
          worstRating: '1',
        },
        author: {
          '@type': 'Person',
          name: review.user.name || 'Usuario',
        },
        ...(review.comment && { reviewBody: review.comment }),
      })),
    }),
    audience: {
      '@type': 'EducationalAudience',
      suggestedMinAge: activity.ageMin,
      suggestedMaxAge: activity.ageMax,
    },
    provider: {
      '@type': 'LocalBusiness',
      name: activity.company.name,
      telephone: activity.company.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: activity.city,
        addressRegion: activity.province,
        addressCountry: 'ES',
        ...(activity.address && { streetAddress: activity.address }),
      },
    },
  };

  // Schema adicional para LocalBusiness
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://extraschools.es/activity/${activity.id}`,
    name: activity.company.name,
    description: activity.description,
    telephone: activity.company.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: activity.city,
      addressRegion: activity.province,
      addressCountry: 'ES',
      ...(activity.address && { streetAddress: activity.address }),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
    </>
  );
}
