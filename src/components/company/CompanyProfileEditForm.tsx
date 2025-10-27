'use client';

import { useState } from 'react';
import { Save, AlertCircle, CheckCircle2, Upload, X } from 'lucide-react';

interface CompanyData {
  id: string;
  name: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  logo: string | null;
  whatsappEnabled: boolean;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
  };
}

interface CompanyProfileEditFormProps {
  company: CompanyData;
  onCompanyUpdate: (company: CompanyData) => void;
}

export default function CompanyProfileEditForm({ company, onCompanyUpdate }: CompanyProfileEditFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: company.name || '',
    description: company.description || '',
    phone: company.phone || '',
    website: company.website || '',
    logo: company.logo || '',
    whatsappEnabled: company.whatsappEnabled || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear messages on input change
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/company/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al actualizar el perfil');
      }

      setSuccess('Perfil de empresa actualizado correctamente');
      onCompanyUpdate(data.company);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          Editar Perfil de Empresa
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Actualiza la información de tu empresa para que los usuarios puedan conocerte mejor
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la empresa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nombre de tu empresa"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+34 600 000 000"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: +34 600 000 000
            </p>
          </div>

          {/* WhatsApp Enabled */}
          <div className="flex items-center">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="whatsappEnabled"
                checked={formData.whatsappEnabled}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsappEnabled: e.target.checked }))}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Habilitar contacto por WhatsApp
                </span>
                <p className="text-xs text-gray-500">
                  Permite que los usuarios te contacten directamente por WhatsApp
                </p>
              </div>
            </label>
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
              Sitio web
            </label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.tuempresa.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Debe incluir https:// o http://
            </p>
          </div>

          {/* Logo URL */}
          <div className="md:col-span-2">
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
              URL del logo
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://ejemplo.com/logo.png"
              />
              {formData.logo && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, logo: '' }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600"
                  title="Eliminar logo"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              URL de la imagen del logo de tu empresa (recomendado: 200x200px)
            </p>
            {formData.logo && (
              <div className="mt-2">
                <img
                  src={formData.logo}
                  alt="Preview"
                  className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción de la empresa
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe tu empresa, los servicios que ofreces, tu experiencia, etc."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length} caracteres
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
