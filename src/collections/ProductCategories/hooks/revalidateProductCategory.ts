import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTag } from 'next/cache'
import type { ProductCategory } from '@/payload-types'
import { revalidateHeaderTag } from '@/utilities/revalidateHeaderTag'
import { SITE_SITEMAP_TAG } from '@/utilities/sitemapConstants'

export const revalidateProductCategory: CollectionAfterChangeHook<ProductCategory> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header after product category change: ${doc.id}`)
    revalidateHeaderTag()
    revalidateTag(SITE_SITEMAP_TAG)
  }

  return doc
}

export const revalidateDeleteProductCategory: CollectionAfterDeleteHook<ProductCategory> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header after product category delete: ${doc.id}`)
    revalidateHeaderTag()
    revalidateTag(SITE_SITEMAP_TAG)
  }

  return doc
}
