import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Product } from '@/payload-types'
import { revalidateHeaderTag } from '@/utilities/revalidateHeaderTag'
import { safeRevalidatePath, safeRevalidateTag } from '@/utilities/safeRevalidate'
import { SITE_SITEMAP_TAG } from '@/utilities/sitemapConstants'

export const revalidateProduct: CollectionAfterChangeHook<Product> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header after product change: ${doc.id}`)
    revalidateHeaderTag(payload.logger)

    if (doc._status === 'published' || previousDoc?._status === 'published') {
      safeRevalidateTag(SITE_SITEMAP_TAG, payload.logger)
      safeRevalidatePath('/sitemap.xml', payload.logger)
    }
  }

  return doc
}

export const revalidateDeleteProduct: CollectionAfterDeleteHook<Product> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header after product delete: ${doc.id}`)
    revalidateHeaderTag(payload.logger)
    safeRevalidateTag(SITE_SITEMAP_TAG, payload.logger)
    safeRevalidatePath('/sitemap.xml', payload.logger)
  }

  return doc
}
