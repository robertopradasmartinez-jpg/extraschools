import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, ArrowLeft } from 'lucide-react'

interface Props {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug }
  })

  if (!post) {
    return {
      title: 'Artículo no encontrado'
    }
  }

  return {
    title: `${post.title} - Blog ExtraSchools`,
    description: post.excerpt || post.title
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { 
      slug: params.slug,
    }
  })

  if (!post || !post.published) {
    notFound()
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero con imagen de portada */}
      {post.coverImage && (
        <div className="relative h-[400px] bg-black">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>
      )}

      {/* Contenido */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al blog
        </Link>

        {/* Header */}
        <article>
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-4">
                {post.excerpt}
              </p>
            )}

            {post.publishedAt && (
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishedAt.toISOString()}>
                  {formatDate(post.publishedAt)}
                </time>
              </div>
            )}
          </header>

          {/* Contenido del artículo */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="whitespace-pre-line text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </article>

        {/* Separador */}
        <div className="border-t border-gray-200 my-12" />

        {/* CTA */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Buscas actividades extraescolares?
          </h3>
          <p className="text-gray-600 mb-6">
            Descubre cientos de actividades verificadas en tu ciudad
          </p>
          <Link
            href="/search"
            className="inline-block px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition font-medium"
          >
            Explorar Actividades
          </Link>
        </div>
      </div>
    </div>
  )
}
