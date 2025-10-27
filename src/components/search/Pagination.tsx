'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5 // Número de páginas a mostrar

    if (totalPages <= showPages) {
      // Mostrar todas las páginas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Lógica para mostrar páginas con ellipsis
      if (currentPage <= 3) {
        // Inicio: 1 2 3 4 ... 10
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Final: 1 ... 7 8 9 10
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Medio: 1 ... 4 5 6 ... 10
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition ${
          currentPage === 1
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition ${
                  currentPage === page
                    ? 'bg-primary-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium transition ${
          currentPage === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
