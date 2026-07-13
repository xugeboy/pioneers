import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { safeRevalidatePath, safeRevalidateTag } from '@/utilities/safeRevalidate'
import { SITE_SITEMAP_TAG } from '@/utilities/sitemapConstants'

import type { Page } from '../../../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

      payload.logger.info(`Revalidating page at path: ${path}`)

      safeRevalidatePath(path, payload.logger)
      safeRevalidateTag(SITE_SITEMAP_TAG, payload.logger)
      safeRevalidatePath('/sitemap.xml', payload.logger)
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old page at path: ${oldPath}`)

      safeRevalidatePath(oldPath, payload.logger)
      safeRevalidateTag(SITE_SITEMAP_TAG, payload.logger)
      safeRevalidatePath('/sitemap.xml', payload.logger)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
    safeRevalidatePath(path, payload.logger)
    safeRevalidateTag(SITE_SITEMAP_TAG, payload.logger)
    safeRevalidatePath('/sitemap.xml', payload.logger)
  }

  return doc
}
