'use client'

import React, { useEffect, useRef, useState } from 'react'
import { LayoutGrid, Rows3 } from 'lucide-react'

import { Pagination } from '@/components/Pagination'
import { ProductLeadCard, type ProductLeadCardData } from '@/components/ProductLeadCard'
import { cn } from '@/utilities/ui'

type Props = {
  basePath: string
  categoryPath: string
  page?: number
  products: ProductLeadCardData[]
  totalDocs: number
  totalPages: number
}

type ViewMode = 'grid' | 'list'

const ProductCategoryResults: React.FC<Props> = ({
  basePath,
  categoryPath,
  page,
  products,
  totalDocs,
  totalPages,
}) => {
  const [isDesktop, setIsDesktop] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [visibleProducts, setVisibleProducts] = useState(products)
  const [currentPage, setCurrentPage] = useState(page || 1)
  const [mobileTotalPages, setMobileTotalPages] = useState(totalPages)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null)
  const totalLabel = `${new Intl.NumberFormat().format(totalDocs)} ${totalDocs === 1 ? 'Item' : 'Items'}`

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(min-width: 768px)')

    const syncLayout = () => {
      const nextIsDesktop = mediaQuery.matches
      setIsDesktop(nextIsDesktop)

      if (!nextIsDesktop) {
        setViewMode('list')
      } else {
        setViewMode((currentValue) => (currentValue === 'grid' ? 'grid' : 'list'))
      }
    }

    syncLayout()

    mediaQuery.addEventListener('change', syncLayout)

    return () => {
      mediaQuery.removeEventListener('change', syncLayout)
    }
  }, [])

  useEffect(() => {
    setVisibleProducts(products)
    setCurrentPage(page || 1)
    setMobileTotalPages(totalPages)
  }, [page, products, totalPages])

  useEffect(() => {
    if (isDesktop || currentPage >= mobileTotalPages) return

    const target = loadMoreTriggerRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (!entry?.isIntersecting || isLoadingMore) return

        void (async () => {
          setIsLoadingMore(true)

          try {
            const response = await fetch(
              `/api/product-category-products?path=${encodeURIComponent(categoryPath)}&page=${currentPage + 1}`,
              { cache: 'no-store' },
            )

            if (!response.ok) return

            const nextPage = (await response.json()) as {
              docs: ProductLeadCardData[]
              page: number
              totalPages: number
            }

            setVisibleProducts((currentValue) => [...currentValue, ...nextPage.docs])
            setCurrentPage(nextPage.page)
            setMobileTotalPages(nextPage.totalPages)
          } finally {
            setIsLoadingMore(false)
          }
        })()
      },
      {
        rootMargin: '240px 0px',
      },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [categoryPath, currentPage, isDesktop, isLoadingMore, mobileTotalPages])

  return (
    <div className="min-w-0">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="hidden text-base text-[#39483f] md:block md:text-sm">{totalLabel}</div>

        <div className="hidden items-center gap-2 md:inline-flex">
          <ViewToggleButton
            active={viewMode === 'grid'}
            ariaLabel="Grid view"
            icon={<LayoutGrid className="size-4" />}
            onClick={() => setViewMode('grid')}
          />
          <ViewToggleButton
            active={viewMode === 'list'}
            ariaLabel="List view"
            icon={<Rows3 className="size-4" />}
            onClick={() => setViewMode('list')}
          />
        </div>
      </div>

      <div
        className={cn(
          viewMode === 'grid' ? 'grid gap-7 sm:grid-cols-2 xl:grid-cols-3' : 'grid gap-6',
        )}
      >
        {visibleProducts.map((product) => (
          <ProductLeadCard key={product.id} layout={viewMode} product={product} />
        ))}
      </div>

      <div>
        {!isDesktop && currentPage < mobileTotalPages ? (
          <div aria-hidden="true" className="h-10" ref={loadMoreTriggerRef} />
        ) : null}

        {!isDesktop && isLoadingMore ? (
          <div className="pt-2 text-sm text-[#66756b]">Loading more products...</div>
        ) : null}

        {isDesktop && page && totalPages > 1 ? (
          <Pagination basePath={basePath} page={page} totalPages={totalPages} />
        ) : null}
      </div>
    </div>
  )
}

const ViewToggleButton: React.FC<{
  active?: boolean
  ariaLabel: string
  icon: React.ReactNode
  onClick: () => void
}> = ({ active, ariaLabel, icon, onClick }) => {
  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={active}
      className={cn(
        'relative inline-flex size-10 items-center justify-center bg-transparent transition-colors duration-200',
        'after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-5 after:-translate-x-1/2 after:rounded-full after:bg-transparent after:transition-colors',
        active ? 'text-[#0d57a1] after:bg-[#0d57a1]' : 'text-[#7a8da8] hover:text-[#0d57a1]',
      )}
      onClick={onClick}
      type="button"
    >
      {icon}
    </button>
  )
}

export default ProductCategoryResults
