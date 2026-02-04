'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface SearchFiltersProps {
  onFilterChange: (filters: FilterState) => void
  initialFilters?: FilterState
}

export interface FilterState {
  category: string
  city: string
  ageMin: string
  ageMax: string
  priceMin: string
  priceMax: string
  search: string
}

export default function SearchFilters({ onFilterChange, initialFilters }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {
    category: 'all',
    city: 'all',
    ageMin: '',
    ageMax: '',
    priceMin: '',
    priceMax: '',
    search: '',
  })

  const [cities, setCities] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(true)

  // Update filters when initialFilters change (from URL)
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters)
    }
  }, [initialFilters])

  // Cargar opciones de filtros
  useEffect(() => {
    fetchFilterOptions()
  }, [])

  // Notificar cambios de filtros (con debounce para search)
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange(filters)
    }, filters.search ? 500 : 0) // Debounce de 500ms solo para búsqueda de texto

    return () => clearTimeout(timer)
  }, [filters])

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
      })
      const data = await response.json()
      setCities(data.cities || [])
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error al cargar opciones de filtro:', error)
    }
  }

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      category: 'all',
      city: 'all',
      ageMin: '',
      ageMax: '',
      priceMin: '',
      priceMax: '',
      search: '',
    }
    setFilters(emptyFilters)
  }

  const hasActiveFilters = 
    filters.category !== 'all' ||
    filters.city !== 'all' ||
    filters.ageMin ||
    filters.ageMax ||
    filters.priceMin ||
    filters.priceMax ||
    filters.search

  return (
    <div className="card border-2 border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl">
            <SlidersHorizontal className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-black text-gray-900">Filtros</h2>
          {hasActiveFilters && (
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              Activos
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-secondary-500 hover:text-secondary-600 font-bold hover:underline"
            >
              Limpiar todo
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden p-2.5 hover:bg-blue-50 rounded-xl transition"
          >
            {showFilters ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Filters Content */}
      <div className={`p-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-500" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Título o descripción..."
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none font-medium transition"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Categoría
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none font-medium transition"
            >
              <option value="all">Todas</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Ciudad
            </label>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none font-medium transition"
            >
              <option value="all">Todas</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Edad mínima
            </label>
            <input
              type="number"
              value={filters.ageMin}
              onChange={(e) => handleFilterChange('ageMin', e.target.value)}
              placeholder="Ej: 6"
              min="3"
              max="18"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none font-medium transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Edad máxima
            </label>
            <input
              type="number"
              value={filters.ageMax}
              onChange={(e) => handleFilterChange('ageMax', e.target.value)}
              placeholder="Ej: 12"
              min="3"
              max="18"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none font-medium transition"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Precio mínimo (€/mes)
            </label>
            <input
              type="number"
              value={filters.priceMin}
              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              placeholder="Ej: 30"
              min="0"
              step="5"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none font-medium transition"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Precio máximo (€/mes)
            </label>
            <input
              type="number"
              value={filters.priceMax}
              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              placeholder="Ej: 100"
              min="0"
              step="5"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none font-medium transition"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
