'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-blue-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-black bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-4">
              {tCommon('appName')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm leading-relaxed">
              La plataforma líder para encontrar y comparar actividades extraescolares. 
              Conectamos familias con las mejores empresas de tu ciudad.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              <a href="#" className="p-2.5 bg-white hover:bg-primary-500 text-gray-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 bg-white hover:bg-primary-500 text-gray-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 bg-white hover:bg-secondary-500 text-gray-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2.5 bg-white hover:bg-primary-500 text-gray-600 hover:text-white rounded-xl transition-all shadow-sm hover:shadow-md">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wide">Explorar</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-600 hover:text-primary-500 transition font-medium">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-gray-600 hover:text-primary-500 transition font-medium">
                  {t('search')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-gray-600 hover:text-primary-500 transition font-medium">
                  {t('blog')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-primary-500 transition font-medium">
                  {t('about')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wide">Soporte</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-sm text-gray-600 hover:text-primary-500 transition font-medium">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-primary-500 transition font-medium">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary-500 transition font-medium">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-primary-500 transition font-medium">
                  Términos
                </Link>
              </li>
            </ul>
          </div>

          {/* For Companies */}
          <div>
            <h4 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wide">Para empresas</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/auth/signup?type=company" className="text-sm text-gray-600 hover:text-primary-500 transition font-medium">
                  Registrar empresa
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-primary-500 transition font-medium">
                  Panel de empresa
                </Link>
              </li>
              <li>
                <a href="mailto:empresas@extraschools.com" className="text-sm text-gray-600 hover:text-primary-500 transition font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contacto
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 font-medium">
              © {currentYear} {tCommon('appName')}. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/privacy" className="hover:text-primary-500 transition font-medium">
                Política de privacidad
              </Link>
              <Link href="/terms" className="hover:text-primary-500 transition font-medium">
                Términos y condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
