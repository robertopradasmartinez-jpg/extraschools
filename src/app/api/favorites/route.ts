import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { activityId } = body;

    if (!activityId) {
      return NextResponse.json({ error: 'Activity ID requerido' }, { status: 400 });
    }

    // Verificar si ya existe el favorito
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_activityId: {
          userId: session.user.id,
          activityId,
        },
      },
    });

    if (existingFavorite) {
      // Eliminar favorito
      await prisma.favorite.delete({
        where: {
          userId_activityId: {
            userId: session.user.id,
            activityId,
          },
        },
      });

      return NextResponse.json({ isFavorite: false });
    } else {
      // Añadir favorito
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          activityId,
        },
      });

      return NextResponse.json({ isFavorite: true });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json(
      { error: 'Error al actualizar favoritos' },
      { status: 500 }
    );
  }
}
