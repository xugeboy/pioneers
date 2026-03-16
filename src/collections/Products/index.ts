import type { CollectionConfig, CollectionSlug } from 'payload'

import { slugField } from 'payload'

import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { isAdmin } from '../../access/isAdmin'
import { isEditorOrAdmin } from '../../access/isEditorOrAdmin'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'

export const Products: CollectionConfig<'products'> = {
  slug: 'products',
  access: {
    create: isEditorOrAdmin,
    delete: isAdmin,
    read: authenticatedOrPublished,
    update: isEditorOrAdmin,
  },
  admin: {
    defaultColumns: ['title', 'model', '_status', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'model',
      type: 'text',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Summary',
    },
    {
      name: 'primaryImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'secondaryImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      label: 'Featured Product',
      admin: {
        position: 'sidebar',
      },
      defaultValue: false,
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Product Description',
    },
    {
      name: 'customLayout',
      type: 'blocks',
      label: 'Custom Layout',
      admin: {
        initCollapsed: true,
      },
      blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock],
    },
    {
      name: 'gallery',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
    {
      name: 'specs',
      type: 'array',
      label: 'Specification Table',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'video',
      type: 'group',
      label: 'Video',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'url',
          options: [
            { label: 'Video URL', value: 'url' },
            { label: 'Upload Video', value: 'upload' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'url',
          },
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'videos' as CollectionSlug,
          admin: {
            condition: (_data, siblingData) => siblingData?.type === 'upload',
          },
        },
      ],
    },
    {
      name: 'attachments',
      type: 'array',
      label: 'Attachments',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'files',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
