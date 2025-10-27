import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SPANISH_CITIES, ACTIVITY_CATEGORIES } from '@/lib/constants';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Obtener parámetros de búsqueda
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const ageMin = searchParams.get('ageMin');
    const ageMax = searchParams.get('ageMax');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const search = searchParams.get('search');
    
    // Parámetros de paginación
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Construir filtros dinámicamente
    const where: any = {
      published: true,
    };

    // Filtro por categoría
    if (category && category !== 'all') {
      where.category = category;
    }

    // Filtro por ciudad
    if (city && city !== 'all') {
      where.city = city;
    }

    // Filtro por edad (actividades que incluyan el rango especificado)
    if (ageMin) {
      where.ageMax = {
        gte: parseInt(ageMin),
      };
    }
    if (ageMax) {
      where.ageMin = {
        lte: parseInt(ageMax),
      };
    }

    // Filtro por precio
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) {
        where.price.gte = parseFloat(priceMin);
      }
      if (priceMax) {
        where.price.lte = parseFloat(priceMax);
      }
    }

    // Búsqueda por texto (título o descripción)
    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Contar total de actividades (para paginación)
    const totalCount = await prisma.activity.count({ where });

    // Ejecutar query con paginación
    const activities = await prisma.activity.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Calcular rating promedio para cada actividad
    const activitiesWithRating = activities.map(activity => {
      const avgRating = activity.reviews.length > 0
        ? activity.reviews.reduce((acc, r) => acc + r.rating, 0) / activity.reviews.length
        : 0;

      return {
        ...activity,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: activity.reviews.length,
      };
    });

    return NextResponse.json({
      activities: activitiesWithRating,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    console.error('Error al buscar actividades:', error);
    return NextResponse.json(
      { error: 'Error al buscar actividades' },
      { status: 500 }
    );
  }
}

// POST para obtener opciones de filtros (ciudades únicas, categorías)
export async function POST(request: Request) {
  try {
    // Devolver listas completas predefinidas en lugar de consultar la base de datos
    return NextResponse.json({
      cities: SPANISH_CITIES,
      categories: ACTIVITY_CATEGORIES,
    });
  } catch (error) {
    console.error('Error al obtener opciones de filtro:', error);
    return NextResponse.json(
      { error: 'Error al obtener opciones' },
      { status: 500 }
    );
  }
}
