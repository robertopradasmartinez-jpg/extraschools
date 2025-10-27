'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Calendar } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminBlogClient() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog?includeUnpublished=true');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) {
      return;
    }

    try {
      setDeleting(id);
      const response = await fetch(`/api/blog?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter(p => p.id !== id));
      } else {
        alert('Error al eliminar el post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error al eliminar el post');
    } finally {
      setDeleting(null);
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const response = await fetch('/api/blog', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: post.id,
          published: !post.published,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(posts.map(p => p.id === post.id ? data.post : p));
      } else {
        alert('Error al actualizar el post');
      }
    } catch (error) {
      console.error('Error toggling published:', error);
      alert('Error al actualizar el post');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600 mt-1">
            Gestiona los artículos del blog
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
        >
          <Plus className="w-4 h-4" />
          Nuevo Artículo
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-3xl font-bold text-gray-900">
            {posts.length}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Total de artículos
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-3xl font-bold text-secondary-600">
            {posts.filter(p => p.published).length}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Publicados
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="text-3xl font-bold text-gray-400">
            {posts.filter(p => !p.published).length}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Borradores
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No hay artículos todavía</p>
            <Link
              href="/admin/blog/new"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Crear el primer artículo →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {post.title}
                        </div>
                        {post.excerpt && (
                          <div className="text-sm text-gray-500 line-clamp-1 mt-1">
                            {post.excerpt}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 mt-1">
                          /blog/{post.slug}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublished(post)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          post.published
                            ? 'bg-secondary-100 text-secondary-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {post.published ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Publicado
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Borrador
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString('es-ES')
                          : new Date(post.createdAt).toLocaleDateString('es-ES')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                          title="Ver artículo"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          disabled={deleting === post.id}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="Eliminar"
                        >
                          {deleting === post.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
