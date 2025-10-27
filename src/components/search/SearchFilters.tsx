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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          {hasActiveFilters && (
            <span className="bg-secondary-100 text-primary-600 text-xs font-medium px-2 py-1 rounded-full">
              Activos
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Limpiar todo
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Título o descripción..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ciudad
            </label>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todas</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Edad mínima
            </label>
            <input
              type="number"
              value={filters.ageMin}
              onChange={(e) => handleFilterChange('ageMin', e.target.value)}
              placeholder="Ej: 6"
              min="3"
              max="18"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Edad máxima
            </label>
            <input
              type="number"
              value={filters.ageMax}
              onChange={(e) => handleFilterChange('ageMax', e.target.value)}
              placeholder="Ej: 12"
              min="3"
              max="18"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio mínimo (€/mes)
            </label>
            <input
              type="number"
              value={filters.priceMin}
              onChange={(e) => handleFilterChange('priceMin', e.target.value)}
              placeholder="Ej: 30"
              min="0"
              step="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio máximo (€/mes)
            </label>
            <input
              type="number"
              value={filters.priceMax}
              onChange={(e) => handleFilterChange('priceMax', e.target.value)}
              placeholder="Ej: 100"
              min="0"
              step="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
