'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import Link from 'next/link';
import GoogleMapsLocationPicker from '@/components/company/GoogleMapsLocationPicker';
import ImageUploader from '@/components/admin/ImageUploader';
import { ACTIVITY_CATEGORIES, SPANISH_CITIES, PRICE_TYPES } from '@/lib/constants';

export default function NewActivityForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ACTIVITY_CATEGORIES[0],
    ageMin: 4,
    ageMax: 18,
    price: 0,
    priceType: 'mes',
    priceTypeCustom: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    latitude: 40.4168,
    longitude: -3.7038,
    images: [''],
    published: false,
  });

  const handleLocationSelect = (location: {
    address: string;
    city: string;
    province: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  }) => {
    setFormData(prev => ({
      ...prev,
      ...location,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/company/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          latitude: parseFloat(formData.latitude.toString()),
          longitude: parseFloat(formData.longitude.toString()),
          price: parseFloat(formData.price.toString()),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear la actividad');
      }

      router.push('/company/activities');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la actividad');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ''],
    }));
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/company/activities"
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Actividad</h1>
          <p className="mt-1 text-sm text-gray-600">
            Completa la información de tu actividad extraescolar
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Información Básica
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título de la actividad *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ej: Clases de Fútbol para Niños"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              required
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe la actividad, metodología, horarios, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {ACTIVITY_CATEGORIES.map((cat: string) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio (€) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de precio *
              </label>
              <select
                required
                value={formData.priceType}
                onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {PRICE_TYPES.map((pt) => (
                  <option key={pt.value} value={pt.value}>
                    {pt.value === 'otro' ? 'Otro (especificar)' : `Por ${pt.value}`}
                  </option>
                ))}
              </select>
              {formData.priceType === 'otro' && (
                <input
                  type="text"
                  required
                  value={formData.priceTypeCustom}
                  onChange={(e) => setFormData({ ...formData, priceTypeCustom: e.target.value })}
                  placeholder="Ej: trimestre, curso, sesión..."
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edad mínima *
              </label>
              <input
                type="number"
                required
                min="0"
                max="65"
                value={formData.ageMin}
                onChange={(e) => setFormData({ ...formData, ageMin: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Edad máxima *
              </label>
              <input
                type="number"
                required
                min="0"
                max="65"
                value={formData.ageMax}
                onChange={(e) => setFormData({ ...formData, ageMax: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-primary-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Ubicación
            </h2>
          </div>

          <GoogleMapsLocationPicker
            initialLocation={{
              address: formData.address,
              latitude: formData.latitude,
              longitude: formData.longitude,
            }}
            onLocationSelect={handleLocationSelect}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <select
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Selecciona una ciudad</option>
                {SPANISH_CITIES.map((city: string) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provincia *
              </label>
              <input
                type="text"
                required
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Postal *
              </label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Imágenes de la Actividad
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Sube imágenes atractivas de tu actividad. La primera será la imagen principal.
            </p>
          </div>

          {formData.images.map((image, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Imagen {index + 1} {index === 0 && '(Principal)'}
                </label>
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Eliminar
                  </button>
                )}
              </div>
              <ImageUploader
                value={image}
                onChange={(url) => updateImage(index, url)}
                maxSizeMB={2}
              />
            </div>
          ))}

          {formData.images.length < 5 && (
            <button
              type="button"
              onClick={addImageField}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-primary-500 hover:border-primary-400 hover:bg-primary-50 transition font-medium"
            >
              + Añadir otra imagen (máx. 5)
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">
                Publicar actividad
              </span>
              <p className="text-sm text-gray-600">
                Si está marcado, la actividad será visible para los padres inmediatamente
              </p>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/company/activities"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              'Guardando...'
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Crear Actividad
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
