'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Menu, X, User, Heart, MessageSquare, LayoutDashboard } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { data: session } = useSession()
  const t = useTranslations('nav')
  const tCommon = useTranslations('common')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Obtener contador de mensajes no leídos
  useEffect(() => {
    if (session?.user) {
      fetchUnreadCount()
      // Actualizar cada 30 segundos
      const interval = setInterval(fetchUnreadCount, 30000)
      return () => clearInterval(interval)
    }
  }, [session])

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/messages?type=count')
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error al obtener contador de mensajes:', error)
    }
  }

  // Determinar la ruta de mensajes según el rol
  const messagesLink = session?.user.role === 'COMPANY' ? '/company/messages' : '/messages'

  // Manejar el hover del menú de perfil con delay de 2 segundos
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setShowProfileMenu(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowProfileMenu(false)
    }, 1000) // 1 segundo de delay
  }

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center py-2">
            <Image 
              src="/extraschools-logo.png" 
              alt="ExtraSchools" 
              width={300} 
              height={120}
              priority
              className="h-20 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/search" className="text-sm font-medium text-gray-700 hover:text-primary-500 transition">
              {t('search')}
            </Link>
            <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-primary-500 transition">
              {t('blog')}
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-primary-500 transition">
              {t('about')}
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {session ? (
              <>
                <Link 
                  href="/favorites" 
                  className="hidden md:block relative p-2 text-gray-700 hover:text-primary-500 hover:bg-secondary-50 rounded-lg transition"
                  title="Favoritos"
                >
                  <Heart className="w-5 h-5" />
                </Link>
                <Link 
                  href={messagesLink} 
                  className="hidden md:block relative p-2 text-gray-700 hover:text-primary-500 hover:bg-secondary-50 rounded-lg transition"
                  title="Mensajes"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                {(session.user.role === 'COMPANY' || session.user.role === 'ADMIN') && (
                  <Link 
                    href="/dashboard" 
                    className="hidden md:block relative p-2 text-gray-700 hover:text-primary-500 hover:bg-secondary-50 rounded-lg transition"
                    title="Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}
                <div 
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center space-x-2 rounded-full border border-gray-300 px-3 py-2 hover:shadow-md transition">
                    <User className="w-5 h-5" />
                    <span className="text-sm hidden md:block">{session.user.name}</span>
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {t('profile')}
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {tCommon('logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-gray-700 hover:text-primary-500 transition"
                >
                  {tCommon('login')}
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-full bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition"
                >
                  {tCommon('register')}
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200">
            <Link href="/search" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              {t('search')}
            </Link>
            <Link href="/blog" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              {t('blog')}
            </Link>
            <Link href="/about" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
              {t('about')}
            </Link>
            {session && (
              <>
                <Link href="/favorites" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                  {t('favorites')}
                </Link>
                <Link href={messagesLink} className="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                  <span>{t('messages')}</span>
                  {unreadCount > 0 && (
                    <span className="bg-primary-500 text-white text-xs font-bold rounded-full h-5 px-2 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                {(session.user.role === 'COMPANY' || session.user.role === 'ADMIN') && (
                  <Link href="/dashboard" className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">
                    {t('dashboard')}
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
