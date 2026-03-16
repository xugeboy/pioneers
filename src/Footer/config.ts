import type { GlobalConfig } from 'payload'

import { isAdmin } from '@/access/isAdmin'
import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
          requireHref: false,
        }),
        {
          name: 'subItems',
          type: 'array',
          admin: {
            initCollapsed: true,
          },
          fields: [
            link({
              appearances: false,
            }),
          ],
          maxRows: 8,
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
