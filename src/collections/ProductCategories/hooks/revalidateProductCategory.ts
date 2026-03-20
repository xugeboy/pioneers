import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { ProductCategory } from '@/payload-types'
import { revalidateHeaderTag } from '@/utilities/revalidateHeaderTag'

export const revalidateProductCategory: CollectionAfterChangeHook<ProductCategory> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header after product category change: ${doc.id}`)
    revalidateHeaderTag()
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
  }

  return doc
}
