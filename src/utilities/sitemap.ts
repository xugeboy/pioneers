import type { MetadataRoute } from 'next'

import { unstable_cache } from 'next/cache'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getServerSideURL } from './getURL'
import { SITE_SITEMAP_TAG } from './sitemapConstants'

type SitemapEntry = MetadataRoute.Sitemap[number]

const defaultSitemapMeta = {
  changeFrequency: 'weekly',
  priority: 0.8,
} as const

const blogSitemapMeta = {
  changeFrequency: 'monthly',
  priority: 0.9,
} as const

type PageSitemapDoc = {
  slug?: string | null
  updatedAt?: string | null
}

type BlogSitemapDoc = {
  slug?: string | null
  updatedAt?: string | null
}

type ProductSitemapDoc = {
  slug?: string | null
  updatedAt?: string | null
}

type ProductCategorySitemapDoc = {
  slug?: string | null
  updatedAt?: string | null
  breadcrumbs?:
    | {
        url?: string | null
      }[]
    | null
}

const RESERVED_PAGE_SLUGS = new Set([
  'home',
  'blogs',
  'products',
  'product-categories',
  'search',
  'thank-you',
  'oem-tie-downs',
])

const normalizePath = (path: string) => {
  const trimmed = path.trim()
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`

  return withLeadingSlash.replace(/\/+$/, '') || '/'
}

const getCanonicalSiteUrl = () => getServerSideURL().replace(/\/+$/, '')

const toAbsoluteUrl = (path: string) => `${getCanonicalSiteUrl()}${normalizePath(path)}`

const getLastModified = (value?: string | null) => value || new Date().toISOString()

const getLatestUpdatedAt = (...values: Array<string | null | undefined>) =>
  values.filter(Boolean).sort((left, right) => String(right).localeCompare(String(left)))[0] ||
  undefined

const getProductCategoryPath = (category: ProductCategorySitemapDoc) => {
  const breadcrumbPath = category.breadcrumbs?.[category.breadcrumbs.length - 1]?.url

  if (breadcrumbPath) {
    return normalizePath(breadcrumbPath)
  }

  if (category.slug) {
    return normalizePath(category.slug)
  }

  return null
}

export const getSiteSitemap = unstable_cache(
  async (): Promise<MetadataRoute.Sitemap> => {
    const payload = await getPayload({ config })

    const [pagesResult, blogsResult, productsResult, productCategoriesResult] = await Promise.all([
      payload.find({
        collection: 'pages',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      payload.find({
        collection: 'blogs',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      payload.find({
        collection: 'products',
        overrideAccess: false,
        draft: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        where: {
          _status: {
            equals: 'published',
          },
        },
        select: {
          slug: true,
          updatedAt: true,
        },
      }),
      payload.find({
        collection: 'product-categories',
        overrideAccess: false,
        depth: 0,
        limit: 1000,
        pagination: false,
        select: {
          slug: true,
          breadcrumbs: true,
          updatedAt: true,
        },
      }),
    ])

    const pages = (pagesResult.docs || []) as PageSitemapDoc[]
    const blogs = (blogsResult.docs || []) as BlogSitemapDoc[]
    const products = (productsResult.docs || []) as ProductSitemapDoc[]
    const productCategories = (productCategoriesResult.docs || []) as ProductCategorySitemapDoc[]

    const homePage = pages.find((page) => page.slug === 'home')
    const coreEntries: SitemapEntry[] = [
      {
        url: toAbsoluteUrl('/'),
        lastModified: getLastModified(homePage?.updatedAt),
        ...defaultSitemapMeta,
      },
      {
        url: toAbsoluteUrl('/blogs'),
        lastModified: getLastModified(getLatestUpdatedAt(...blogs.map((blog) => blog.updatedAt))),
        ...blogSitemapMeta,
      },
      {
        url: toAbsoluteUrl('/products'),
        lastModified: getLastModified(
          getLatestUpdatedAt(...products.map((product) => product.updatedAt)),
        ),
        ...defaultSitemapMeta,
      },
      {
        url: toAbsoluteUrl('/product-categories'),
        lastModified: getLastModified(
          getLatestUpdatedAt(...productCategories.map((category) => category.updatedAt)),
        ),
        ...defaultSitemapMeta,
      },
    ]

    const pageEntries = pages
      .filter((page) => page.slug && !RESERVED_PAGE_SLUGS.has(page.slug))
      .map((page) => ({
        url: toAbsoluteUrl(`/${page.slug}`),
        lastModified: getLastModified(page.updatedAt),
        ...defaultSitemapMeta,
      }))

    const blogEntries = blogs
      .filter((blog) => Boolean(blog.slug))
      .map((blog) => ({
        url: toAbsoluteUrl(`/blogs/${blog.slug}`),
        lastModified: getLastModified(blog.updatedAt),
        ...blogSitemapMeta,
      }))

    const productEntries = products
      .filter((product) => Boolean(product.slug))
      .map((product) => ({
        url: toAbsoluteUrl(`/products/${product.slug}`),
        lastModified: getLastModified(product.updatedAt),
        ...defaultSitemapMeta,
      }))

    const productCategoryEntries = productCategories.flatMap((category) => {
      const path = getProductCategoryPath(category)

      if (!path) return []

      return [
        {
          url: toAbsoluteUrl(`/product-categories${path === '/' ? '' : path}`),
          lastModified: getLastModified(category.updatedAt),
          ...defaultSitemapMeta,
        },
      ]
    })

    return [
      ...coreEntries,
      ...pageEntries,
      ...blogEntries,
      ...productEntries,
      ...productCategoryEntries,
    ]
  },
  [SITE_SITEMAP_TAG],
  {
    tags: [SITE_SITEMAP_TAG],
  },
)

export const getSiteRobots = (): MetadataRoute.Robots => {
  const siteUrl = getCanonicalSiteUrl()

  return {
    rules: {
      userAgent: '*',
      disallow: ['/admin', '/admin/*', '/thank-you', '/oem-tie-downs'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
