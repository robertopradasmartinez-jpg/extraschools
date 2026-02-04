'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSession, signOut } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Menu, X, User, Heart, MessageSquare, LayoutDashboard } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center py-2 hover:opacity-80 transition">
            <Image 
              src="/extraschools-logo.png" 
              alt="ExtraSchools" 
              width={240} 
              height={96}
              priority
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <Link href="/search" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary-500 hover:bg-blue-50 rounded-lg transition">
              {t('search')}
            </Link>
            <Link href="/blog" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary-500 hover:bg-blue-50 rounded-lg transition">
              {t('blog')}
            </Link>
            <Link href="/about" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-primary-500 hover:bg-blue-50 rounded-lg transition">
              {t('about')}
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {session ? (
              <>
                <Link 
                  href="/favorites" 
                  className="hidden md:flex relative p-2.5 text-gray-700 hover:text-secondary-500 hover:bg-pink-50 rounded-xl transition-all"
                  title="Favoritos"
                >
                  <Heart className="w-5 h-5" />
                </Link>
                <Link 
                  href={messagesLink} 
                  className="hidden md:flex relative p-2.5 text-gray-700 hover:text-primary-500 hover:bg-blue-50 rounded-xl transition-all"
                  title="Mensajes"
                >
                  <MessageSquare className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-gradient-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                {(session.user.role === 'COMPANY' || session.user.role === 'ADMIN') && (
                  <Link 
                    href="/dashboard" 
                    className="hidden md:flex relative p-2.5 text-gray-700 hover:text-primary-500 hover:bg-blue-50 rounded-xl transition-all"
                    title="Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}
                <div 
                  className="relative ml-2"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center space-x-2 rounded-full border-2 border-gray-200 px-4 py-2 hover:border-primary-500 hover:shadow-md transition-all">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-semibold hidden md:block text-gray-700">{session.user.name}</span>
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl py-2 border border-gray-100">
                      <Link href="/profile" className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-primary-600 transition">
                        {t('profile')}
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
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
                  className="hidden md:block px-5 py-2.5 text-sm font-bold text-gray-700 hover:text-primary-500 hover:bg-blue-50 rounded-xl transition-all"
                >
                  {tCommon('login')}
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full hover:shadow-xl transition-all transform hover:scale-105"
                >
                  {tCommon('register')}
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-1 border-t border-gray-100">
            <Link href="/search" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-primary-500 rounded-xl transition mx-2">
              {t('search')}
            </Link>
            <Link href="/blog" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-primary-500 rounded-xl transition mx-2">
              {t('blog')}
            </Link>
            <Link href="/about" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-primary-500 rounded-xl transition mx-2">
              {t('about')}
            </Link>
            {session && (
              <>
                <Link href="/favorites" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-pink-50 hover:text-secondary-500 rounded-xl transition mx-2">
                  {t('favorites')}
                </Link>
                <Link href={messagesLink} className="flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-primary-500 rounded-xl transition mx-2">
                  <span>{t('messages')}</span>
                  {unreadCount > 0 && (
                    <span className="bg-gradient-secondary text-white text-xs font-bold rounded-full h-6 px-2.5 flex items-center justify-center shadow-md">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                {(session.user.role === 'COMPANY' || session.user.role === 'ADMIN') && (
                  <Link href="/dashboard" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-primary-500 rounded-xl transition mx-2">
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
