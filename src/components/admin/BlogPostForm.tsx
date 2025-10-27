'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Eye, EyeOff } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
}

interface Props {
  postId?: string;
}

export default function BlogPostForm({ postId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    coverImage: '',
    published: false,
  });

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog?includeUnpublished=true');
      const data = await response.json();
      const post = data.posts.find((p: any) => p.id === postId);
      if (post) {
        setFormData({
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt || '',
          coverImage: post.coverImage || '',
          published: post.published,
        });
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Error al cargar el post');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: postId ? formData.slug : generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug || !formData.content) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setSaving(true);
      const url = '/api/blog';
      const method = postId ? 'PATCH' : 'POST';
      const body = postId
        ? { ...formData, id: postId }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/blog');
        router.refresh();
      } else {
        alert(data.error || 'Error al guardar el post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error al guardar el post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {postId ? 'Editar Artículo' : 'Nuevo Artículo'}
            </h1>
            <p className="text-gray-600 mt-1">
              {postId ? 'Modifica el contenido del artículo' : 'Crea un nuevo artículo para el blog'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Título del artículo"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Slug * <span className="text-gray-500 font-normal">(URL del artículo)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">/blog/</span>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="url-del-articulo"
                pattern="[a-z0-9-]+"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Solo letras minúsculas, números y guiones
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Resumen
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Breve descripción del artículo"
            />
            <p className="text-xs text-gray-500 mt-1">
              Aparece en las tarjetas de vista previa
            </p>
          </div>

          {/* Imagen de portada */}
          <ImageUploader
            label="Imagen de Portada"
            value={formData.coverImage}
            onChange={(url) => setFormData({ ...formData, coverImage: url })}
            maxSizeMB={2}
          />

          {/* Contenido */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Contenido *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={20}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              placeholder="Escribe el contenido del artículo aquí..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Puedes usar HTML básico para formatear el texto
            </p>
          </div>

          {/* Estado de publicación */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, published: !formData.published })}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
                formData.published
                  ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                  : 'border-gray-300 bg-white text-gray-700'
              }`}
            >
              {formData.published ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">Publicado</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span className="font-medium">Borrador</span>
                </>
              )}
            </button>
            <span className="text-sm text-gray-500">
              {formData.published
                ? 'El artículo será visible públicamente'
                : 'El artículo solo será visible para administradores'}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/blog"
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {postId ? 'Actualizar' : 'Crear'} Artículo
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
