import type { GlobalAfterChangeHook } from 'payload'

import { revalidateHeaderTag } from '@/utilities/revalidateHeaderTag'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)

    revalidateHeaderTag()
  }

  return doc
}
