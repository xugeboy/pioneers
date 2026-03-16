import type { CollectionConfig } from 'payload'

import { adminOrSelf } from '../../access/adminOrSelf'
import { isAdmin } from '../../access/isAdmin'
import { USER_ROLES, isAdminUser, isEditorOrAdminUser } from '../../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req }) => isEditorOrAdminUser(req.user),
    create: async ({ req }) => {
      if (isAdminUser(req.user)) return true

      const { totalDocs } = await req.payload.count({
        collection: 'users',
        where: {},
      })

      return totalDocs === 0
    },
    delete: isAdmin,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    hidden: ({ user }) => !isAdminUser(user),
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        read: ({ req: { user }, doc }) => {
          return isAdminUser(user) || user?.id === doc?.id
        },
        update: ({ req: { user } }) => {
          return isAdminUser(user)
        },
      },
      defaultValue: ['editor'],
      hasMany: true,
      options: [...USER_ROLES],
      required: true,
      saveToJWT: true,
    },
  ],
  timestamps: true,
}
