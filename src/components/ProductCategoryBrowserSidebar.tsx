'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { sortProductCategories, type ProductCategoryNavItem } from '@/utilities/productCategories'
import { cn } from '@/utilities/ui'

type Props = {
  categories: ProductCategoryNavItem[]
  currentCategoryID: number
}

const ProductCategoryBrowserSidebar: React.FC<Props> = ({ categories, currentCategoryID }) => {
  const topLevelCategories = sortProductCategories(
    categories.filter((category) => category.parentID === null),
  )
  const activeCategoryIDs = useMemo(() => {
    const ids = new Set<number>()
    const categoryByID = new Map(categories.map((category) => [category.id, category]))
    let category = categoryByID.get(currentCategoryID)

    while (category) {
      ids.add(category.id)
      category = category.parentID ? categoryByID.get(category.parentID) : undefined
    }

    return ids
  }, [categories, currentCategoryID])

  const activeTopLevelID = useMemo(
    () => topLevelCategories.find((category) => activeCategoryIDs.has(category.id))?.id ?? null,
    [activeCategoryIDs, topLevelCategories],
  )

  const [expandedParentID, setExpandedParentID] = useState<number | null>(activeTopLevelID)

  useEffect(() => {
    setExpandedParentID(activeTopLevelID)
  }, [activeTopLevelID])

  const content = (
    <div className="flex h-full flex-col">
      <nav aria-label="Product categories" className="space-y-2 overflow-y-auto">
        {topLevelCategories.map((topLevelCategory) => {
          const topLevelIsActive = activeCategoryIDs.has(topLevelCategory.id)
          const childCategories = sortProductCategories(
            categories.filter((category) => category.parentID === topLevelCategory.id),
          )
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
                  href={topLevelCategory.href}
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
                        const childIsActive = activeCategoryIDs.has(childCategory.id)

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
                            href={childCategory.href}
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
