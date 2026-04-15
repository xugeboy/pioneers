'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  getDirectChildProductCategories,
  getProductCategoryHref,
  getProductCategoryPath,
  getTopLevelProductCategories,
  type ProductCategorySummary,
} from '@/utilities/productCategories'
import { cn } from '@/utilities/ui'

type Props = {
  categories: ProductCategorySummary[]
  currentCategory: ProductCategorySummary
}

const ProductCategoryBrowserSidebar: React.FC<Props> = ({ categories, currentCategory }) => {
  const topLevelCategories = getTopLevelProductCategories(categories)
  const currentPath = getProductCategoryPath(currentCategory)

  const isPathActive = (path?: string | null) =>
    Boolean(path && currentPath && (currentPath === path || currentPath.startsWith(`${path}/`)))

  const activeTopLevelID = useMemo(
    () => topLevelCategories.find((category) => isPathActive(getProductCategoryPath(category)))?.id ?? null,
    [topLevelCategories, currentPath],
  )

  const [expandedParentID, setExpandedParentID] = useState<number | null>(activeTopLevelID)

  useEffect(() => {
    setExpandedParentID(activeTopLevelID)
  }, [activeTopLevelID])

  const content = (
    <div className="flex h-full flex-col">
      <nav aria-label="Product categories" className="space-y-2 overflow-y-auto">
        {topLevelCategories.map((topLevelCategory) => {
          const topLevelPath = getProductCategoryPath(topLevelCategory)
          const topLevelIsActive = isPathActive(topLevelPath)
          const childCategories = getDirectChildProductCategories(categories, topLevelCategory.id)
          const isExpanded = expandedParentID === topLevelCategory.id

          return (
            <div key={topLevelCategory.id}>
              <div className="flex items-center gap-2">
                <Link
                  className={cn(
                    'relative min-w-0 flex-1 py-2 pl-4 text-sm transition-colors duration-200',
                    'before:absolute before:left-0 before:top-1/2 before:h-4 before:w-px before:-translate-y-1/2 before:bg-transparent',
                    topLevelIsActive
                      ? 'font-semibold text-[#162019] before:bg-[#162019]'
                      : 'text-[#6a786f] hover:text-[#162019] hover:before:bg-[#b8c4ba]',
                  )}
                  href={getProductCategoryHref(topLevelCategory)}
                >
                  <span className="truncate">{topLevelCategory.title}</span>
                </Link>

                {childCategories.length > 0 ? (
                  <button
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${topLevelCategory.title}`}
                    className="inline-flex size-8 items-center justify-center text-[#7a887f] transition-colors duration-200 hover:text-[#162019]"
                    onClick={() =>
                      setExpandedParentID((current) =>
                        current === topLevelCategory.id ? null : topLevelCategory.id,
                      )
                    }
                    type="button"
                  >
                    <ChevronDown
                      className={cn(
                        'size-4 transition-transform duration-200',
                        isExpanded && 'rotate-180',
                      )}
                    />
                  </button>
                ) : null}
              </div>

              {childCategories.length > 0 ? (
                <div
                  className={cn(
                    'grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out',
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                  )}
                >
                  <div className="min-h-0">
                    <div className="space-y-1 py-1 pl-5">
                      {childCategories.map((childCategory) => {
                        const childPath = getProductCategoryPath(childCategory)
                        const childIsActive = isPathActive(childPath)

                        return (
                          <Link
                            key={childCategory.id}
                            className={cn(
                              'relative block py-2 pl-4 text-sm transition-colors duration-200',
                              'before:absolute before:left-0 before:top-1/2 before:h-3 before:w-px before:-translate-y-1/2 before:bg-transparent',
                              childIsActive
                                ? 'font-semibold text-[#162019] before:bg-[#162019]'
                                : 'text-[#7a887f] hover:text-[#162019] hover:before:bg-[#c6d0c8]',
                            )}
                            href={getProductCategoryHref(childCategory)}
                          >
                            {childCategory.title}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </nav>
    </div>
  )

  return (
    <aside className="hidden lg:block lg:w-[16rem] lg:flex-none">
      <div className="sticky top-28 py-1">{content}</div>
    </aside>
  )
}

export default ProductCategoryBrowserSidebar
