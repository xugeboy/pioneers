import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Product } from '@/payload-types'

export const FEATURED_PRODUCTS_CAROUSEL_LIMIT = 5

export const carouselProductSelect = {
  id: true,
  title: true,
  slug: true,
  model: true,
  primaryImage: true,
  secondaryImage: true,
  updatedAt: true,
} as const

export type CarouselProduct = Pick<
  Product,
  'id' | 'title' | 'slug' | 'model' | 'primaryImage' | 'secondaryImage' | 'updatedAt'
>

const publishedProductsWhere = {
  _status: {
    equals: 'published',
  },
} as const

function dedupeProducts(products: CarouselProduct[]): CarouselProduct[] {
  const seenIDs = new Set<number>()

  return products.filter((product) => {
    if (seenIDs.has(product.id)) return false

    seenIDs.add(product.id)
    return true
  })
}

export const getFeaturedCarouselProducts = cache(
  async (limit = FEATURED_PRODUCTS_CAROUSEL_LIMIT): Promise<CarouselProduct[]> => {
    const payload = await getPayload({ config: configPromise })

    const featuredResult = await payload.find({
      collection: 'products',
      depth: 1,
      draft: false,
      limit,
      overrideAccess: false,
      pagination: false,
      select: carouselProductSelect,
      sort: '-updatedAt',
      where: {
        and: [
          publishedProductsWhere,
          {
            isFeatured: {
              equals: true,
            },
          },
        ],
      },
    })

    const featuredProducts = featuredResult.docs as CarouselProduct[]

    if (featuredProducts.length >= limit) {
      return featuredProducts.slice(0, limit)
    }

    const recentResult = await payload.find({
      collection: 'products',
      depth: 1,
      draft: false,
      limit,
      overrideAccess: false,
      pagination: false,
      select: carouselProductSelect,
      sort: '-updatedAt',
      where: publishedProductsWhere,
    })

    return dedupeProducts([...featuredProducts, ...(recentResult.docs as CarouselProduct[])]).slice(
      0,
      limit,
    )
  },
)
