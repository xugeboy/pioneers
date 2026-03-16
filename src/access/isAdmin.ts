import type { Access } from 'payload'

import { isAdminUser } from './roles'

export const isAdmin: Access = ({ req: { user } }) => {
  return isAdminUser(user)
}
