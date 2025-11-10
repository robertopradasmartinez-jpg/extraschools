import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const activityId = searchParams.get('activityId')
    
    // Solo permitir a usuarios autenticados ver estadísticas
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Si es una empresa, verificar que tenga acceso a la actividad
    if (session.user.role === 'COMPANY') {
      const company = await prisma.company.findUnique({
        where: { userId: session.user.id },
        include: { activities: true }
      })
      
      if (!company) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        )
      }
      
      if (activityId && !company.activities.some(a => a.id === activityId)) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }

      // Obtener estadísticas de visualizaciones para las actividades de la empresa
      const activityIds = company.activities.map(a => a.id)
      
      try {
        // Visualizaciones totales
        const totalViews = await prisma.$queryRaw<[{ count: bigint }]>`
          SELECT COUNT(*) as count 
          FROM clicks 
          WHERE "activityId" = ANY(${activityIds})
        `.then(result => Number(result[0]?.count || 0))

        // Visualizaciones por actividad
        const viewsByActivity = await prisma.$queryRaw<Array<{ activityId: string; count: bigint }>>`
          SELECT "activityId", COUNT(*) as count
          FROM clicks 
          WHERE "activityId" = ANY(${activityIds})
          GROUP BY "activityId"
          ORDER BY count DESC
        `.then(result => result.map(r => ({ activityId: r.activityId, count: Number(r.count) })))

        return NextResponse.json({
          totalViews,
          viewsByActivity
        })
      } catch (dbError) {
        console.error('Database error:', dbError)
        // Si hay error con la tabla (no existe), devolver valores por defecto
        return NextResponse.json({
          totalViews: 0,
          viewsByActivity: []
        })
      }
    }

    // Solo admin puede ver estadísticas globales
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Estadísticas globales para admin
    try {
      const totalViews = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM clicks
      `.then(result => Number(result[0]?.count || 0))

      return NextResponse.json({
        totalViews
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({
        totalViews: 0
      })
    }

  } catch (error) {
    console.error('Error fetching view statistics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}