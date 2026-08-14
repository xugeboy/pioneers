import type { GlobalConfig } from 'payload'

import { isEditorOrAdmin } from '@/access/isEditorOrAdmin'
import { revalidateGallery } from './hooks/revalidateGallery'

export const Gallery: GlobalConfig = {
  slug: 'gallery',
  label: 'Gallery',
  access: {
    read: () => true,
    update: isEditorOrAdmin,
  },
  admin: {
    description: 'Manage the production images shown on the public Gallery page.',
    group: 'Website',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Gallery images',
          fields: [
            {
              name: 'items',
              type: 'array',
              admin: {
                components: {
                  Field: '@/components/GalleryManager',
                },
                description:
                  'Add images from the Media Library, drag to reorder them, and switch individual images on or off.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'visible',
                  type: 'checkbox',
                  admin: {
                    description:
                      'Turn this off to keep the image in CMS without showing it publicly.',
                  },
                  defaultValue: true,
                  label: 'Show on Gallery page',
                },
              ],
              labels: {
                plural: 'Gallery images',
                singular: 'Gallery image',
              },
              maxRows: 500,
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              defaultValue: 'Production Gallery | Pioneers',
              label: 'Meta title',
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              defaultValue:
                'Explore the production, people, materials, and manufacturing details behind Pioneers products.',
              label: 'Meta description',
              maxLength: 160,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGallery],
  },
}
