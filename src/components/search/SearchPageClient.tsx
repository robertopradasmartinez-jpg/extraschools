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
  const [currentPage, setCurrentPage] = useState(1)
  
  // Initialize filters from URL params on mount
  const getInitialFilters = (): FilterState => {
    return {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || 'all',
      city: searchParams.get('city') || 'all',
      ageMin: searchParams.get('ageMin') || '',
      ageMax: searchParams.get('ageMax') || '',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || ''
    }
  }

  const [filters, setFilters] = useState<FilterState>(getInitialFilters())
  
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

  const handleActivitiesUpdate = (newActivities: any[]) => {
    setActivities(newActivities)
  }

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <SearchFilters onFilterChange={handleFilterChange} initialFilters={filters} />

      {/* Map Section - Always Visible */}
      <SearchMapSection activities={activities} />

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
