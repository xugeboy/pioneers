import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'
import { SITE_SITEMAP_TAG } from '@/utilities/sitemapConstants'

import type { Blog } from '../../../payload-types'

export const revalidateBlog: CollectionAfterChangeHook<Blog> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/blogs/${doc.slug}`

      payload.logger.info(`Revalidating blog at path: ${path}`)

      revalidatePath(path)
      revalidateTag(SITE_SITEMAP_TAG)
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/blogs/${previousDoc.slug}`

      payload.logger.info(`Revalidating old blog at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag(SITE_SITEMAP_TAG)
    }
  }

  return doc
}

export const revalidateDeleteBlog: CollectionAfterDeleteHook<Blog> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/blogs/${doc?.slug}`

    revalidatePath(path)
    revalidateTag(SITE_SITEMAP_TAG)
  }

  return doc
}
