import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidar cada hora

export async function GET() {
  try {
    const baseUrl = 'https://extraschools.es';
    const currentDate = new Date().toISOString();

    // Obtener todas las actividades publicadas
    const activities = await prisma.activity.findMany({
      where: {
        published: true,
      },
      select: {
        id: true,
        updatedAt: true,
      },
    });

    // Obtener todos los posts de blog publicados
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Páginas estáticas
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' }, // Homepage
      { url: '/search', priority: '0.9', changefreq: 'daily' },
      { url: '/blog', priority: '0.8', changefreq: 'weekly' },
      { url: '/about', priority: '0.7', changefreq: 'monthly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' },
      { url: '/terms', priority: '0.5', changefreq: 'yearly' },
      { url: '/privacy', priority: '0.5', changefreq: 'yearly' },
      { url: '/help', priority: '0.6', changefreq: 'monthly' },
    ];

    // Generar XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- Páginas estáticas -->
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join('\n')}

  <!-- Actividades -->
${activities
  .map(
    (activity) => `  <url>
    <loc>${baseUrl}/activity/${activity.id}</loc>
    <lastmod>${activity.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}

  <!-- Posts de blog -->
${blogPosts
  .map(
    (post) => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join('\n')}

</urlset>`;

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generando sitemap:', error);
    return new NextResponse('Error generando sitemap', { status: 500 });
  }
}
