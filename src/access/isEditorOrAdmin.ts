import type { Access } from 'payload'

import { isEditorOrAdminUser } from './roles'

export const isEditorOrAdmin: Access = ({ req: { user } }) => {
  return isEditorOrAdminUser(user)
}
