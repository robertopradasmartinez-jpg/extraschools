import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const body = await request.json()
    
    const { activityId, referrer } = body
    
    if (!activityId) {
      return NextResponse.json(
        { error: 'Activity ID is required' },
        { status: 400 }
      )
    }

    // Verificar que la actividad existe y obtener información de la empresa
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        company: {
          select: {
            userId: true
          }
        }
      }
    })

    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      )
    }

    // No registrar visualizaciones si el usuario es el dueño de la empresa que creó la actividad
    if (session?.user?.id && activity.company.userId === session.user.id) {
      return NextResponse.json({ 
        success: true,
        message: 'View not recorded - own activity'
      })
    }

    // Obtener información del request
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Registrar la visualización en la base de datos
    try {
      await prisma.$executeRaw`
        INSERT INTO clicks (id, "activityId", "userId", "ipAddress", "userAgent", referrer, "createdAt")
        VALUES (gen_random_uuid(), ${activityId}, ${session?.user?.id || null}, ${ipAddress}, ${userAgent}, ${referrer || null}, NOW())
      `
      
      return NextResponse.json({ 
        success: true 
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to record view' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error recording view:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}