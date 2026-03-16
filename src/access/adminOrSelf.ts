import type { Access } from 'payload'

import { isAdminUser } from './roles'

export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false

  if (isAdminUser(user)) return true

  return {
    id: {
      equals: user.id,
    },
  }
}
