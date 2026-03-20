import type { BreadcrumbItem } from '@/components/Breadcrumbs'
import type { Product, ProductCategory } from '@/payload-types'
import type { Payload, Where } from 'payload'

export const PRODUCT_PAGE_LIMIT = 12

export const headerMegaNavProductSelect = {
  title: true,
  model: true,
  slug: true,
  primaryImage: true,
  isFeatured: true,
  publishedAt: true,
} as const

const productCategorySelect = {
  title: true,
  slug: true,
  description: true,
  heroImage: true,
  showInMegaNav: true,
  sortOrder: true,
  parent: true,
  breadcrumbs: true,
  megaNavHotProducts: true,
} as const

export type HeaderMegaNavProduct = Pick<
  Product,
  'id' | 'title' | 'model' | 'slug' | 'primaryImage' | 'isFeatured' | 'publishedAt'
>

export type ProductCategorySummary = Pick<
  ProductCategory,
  | 'id'
  | 'title'
  | 'slug'
  | 'description'
  | 'heroImage'
  | 'showInMegaNav'
  | 'sortOrder'
  | 'parent'
  | 'breadcrumbs'
> 
& {
  megaNavHotProducts?: (number | HeaderMegaNavProduct)[] | null
}

function normalizeCategoryPath(path: string): string {
  const trimmed = path.trim()
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`

  return withLeadingSlash.replace(/\/+$/, '') || '/'
}

export function getProductCategoryPath(category?: ProductCategorySummary | null): string | null {
  const path = category?.breadcrumbs?.[category.breadcrumbs.length - 1]?.url

  if (path) {
    return normalizeCategoryPath(path)
  }

  if (category?.slug) {
    return normalizeCategoryPath(category.slug)
  }

  return null
}

export function getProductCategoryHrefFromPath(path?: string | null): string {
  return path ? `/products/category${normalizeCategoryPath(path)}` : '/products'
}

export function getProductCategoryHref(category?: ProductCategorySummary | null): string {
  return getProductCategoryHrefFromPath(getProductCategoryPath(category))
}

export function getProductCategorySegmentsFromPath(path?: string | null): string[] {
  return path ? normalizeCategoryPath(path).split('/').filter(Boolean) : []
}

export function sortProductCategories<T extends Pick<ProductCategorySummary, 'sortOrder' | 'title'>>(
  categories: T[],
): T[] {
  return [...categories].sort((left, right) => {
    const orderDiff = (left.sortOrder || 0) - (right.sortOrder || 0)

    if (orderDiff !== 0) return orderDiff

    return left.title.localeCompare(right.title)
  })
}

function getRelatedCategoryID(value: ProductCategorySummary['parent']): number | null {
  if (typeof value === 'number') return value
  if (typeof value === 'object' && value !== null) return value.id

  return null
}

export async function getAllProductCategories(payload: Payload): Promise<ProductCategorySummary[]> {
  const result = await payload.find({
    collection: 'product-categories',
    depth: 2,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: productCategorySelect,
  })

  return result.docs as ProductCategorySummary[]
}

export async function resolveProductCategoryBySegments(
  payload: Payload,
  segments: string[],
): Promise<ProductCategorySummary | null> {
  const leafSlug = segments[segments.length - 1]

  if (!leafSlug) return null

  const expectedPath = normalizeCategoryPath(segments.join('/'))
  const result = await payload.find({
    collection: 'product-categories',
    depth: 2,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    select: productCategorySelect,
    where: {
      slug: {
        equals: leafSlug,
      },
    },
  })

  return (
    (result.docs as ProductCategorySummary[]).find(
      (category) => getProductCategoryPath(category) === expectedPath,
    ) || null
  )
}

export function getDirectChildProductCategories(
  categories: ProductCategorySummary[],
  parentID: number,
): ProductCategorySummary[] {
  return sortProductCategories(
    categories.filter((category) => getRelatedCategoryID(category.parent) === parentID),
  )
}

export function getTopLevelProductCategories(
  categories: ProductCategorySummary[],
): ProductCategorySummary[] {
  return sortProductCategories(
    categories.filter((category) => getRelatedCategoryID(category.parent) === null),
  )
}

export function getDescendantProductCategoryIDs(
  categories: ProductCategorySummary[],
  currentPath: string,
): number[] {
  const normalizedPath = normalizeCategoryPath(currentPath)

  return categories
    .filter((category) => {
      const categoryPath = getProductCategoryPath(category)

      return (
        categoryPath === normalizedPath ||
        Boolean(categoryPath && categoryPath.startsWith(`${normalizedPath}/`))
      )
    })
    .map((category) => category.id)
}

export function getProductCategoryProductsWhere(categoryIDs: number[]): Where {
  return {
    or: [
      {
        primaryCategory: {
          in: categoryIDs,
        },
      },
      {
        additionalCategories: {
          in: categoryIDs,
        },
      },
    ],
  }
}

export function getProductCategoryBreadcrumbItems(
  category?: ProductCategorySummary | null,
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
  ]

  if (!category) return items

  const categoryItems =
    category.breadcrumbs?.map((crumb) => ({
      href: crumb.url ? getProductCategoryHrefFromPath(crumb.url) : undefined,
      label: crumb.label || 'Category',
    })) || []

  if (categoryItems.length > 0) {
    items.push(...categoryItems)
  } else {
    items.push({
      href: getProductCategoryHref(category),
      label: category.title,
    })
  }

  return items
}
