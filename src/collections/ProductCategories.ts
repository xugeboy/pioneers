import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { isAdmin } from '../access/isAdmin'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'
import {
  revalidateDeleteProductCategory,
  revalidateProductCategory,
} from './ProductCategories/hooks/revalidateProductCategory'

export const ProductCategories: CollectionConfig<'product-categories'> = {
  slug: 'product-categories',
  access: {
    create: isEditorOrAdmin,
    delete: isAdmin,
    read: anyone,
    update: isEditorOrAdmin,
  },
  admin: {
    defaultColumns: ['title', 'sortOrder', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'showInMegaNav',
      type: 'checkbox',
      label: 'Show top-level category in header mega menu',
      defaultValue: false,
      admin: {
        description:
          'Used by the website header mega menu. Only top-level categories are rendered even if a child category is checked.',
        position: 'sidebar',
      },
    },
    {
      name: 'megaNavHotProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      maxRows: 5,
      admin: {
        description:
          'Optional curated products for the header mega menu. If left empty, the website automatically falls back to featured and recent products from this category tree.',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateProductCategory],
    afterDelete: [revalidateDeleteProductCategory],
  },
}
