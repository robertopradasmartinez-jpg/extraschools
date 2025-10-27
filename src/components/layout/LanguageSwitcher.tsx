'use client'

import { useState, useEffect, useRef } from 'react'
import { Globe } from 'lucide-react'
import { useLocale } from 'next-intl'

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' }
]

export default function LanguageSwitcher() {
  const currentLocale = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const changeLanguage = (newLocale: string) => {
    // Save locale in cookie (expires in 1 year)
    const maxAge = 365 * 24 * 60 * 60
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${maxAge}`
    
    setIsOpen(false)
    
    // Force full page reload to apply new locale
    window.location.reload()
  }

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Cambiar idioma"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLanguage.flag}</span>
        <span className="hidden md:inline">{currentLanguage.code.toUpperCase()}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                currentLocale === language.code
                  ? 'bg-secondary-50 text-primary-600 font-medium'
                  : 'text-gray-700'
              }`}
            >
              <span className="text-xl">{language.flag}</span>
              <span>{language.name}</span>
              {currentLocale === language.code && (
                <span className="ml-auto text-primary-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
