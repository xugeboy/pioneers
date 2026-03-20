import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import type { Product } from '@/payload-types'
import { revalidateHeaderTag } from '@/utilities/revalidateHeaderTag'

export const revalidateProduct: CollectionAfterChangeHook<Product> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header after product change: ${doc.id}`)
    revalidateHeaderTag()
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
  }

  return doc
}
