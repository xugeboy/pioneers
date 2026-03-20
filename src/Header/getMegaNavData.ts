import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import type { Payload } from 'payload'

import {
  type HeaderMegaNavProduct,
  type ProductCategorySummary,
  getAllProductCategories,
  getDescendantProductCategoryIDs,
  getDirectChildProductCategories,
  getProductCategoryHref,
  getProductCategoryPath,
  getProductCategoryProductsWhere,
  getTopLevelProductCategories,
  headerMegaNavProductSelect,
} from '@/utilities/productCategories'

export type HeaderMegaNavItem = {
  categoryId: number
  href: string
  id: string
  isSyntheticAll?: boolean
  label: string
  products: HeaderMegaNavProduct[]
}

export type HeaderMegaNavGroup = {
  href: string
  id: number
  items: HeaderMegaNavItem[]
  label: string
}

function extractRelationshipIDs(
  value: ProductCategorySummary['megaNavHotProducts'],
): number[] {
  return (value || [])
    .map((item) => {
      if (typeof item === 'number') return item
      if (typeof item === 'object' && item !== null) return item.id

      return null
    })
    .filter((item): item is number => item !== null)
}

function dedupeProducts(products: HeaderMegaNavProduct[]): HeaderMegaNavProduct[] {
  const seen = new Set<number>()

  return products.filter((product) => {
    if (seen.has(product.id)) {
      return false
    }

    seen.add(product.id)
    return true
  })
}

async function getManualProductsMap(
  payload: Payload,
  categories: ProductCategorySummary[],
): Promise<Map<number, HeaderMegaNavProduct>> {
  const manualProductIDs = [...new Set(categories.flatMap((category) => extractRelationshipIDs(category.megaNavHotProducts)))]

  if (manualProductIDs.length === 0) {
    return new Map()
  }

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: manualProductIDs.length,
    overrideAccess: false,
    pagination: false,
    select: headerMegaNavProductSelect,
    where: {
      id: {
        in: manualProductIDs,
      },
    },
  })

  return new Map(
    (products.docs as HeaderMegaNavProduct[]).map((product) => [product.id, product]),
  )
}

async function getFallbackHotProducts(
  payload: Payload,
  categoryIDs: number[],
): Promise<HeaderMegaNavProduct[]> {
  if (categoryIDs.length === 0) {
    return []
  }

  const featuredProducts = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 5,
    overrideAccess: false,
    pagination: false,
    select: headerMegaNavProductSelect,
    sort: '-publishedAt',
    where: {
      and: [getProductCategoryProductsWhere(categoryIDs), { isFeatured: { equals: true } }],
    },
  })

  const combinedProducts = dedupeProducts(featuredProducts.docs as HeaderMegaNavProduct[])

  if (combinedProducts.length >= 5) {
    return combinedProducts.slice(0, 5)
  }

  const recentProducts = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    pagination: false,
    select: headerMegaNavProductSelect,
    sort: '-publishedAt',
    where: getProductCategoryProductsWhere(categoryIDs),
  })

  return dedupeProducts([
    ...combinedProducts,
    ...(recentProducts.docs as HeaderMegaNavProduct[]),
  ]).slice(0, 5)
}

async function buildItemProductsMap(
  payload: Payload,
  allCategories: ProductCategorySummary[],
  topLevelCategories: ProductCategorySummary[],
): Promise<Map<number, HeaderMegaNavProduct[]>> {
  const displayCategories = dedupeCategories(
    topLevelCategories.flatMap((category) => [
      category,
      ...getDirectChildProductCategories(allCategories, category.id),
    ]),
  )
  const manualProductsMap = await getManualProductsMap(payload, displayCategories)
  const productsByCategory = await Promise.all(
    displayCategories.map(async (category) => {
      const manualProducts = extractRelationshipIDs(category.megaNavHotProducts)
        .map((productID) => manualProductsMap.get(productID))
        .filter((product): product is HeaderMegaNavProduct => Boolean(product))
        .slice(0, 5)

      if (manualProducts.length > 0) {
        return [category.id, manualProducts] as const
      }

      const categoryPath = getProductCategoryPath(category)
      const descendantIDs = getDescendantProductCategoryIDs(allCategories, categoryPath || '')
      const fallbackProducts = await getFallbackHotProducts(payload, descendantIDs)

      return [category.id, fallbackProducts] as const
    }),
  )

  return new Map(productsByCategory)
}

function dedupeCategories(categories: ProductCategorySummary[]): ProductCategorySummary[] {
  const seen = new Set<number>()

  return categories.filter((category) => {
    if (seen.has(category.id)) {
      return false
    }

    seen.add(category.id)
    return true
  })
}

async function getHeaderMegaNavData(): Promise<HeaderMegaNavGroup[]> {
  const payload = await getPayload({ config: configPromise })
  const allCategories = await getAllProductCategories(payload)
  const topLevelCategories = getTopLevelProductCategories(allCategories).filter(
    (category) => category.showInMegaNav,
  )

  if (topLevelCategories.length === 0) {
    return []
  }

  const itemProductsMap = await buildItemProductsMap(payload, allCategories, topLevelCategories)

  return topLevelCategories.map((topLevelCategory) => {
    const childCategories = getDirectChildProductCategories(allCategories, topLevelCategory.id)
    const href = getProductCategoryHref(topLevelCategory)

    return {
      href,
      id: topLevelCategory.id,
      items: [
        {
          categoryId: topLevelCategory.id,
          href,
          id: `all-${topLevelCategory.id}`,
          isSyntheticAll: true,
          label: `All ${topLevelCategory.title}`,
          products: itemProductsMap.get(topLevelCategory.id) || [],
        },
        ...childCategories.map((childCategory) => ({
          categoryId: childCategory.id,
          href: getProductCategoryHref(childCategory),
          id: `category-${childCategory.id}`,
          label: childCategory.title,
          products: itemProductsMap.get(childCategory.id) || [],
        })),
      ],
      label: topLevelCategory.title,
    }
  })
}

export const getCachedHeaderMegaNavData = unstable_cache(async () => getHeaderMegaNavData(), ['header-mega-nav'], {
  tags: ['global_header'],
})
