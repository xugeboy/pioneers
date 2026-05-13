import type { Blog, Media, Page, Product, ProductCategory } from '@/payload-types'

import { getServerSideURL } from '@/utilities/getURL'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import {
  getProductCategoryHref,
  getProductCategoryHrefFromPath,
  getProductCategoryPath,
  type ProductCategorySummary,
} from '@/utilities/productCategories'

type JsonLdNode = Record<string, unknown>

const SITE_NAME = 'PioneersGears'
const SITE_DESCRIPTION =
  'Application-driven cargo control and mobility restraint solutions for OEM and ODM programs.'

const removeEmpty = <T extends JsonLdNode>(input: T): T => {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => {
      if (value === undefined || value === null || value === '') return false
      if (Array.isArray(value) && value.length === 0) return false
      return true
    }),
  ) as T
}

export const toAbsoluteURL = (path = '/'): string => {
  if (path.startsWith('http://') || path.startsWith('https://')) return path

  const baseURL = getServerSideURL().replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${baseURL}${normalizedPath}`
}

const getMediaURL = (image?: Media | number | null): string | undefined => {
  if (!image || typeof image !== 'object') return undefined

  const url = image.frontendURL || image.sizes?.og?.url || image.sizes?.large?.url || image.url
  const mediaURL = getMediaUrl(url, image.updatedAt)

  return mediaURL ? toAbsoluteURL(mediaURL) : undefined
}

const getOrganizationNode = (): JsonLdNode =>
  removeEmpty({
    '@type': 'Organization',
    '@id': toAbsoluteURL('/#organization'),
    name: SITE_NAME,
    url: toAbsoluteURL('/'),
    logo: toAbsoluteURL('/pioneers-logo.png'),
  })

export const getGlobalJsonLd = (): JsonLdNode[] => [
  {
    '@context': 'https://schema.org',
    ...getOrganizationNode(),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': toAbsoluteURL('/#website'),
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: toAbsoluteURL('/'),
    publisher: {
      '@id': toAbsoluteURL('/#organization'),
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${toAbsoluteURL('/search')}?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
]

export const getWebPageJsonLd = (
  doc: Partial<Page> | Partial<Blog> | null,
  path: string,
): JsonLdNode =>
  removeEmpty({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${toAbsoluteURL(path)}#webpage`,
    url: toAbsoluteURL(path),
    name: doc?.meta?.title || doc?.title || SITE_NAME,
    description: doc?.meta?.description,
    isPartOf: {
      '@id': toAbsoluteURL('/#website'),
    },
    publisher: {
      '@id': toAbsoluteURL('/#organization'),
    },
  })

export const getBlogPostingJsonLd = (blog: Blog): JsonLdNode => {
  const path = `/blogs/${blog.slug}`
  const image = getMediaURL(blog.meta?.image || blog.heroImage)
  const authors =
    blog.populatedAuthors
      ?.map((author) =>
        author.name
          ? {
              '@type': 'Person',
              name: author.name,
            }
          : null,
      )
      .filter(Boolean) || []

  return removeEmpty({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${toAbsoluteURL(path)}#blogposting`,
    headline: blog.meta?.title || blog.title,
    description: blog.meta?.description,
    image,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt,
    author: authors.length ? authors : getOrganizationNode(),
    publisher: {
      '@id': toAbsoluteURL('/#organization'),
    },
    mainEntityOfPage: {
      '@id': `${toAbsoluteURL(path)}#webpage`,
    },
    url: toAbsoluteURL(path),
  })
}

export const getProductJsonLd = (product: Product): JsonLdNode => {
  const path = `/products/${product.slug}`
  const category =
    typeof product.primaryCategory === 'object' && product.primaryCategory
      ? product.primaryCategory.title
      : undefined

  return removeEmpty({
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${toAbsoluteURL(path)}#product`,
    name: product.title,
    model: product.model,
    description: product.summary,
    image: getMediaURL(product.primaryImage),
    category,
    url: toAbsoluteURL(path),
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    manufacturer: {
      '@id': toAbsoluteURL('/#organization'),
    },
    additionalProperty: product.specs?.map((spec) => ({
      '@type': 'PropertyValue',
      name: spec.label,
      value: spec.value,
    })),
  })
}

export const getCollectionPageJsonLd = (args: {
  description?: string | null
  items?: { name: string; url: string }[]
  name: string
  path: string
}): JsonLdNode =>
  removeEmpty({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${toAbsoluteURL(args.path)}#collectionpage`,
    url: toAbsoluteURL(args.path),
    name: args.name,
    description: args.description,
    isPartOf: {
      '@id': toAbsoluteURL('/#website'),
    },
    mainEntity: args.items?.length
      ? {
          '@type': 'ItemList',
          itemListElement: args.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            url: toAbsoluteURL(item.url),
          })),
        }
      : undefined,
  })

export const getProductCategoryJsonLd = (
  category: ProductCategorySummary | ProductCategory,
  products: Pick<Product, 'slug' | 'title'>[],
): JsonLdNode => {
  const categoryPath = getProductCategoryPath(category)
  const path = getProductCategoryHref(category)

  return getCollectionPageJsonLd({
    description: category.description,
    items: products.map((product) => ({
      name: product.title,
      url: `/products/${product.slug}`,
    })),
    name: category.title,
    path: categoryPath ? getProductCategoryHrefFromPath(categoryPath) : path,
  })
}

export const getBreadcrumbJsonLd = (
  items: { label: string; href?: string }[],
  currentPath: string,
): JsonLdNode => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: toAbsoluteURL(item.href || currentPath),
  })),
})
