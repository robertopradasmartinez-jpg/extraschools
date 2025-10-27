'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';

export default function SignUpPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'PARENT' as 'PARENT' | 'COMPANY',
    companyName: '',
    companyPhone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }

    if (formData.role === 'COMPANY' && !formData.companyName) {
      setError(t('companyNameRequired'));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          companyName: formData.role === 'COMPANY' ? formData.companyName : undefined,
          companyPhone: formData.role === 'COMPANY' ? formData.companyPhone : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('errorOccurred'));
        return;
      }

      // Auto login después de registro
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // Si falla el login, redirigir a signin
        router.push('/auth/signin');
      } else {
        // Redirigir según el rol
        if (formData.role === 'COMPANY') {
          router.push('/company/dashboard');
        } else {
          router.push('/');
        }
        router.refresh();
      }
    } catch (error) {
      setError(t('errorOccurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Header */}
        <div>
          <Link href="/" className="flex justify-center">
            <h1 className="text-3xl font-bold text-primary-500">ExtraSchools</h1>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('signUpTitle')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('hasAccount')}{' '}
            <Link
              href="/auth/signin"
              className="font-medium text-primary-500 hover:text-primary-600"
            >
              {t('signInLink')}
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('roleLabel')}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'PARENT' })}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  formData.role === 'PARENT'
                    ? 'border-primary-500 bg-secondary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">{t('parentRole')}</div>
                <div className="text-xs text-gray-600 mt-1">{t('parentRoleDesc')}</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'COMPANY' })}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  formData.role === 'COMPANY'
                    ? 'border-primary-500 bg-secondary-50 text-primary-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">{t('companyRole')}</div>
                <div className="text-xs text-gray-600 mt-1">{t('companyRoleDesc')}</div>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t('nameLabel')}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t('namePlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('emailLabel')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t('emailPlaceholder')}
              />
            </div>

            {/* Campos adicionales para empresas */}
            {formData.role === 'COMPANY' && (
              <>
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('companyNameLabel')}
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('companyNamePlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('companyPhoneLabel')}
                  </label>
                  <input
                    id="companyPhone"
                    name="companyPhone"
                    type="tel"
                    value={formData.companyPhone}
                    onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder={t('companyPhonePlaceholder')}
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('passwordLabel')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t('passwordPlaceholder')}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t('confirmPasswordLabel')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={t('confirmPasswordPlaceholder')}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? t('signingUp') : t('signUpButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
