import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Listar todos los posts (admin puede ver todos, público solo publicados)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    const { searchParams } = new URL(request.url)
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true'

    // Si se piden posts no publicados, verificar que sea admin
    if (includeUnpublished) {
      if (!session || session.user.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 403 }
        )
      }

      const posts = await prisma.blogPost.findMany({
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ posts })
    }

    // Posts públicos
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' }
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Error al obtener los posts' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo post (solo admin)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, slug, content, excerpt, coverImage, published } = body

    // Validaciones
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Título, slug y contenido son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el slug sea único
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'Ya existe un post con ese slug' },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        published: published || false,
        publishedAt: published ? new Date() : null
      }
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json(
      { error: 'Error al crear el post' },
      { status: 500 }
    )
  }
}

// PATCH - Actualizar post existente (solo admin)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { id, title, slug, content, excerpt, coverImage, published } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID del post es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el post existe
    const existingPost = await prisma.blogPost.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      )
    }

    // Si se cambia el slug, verificar que sea único
    if (slug && slug !== existingPost.slug) {
      const slugExists = await prisma.blogPost.findUnique({
        where: { slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Ya existe un post con ese slug' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (content !== undefined) updateData.content = content
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (published !== undefined) {
      updateData.published = published
      // Si se publica por primera vez, establecer publishedAt
      if (published && !existingPost.publishedAt) {
        updateData.publishedAt = new Date()
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el post' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar post (solo admin)
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID del post es requerido' },
        { status: 400 }
      )
    }

    await prisma.blogPost.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el post' },
      { status: 500 }
    )
  }
}
