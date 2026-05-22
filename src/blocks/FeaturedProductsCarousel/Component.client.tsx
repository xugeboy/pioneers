'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import type { CarouselProduct } from '@/utilities/queryProducts'

import { Button } from '@/components/ui/button'
import { ContentCarousel } from '@/components/ContentCarousel'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = {
  products: CarouselProduct[]
  title: string
}

export const FeaturedProductsCarouselClient: React.FC<Props> = ({ products, title }) => {
  return (
    <ContentCarousel autoScroll itemSelector="[data-featured-product-card='true']" title={title}>
      {products.map((product) => (
        <FeaturedProductCard key={product.id} product={product} />
      ))}
    </ContentCarousel>
  )
}

const FeaturedProductCard: React.FC<{ product: CarouselProduct }> = ({ product }) => {
  const href = product.slug ? `/products/${product.slug}` : '/products'
  const hasSecondaryImage = Boolean(product.secondaryImage)
  const [showSecondaryImage, setShowSecondaryImage] = useState(false)

  useEffect(() => {
    setShowSecondaryImage(false)
  }, [product.id])

  const imageContent = (
    <>
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-300',
          showSecondaryImage ? 'opacity-0 md:opacity-100' : 'opacity-100',
          hasSecondaryImage && 'md:group-hover/card:opacity-0 md:group-focus-within/card:opacity-0',
        )}
      >
        <Media
          fill
          imgClassName="h-full w-full object-contain p-4"
          resource={product.primaryImage}
        />
      </div>

      {product.secondaryImage ? (
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            showSecondaryImage ? 'opacity-100 md:opacity-0' : 'opacity-0',
            'md:group-hover/card:opacity-100 md:group-focus-within/card:opacity-100',
          )}
        >
          <Media
            fill
            imgClassName="h-full w-full object-contain p-4"
            resource={product.secondaryImage}
          />
        </div>
      ) : null}
    </>
  )

  return (
    <article
      className="group/card flex w-[15.5rem] shrink-0 snap-start flex-col items-center text-center sm:w-[16.5rem] lg:w-[17.5rem]"
      data-featured-product-card="true"
    >
      {hasSecondaryImage ? (
        <button
          aria-label={
            showSecondaryImage
              ? `Show primary image for ${product.title}`
              : `Show secondary image for ${product.title}`
          }
          className="relative aspect-square w-full overflow-hidden bg-white"
          onClick={() => setShowSecondaryImage((currentValue) => !currentValue)}
          type="button"
        >
          {imageContent}
        </button>
      ) : (
        <div className="relative aspect-square w-full overflow-hidden bg-white">{imageContent}</div>
      )}

      <h3 className="mt-5 line-clamp-3 min-h-[4.5rem] font-industrial text-xl font-bold uppercase leading-tight text-[#101914]">
        <Link className="transition-colors hover:text-[#00A650]" href={href}>
          {product.title}
        </Link>
      </h3>

      <Button
        asChild
        className="mt-5 h-12 rounded-md bg-[#00A650] px-9 font-industrial text-xl font-bold uppercase text-white hover:bg-[#008f45]"
        size="clear"
      >
        <Link href={href}>View Item</Link>
      </Button>
    </article>
  )
}
