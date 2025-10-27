import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' }
  })

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-600">
            Consejos, noticias y recursos sobre actividades extraescolares
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition group"
            >
              {post.coverImage && (
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
              )}
              <div className="p-6">
                {post.publishedAt && (
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDate(post.publishedAt)}
                  </p>
                )}
                <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-500 transition">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-600 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <span className="inline-block mt-4 text-primary-500 font-medium group-hover:underline">
                  Leer más →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay artículos publicados todavía
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
