import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { safeRevalidatePath, safeRevalidateTag } from '@/utilities/safeRevalidate'
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

      safeRevalidatePath(path, payload.logger)
      safeRevalidateTag(SITE_SITEMAP_TAG, payload.logger)
      safeRevalidatePath('/sitemap.xml', payload.logger)
    }

    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/blogs/${previousDoc.slug}`

      payload.logger.info(`Revalidating old blog at path: ${oldPath}`)

      safeRevalidatePath(oldPath, payload.logger)
      safeRevalidateTag(SITE_SITEMAP_TAG, payload.logger)
      safeRevalidatePath('/sitemap.xml', payload.logger)
    }
  }

  return doc
}

export const revalidateDeleteBlog: CollectionAfterDeleteHook<Blog> = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    const path = `/blogs/${doc?.slug}`

    safeRevalidatePath(path, payload.logger)
    safeRevalidateTag(SITE_SITEMAP_TAG, payload.logger)
    safeRevalidatePath('/sitemap.xml', payload.logger)
  }

  return doc
}
