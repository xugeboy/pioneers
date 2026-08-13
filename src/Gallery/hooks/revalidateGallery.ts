import type { GlobalAfterChangeHook } from 'payload'

import { safeRevalidatePath, safeRevalidateTag } from '@/utilities/safeRevalidate'

export const revalidateGallery: GlobalAfterChangeHook = ({ doc, req: { context, payload } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating gallery')
    safeRevalidateTag('global_gallery', payload.logger)
    safeRevalidatePath('/gallery', payload.logger)
  }

  return doc
}
