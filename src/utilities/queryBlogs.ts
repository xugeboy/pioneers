import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

export const BLOG_FEATURED_LIMIT = 4
export const BLOG_ARCHIVE_PAGE_SIZE = 12
export const BLOG_CAROUSEL_LIMIT = 5

const blogArchiveSelect = {
  id: true,
  title: true,
  slug: true,
  categories: true,
  heroImage: true,
  meta: true,
  publishedAt: true,
} as const

const latestBlogSelect = {
  ...blogArchiveSelect,
  heroImage: true,
  publishedAt: true,
  updatedAt: true,
} as const

const buildExcludeWhere = (excludeIDs: Array<number | string>) =>
  excludeIDs.length > 0
    ? {
        id: {
          not_in: excludeIDs,
        },
      }
    : undefined

export const getLatestPublishedBlogs = cache(async (limit = BLOG_FEATURED_LIMIT) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'blogs',
    depth: 1,
    draft: false,
    limit,
    overrideAccess: false,
    pagination: false,
    select: latestBlogSelect,
    sort: '-publishedAt',
  })

  return result.docs
})

export const getRecentlyUpdatedBlogs = cache(async (limit = BLOG_CAROUSEL_LIMIT) => {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'blogs',
    depth: 1,
    draft: false,
    limit,
    overrideAccess: false,
    pagination: false,
    select: latestBlogSelect,
    sort: '-updatedAt',
    where: {
      _status: {
        equals: 'published',
      },
    },
  })

  return result.docs
})

export const getBlogArchivePage = cache(
  async ({ excludeIDs = [], page = 1 }: { excludeIDs?: Array<number | string>; page?: number }) => {
    const payload = await getPayload({ config: configPromise })
    const where = buildExcludeWhere(excludeIDs)

    return payload.find({
      collection: 'blogs',
      depth: 1,
      draft: false,
      limit: BLOG_ARCHIVE_PAGE_SIZE,
      overrideAccess: false,
      page,
      select: blogArchiveSelect,
      sort: '-publishedAt',
      ...(where ? { where } : {}),
    })
  },
)

export const queryBlogBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'blogs',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
