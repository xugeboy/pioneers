import Link from 'next/link'
import React from 'react'

import type { ProductCategorySummary } from '@/utilities/productCategories'

import { Media } from '@/components/Media'
import { getProductCategoryHref } from '@/utilities/productCategories'
import { cn } from '@/utilities/ui'

export const ProductCategoryCard: React.FC<{
  category: ProductCategorySummary
  className?: string
}> = ({ category, className }) => {
  const href = getProductCategoryHref(category)
  const hasHeroImage = category.heroImage && typeof category.heroImage === 'object'

  return (
    <Link
      className={cn(
        'group relative block overflow-hidden rounded-[1.5rem] border border-[#d7dfd5] bg-[#f7f8f4] transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[#36513f] hover:shadow-[0_24px_48px_rgba(22,32,25,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36513f]/25',
        className,
      )}
      href={href}
    >
      <div className="relative min-h-56 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(54,81,63,0.16),_transparent_52%),linear-gradient(180deg,#fbfcf8_0%,#edf1ea_100%)]" />
        {hasHeroImage ? (
          <Media
            fill
            imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            resource={category.heroImage}
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,20,14,0.04)_0%,rgba(11,20,14,0.18)_100%)]" />
        <div className="relative z-10 flex min-h-56 flex-col justify-end gap-3 p-5 md:p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#5e7264]">
            Product Category
          </p>
          <div className="space-y-2">
            <h3 className="font-display text-2xl text-[#162019]">{category.title}</h3>
            {category.description ? (
              <p className="max-w-xl text-sm leading-6 text-[#47584d]">{category.description}</p>
            ) : null}
          </div>
          <p className="text-sm font-semibold text-[#36513f]">Browse category</p>
        </div>
      </div>
    </Link>
  )
}
