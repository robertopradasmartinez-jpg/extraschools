import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Crear reseña
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Solo padres pueden dejar reseñas
    if (session.user.role !== 'PARENT') {
      return NextResponse.json(
        { error: 'Solo los padres pueden dejar reseñas' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { activityId, rating, comment } = body;

    if (!activityId || !rating) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar rating (1-5)
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'El rating debe estar entre 1 y 5' },
        { status: 400 }
      );
    }

    // Verificar que la actividad existe
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      return NextResponse.json(
        { error: 'Actividad no encontrada' },
        { status: 404 }
      );
    }

    // Verificar si ya existe una reseña del usuario para esta actividad
    const existingReview = await prisma.review.findUnique({
      where: {
        userId_activityId: {
          userId: session.user.id,
          activityId: activityId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'Ya has dejado una reseña para esta actividad' },
        { status: 400 }
      );
    }

    // Crear la reseña
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        activityId: activityId,
        rating: rating,
        comment: comment || null,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      review: review,
    });
  } catch (error) {
    console.error('Error al crear reseña:', error);
    return NextResponse.json(
      { error: 'Error al crear la reseña' },
      { status: 500 }
    );
  }
}

// GET - Obtener reseñas de una actividad
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get('activityId');

    if (!activityId) {
      return NextResponse.json(
        { error: 'ID de actividad requerido' },
        { status: 400 }
      );
    }

    // Obtener reseñas
    const reviews = await prisma.review.findMany({
      where: {
        activityId: activityId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calcular estadísticas
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    return NextResponse.json({
      reviews: reviews,
      stats: {
        total: totalReviews,
        average: Math.round(averageRating * 10) / 10, // Redondear a 1 decimal
      },
    });
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    return NextResponse.json(
      { error: 'Error al obtener las reseñas' },
      { status: 500 }
    );
  }
}
