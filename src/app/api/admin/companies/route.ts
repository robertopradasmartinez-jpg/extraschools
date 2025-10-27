import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all companies with filters
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              email: true,
              createdAt: true,
            },
          },
          _count: {
            select: {
              activities: true,
            },
          },
          activities: {
            where: { published: true },
            select: {
              _count: {
                select: {
                  reviews: true,
                },
              },
            },
          },
        },
      }),
      prisma.company.count({ where }),
    ]);

    // Calculate average rating for each company
    const companiesWithStats = companies.map((company) => {
      const totalReviews = company.activities.reduce(
        (sum, activity) => sum + activity._count.reviews,
        0
      );
      return {
        ...company,
        totalReviews,
      };
    });

    return NextResponse.json({
      companies: companiesWithStats,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Error al obtener empresas' },
      { status: 500 }
    );
  }
}

// DELETE - Delete company
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json({ error: 'companyId es requerido' }, { status: 400 });
    }

    // Delete company (cascade will handle activities)
    await prisma.company.delete({
      where: { id: companyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting company:', error);
    return NextResponse.json(
      { error: 'Error al eliminar empresa' },
      { status: 500 }
    );
  }
}
