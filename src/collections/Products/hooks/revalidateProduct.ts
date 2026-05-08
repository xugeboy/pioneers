import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Product } from '@/payload-types'
import { revalidateTag } from 'next/cache'
import { revalidateHeaderTag } from '@/utilities/revalidateHeaderTag'
import { SITE_SITEMAP_TAG } from '@/utilities/sitemapConstants'

export const revalidateProduct: CollectionAfterChangeHook<Product> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header after product change: ${doc.id}`)
    revalidateHeaderTag()

    if (doc._status === 'published' || previousDoc?._status === 'published') {
      revalidateTag(SITE_SITEMAP_TAG)
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
    revalidateHeaderTag()
    revalidateTag(SITE_SITEMAP_TAG)
  }

  return doc
}
