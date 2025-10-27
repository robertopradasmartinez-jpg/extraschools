'use client';

import { useState } from 'react';
import { Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function PasswordChangeForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear messages on input change
    setError('');
    setSuccess('');
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    if (formData.newPassword.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al cambiar la contraseña');
      }

      setSuccess('Contraseña actualizada correctamente');
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
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
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Cambiar Contraseña
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña actual
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Nueva contraseña
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Mínimo 6 caracteres
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirmar nueva contraseña
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
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
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Actualizando...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Actualizar Contraseña</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
