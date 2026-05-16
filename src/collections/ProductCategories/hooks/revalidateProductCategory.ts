import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { ProductCategory } from '@/payload-types'
import { revalidateHeaderTag } from '@/utilities/revalidateHeaderTag'
import { safeRevalidateTag } from '@/utilities/safeRevalidate'
import { SITE_SITEMAP_TAG } from '@/utilities/sitemapConstants'

export const revalidateProductCategory: CollectionAfterChangeHook<ProductCategory> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header after product category change: ${doc.id}`)
    revalidateHeaderTag(payload.logger)
    safeRevalidateTag(SITE_SITEMAP_TAG, payload.logger)
  }

  return doc
}

export const revalidateDeleteProductCategory: CollectionAfterDeleteHook<ProductCategory> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header after product category delete: ${doc.id}`)
    revalidateHeaderTag(payload.logger)
    safeRevalidateTag(SITE_SITEMAP_TAG, payload.logger)
  }

  return doc
}
