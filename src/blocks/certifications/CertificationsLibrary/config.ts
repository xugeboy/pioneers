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
              relationTo: 'files',
              required: true,
            },
            {
              name: 'previewImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Preview Image',
              admin: {
                description: 'Image shown on the website, such as the first page of the PDF.',
              },
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
