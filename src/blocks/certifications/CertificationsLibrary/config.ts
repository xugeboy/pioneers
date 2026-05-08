import type { Block } from 'payload'

export const CertificationsLibrary: Block = {
  slug: 'certLibrary',
  interfaceName: 'CertificationsLibraryBlock',
  fields: [
    {
      name: 'groups',
      type: 'array',
      label: 'Certificate Categories',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'items',
          type: 'array',
          minRows: 1,
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Display Name (optional)',
            },
            {
              name: 'file',
              type: 'relationship',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Certifications Library Blocks',
    singular: 'Certifications Library Block',
  },
}
