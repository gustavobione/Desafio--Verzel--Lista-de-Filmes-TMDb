// Arquivo: Frontend/src/components/AppPagination.tsx

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"

interface AppPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function AppPagination({ currentPage, totalPages, onPageChange }: AppPaginationProps) {
  // Lógica simples para mostrar 5 páginas (ex: 1 ... 5, 6, 7 ... 20)
  const getPagesToShow = () => {
    const pages = []
    const range = 2 // 2 páginas antes e 2 depois da atual
    
    // Adiciona a primeira página
    if (currentPage > range + 1) {
      pages.push(1)
      if (currentPage > range + 2) {
        pages.push(-1) // Ellipsis
      }
    }

    for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
      pages.push(i)
    }

    // Adiciona a última página
    if (currentPage < totalPages - range) {
      if (currentPage < totalPages - range - 1) {
        pages.push(-1) // Ellipsis
      }
      pages.push(totalPages)
    }
    return pages
  }
  
  const pagesToShow = getPagesToShow()

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage > 1) onPageChange(currentPage - 1)
            }}
          />
        </PaginationItem>
        
        {pagesToShow.map((page, idx) => (
          <PaginationItem key={idx}>
            {page === -1 ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(page)
                }}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (currentPage < totalPages) onPageChange(currentPage + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}