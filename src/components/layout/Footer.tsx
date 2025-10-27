'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200" style={{ backgroundColor: '#effde8' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold text-primary-500 mb-4">{tCommon('appName')}</h3>
            <p className="text-sm text-gray-600">
              Conectando familias con las mejores actividades extraescolares
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Navegación</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-primary-500 transition">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-gray-600 hover:text-primary-500 transition">
                  {t('search')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-primary-500 transition">
                  {t('blog')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-primary-500 transition">
                  {t('about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm text-gray-600 hover:text-primary-500 transition">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-primary-500 transition">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary-500 transition">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-primary-500 transition">
                  Términos
                </Link>
              </li>
            </ul>
          </div>

          {/* For Companies */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Para empresas</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/auth/signup?type=company" className="text-sm text-gray-600 hover:text-primary-500 transition">
                  Registrar empresa
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-primary-500 transition">
                  Panel de empresa
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            © {currentYear} {tCommon('appName')}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
