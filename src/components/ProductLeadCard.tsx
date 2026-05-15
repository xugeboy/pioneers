'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export type ProductLeadCardData = Pick<
  Product,
  | 'id'
  | 'title'
  | 'model'
  | 'summary'
  | 'primaryImage'
  | 'secondaryImage'
  | 'isFeatured'
  | 'specs'
  | 'slug'
  | 'primaryCategory'
  | 'additionalCategories'
>
export const ProductLeadCard: React.FC<{
  className?: string
  layout?: 'grid' | 'list'
  product: ProductLeadCardData
  reverseInList?: boolean
}> = ({ className, product, layout = 'grid', reverseInList = false }) => {
  const { model, primaryImage, secondaryImage, slug, summary, title } = product
  const href = slug ? `/products/${slug}` : '/products'
  const isListLayout = layout === 'list'
  const [showSecondaryImage, setShowSecondaryImage] = useState(false)

  useEffect(() => {
    setShowSecondaryImage(false)
  }, [primaryImage, secondaryImage, slug])

  const imageClasses = cn(
    'group/image relative z-0 block w-full shrink-0 overflow-hidden',
    isListLayout
      ? 'aspect-square min-h-[6.75rem] md:h-full md:min-h-[10rem] md:aspect-square'
      : 'aspect-[4/3] bg-[#eef2eb] sm:aspect-square',
    isListLayout && reverseInList && 'md:order-2',
  )
  const imgClassName = 'h-full w-full object-contain'

  const imageContent = (
    <>
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-300',
          showSecondaryImage ? 'opacity-0 md:opacity-100' : 'opacity-100',
          'md:group-hover/image:opacity-0 md:group-focus-within/image:opacity-0',
        )}
      >
        <Media fill htmlElement={null} imgClassName={imgClassName} resource={primaryImage} />
      </div>

      {secondaryImage ? (
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            showSecondaryImage ? 'opacity-100 md:opacity-0' : 'opacity-0',
            'md:group-hover/image:opacity-100 md:group-focus-within/image:opacity-100',
          )}
        >
          <Media fill htmlElement={null} imgClassName={imgClassName} resource={secondaryImage} />
        </div>
      ) : null}
    </>
  )

  return (
    <article
      className={cn(
        'group grid h-full overflow-hidden bg-transparent text-[#101914] transition-opacity duration-300 hover:opacity-90',
        isListLayout &&
          'grid-cols-[6.75rem_minmax(0,1fr)] items-start gap-6 md:grid-cols-[10rem_minmax(0,1fr)] md:items-center md:gap-8',
        isListLayout && reverseInList && 'md:grid-cols-[minmax(0,1fr)_10rem]',
        className,
      )}
    >
      {secondaryImage ? (
        <button
          aria-label={
            showSecondaryImage
              ? `Show primary image for ${title}`
              : `Show secondary image for ${title}`
          }
          className={imageClasses}
          onClick={() => {
            setShowSecondaryImage((currentValue) => !currentValue)
          }}
          type="button"
        >
          {imageContent}
        </button>
      ) : (
        <div className={imageClasses}>{imageContent}</div>
      )}

      <div
        className={cn(
          'relative z-10 grid min-w-0 flex-1 content-start gap-4 px-0 pb-0 pt-4 md:pt-5',
          isListLayout && 'pt-0 md:px-0 md:pt-0',
          isListLayout && reverseInList && 'md:order-1',
        )}
      >
        <div className={`space-y-2 ${isListLayout ? '' : 'text-center'}`}>
          <h2 className="font-display text-[0.95rem] font-semibold leading-snug md:text-[1.1rem] md:leading-tight">
            <Link
              className="block rounded-sm transition-colors hover:text-[#36513f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36513f]/30"
              href={href}
            >
              {title}
            </Link>
          </h2>

          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#5f7265] md:text-[0.76rem] md:tracking-[0.18em]">
            {model}
          </p>
        </div>

        {isListLayout && summary ? (
          <p className="hidden max-w-2xl text-xs leading-5 text-[#4f5d54] md:block md:line-clamp-none md:text-sm md:leading-6">
            {summary}
          </p>
        ) : null}
      </div>
    </article>
  )
}
