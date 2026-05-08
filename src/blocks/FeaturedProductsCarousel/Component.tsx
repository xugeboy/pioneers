import React from 'react'

import type { FeaturedProductsCarouselBlock as FeaturedProductsCarouselBlockProps } from '@/payload-types'

import { FeaturedProductsCarouselClient } from './Component.client'
import {
  FEATURED_PRODUCTS_CAROUSEL_LIMIT,
  getFeaturedCarouselProducts,
} from '@/utilities/queryProducts'

export const FeaturedProductsCarouselBlock: React.FC<
  FeaturedProductsCarouselBlockProps & { disableInnerContainer?: boolean }
> = async ({ title }) => {
  const products = await getFeaturedCarouselProducts(FEATURED_PRODUCTS_CAROUSEL_LIMIT)

  if (!products.length) return null

  return <FeaturedProductsCarouselClient products={products} title={title} />
}
