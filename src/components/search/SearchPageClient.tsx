'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import SearchFilters, { FilterState } from '@/components/search/SearchFilters'
import SearchResults from '@/components/search/SearchResults'
import SearchMapSection from '@/components/maps/SearchMapSection'

const initialFilters: FilterState = {
  search: '',
  category: 'all',
  city: 'all',
  ageMin: '',
  ageMax: '',
  priceMin: '',
  priceMax: ''
}

export default function SearchPageClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [activities, setActivities] = useState<any[]>([])
  const [allActivities, setAllActivities] = useState<any[]>([]) // Para el mapa (todas las actividades)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Initialize filters from URL params on mount
  const getInitialFilters = (): FilterState => {
    return {
      search: searchParams.get('search') || searchParams.get('q') || '',
      category: searchParams.get('category') || 'all',
      city: searchParams.get('city') || 'all',
      ageMin: searchParams.get('ageMin') || '',
      ageMax: searchParams.get('ageMax') || '',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || ''
    }
  }

  const [filters, setFilters] = useState<FilterState>(getInitialFilters())
  
  // Cargar todas las actividades para el mapa cuando cambien los filtros
  useEffect(() => {
    fetchAllActivitiesForMap()
  }, [filters])
  
  const fetchAllActivitiesForMap = async () => {
    try {
      const params = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '') {
          params.set(key, value)
        }
      })
      
      // Solicitar todas las actividades sin paginación (límite alto)
      params.set('limit', '1000')
      params.set('page', '1')
      
      const response = await fetch(`/api/activities?${params.toString()}`)
      const data = await response.json()
      
      if (response.ok) {
        setAllActivities(data.activities || [])
      }
    } catch (err) {
      console.error('Error al cargar actividades para el mapa:', err)
    }
  }
  
  // Initialize page from URL
  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1')
    setCurrentPage(page)
  }, [searchParams])

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to page 1 when filters change
    
    // Update URL params
    const params = new URLSearchParams()
    
    // Only add non-empty and non-default values to URL
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value)
      }
    })
    
    // Add page param
    params.set('page', '1')
    
    // Update URL without page reload
    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    router.push(newUrl, { scroll: false })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    
    // Update URL with new page
    const params = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all' && value !== '') {
        params.set(key, value)
      }
    })
    
    params.set('page', page.toString())
    
    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    router.push(newUrl, { scroll: false })
  }

  const handleActivitiesUpdate = (newActivities: any[], total?: number) => {
    setActivities(newActivities)
    if (total !== undefined) setTotalCount(total)
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <SearchFilters onFilterChange={handleFilterChange} initialFilters={filters} />

      {/* Map Section - Always Visible */}
      <SearchMapSection activities={allActivities} totalCount={totalCount} />

      {/* Results Section */}
      <SearchResults 
        filters={filters} 
        onActivitiesUpdate={handleActivitiesUpdate}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
