import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'
import {
  BlocksFeature,
  ChecklistFeature,
  EXPERIMENTAL_TableFeature,
  FixedToolbarFeature,
  HeadingFeature,
  IndentFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { MediaBlock } from '@/blocks/MediaBlock/config'
import { anyone } from '../access/anyone'
import { isAdmin } from '../access/isAdmin'
import {
  revalidateDeleteProductCategory,
  revalidateProductCategory,
} from './ProductCategories/hooks/revalidateProductCategory'

const pillarRichTextEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures,
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    IndentFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    ChecklistFeature(),
    EXPERIMENTAL_TableFeature(),
    BlocksFeature({ blocks: [MediaBlock] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
  ],
})

export const ProductCategories: CollectionConfig<'product-categories'> = {
  slug: 'product-categories',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: anyone,
    update: isAdmin,
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
      name: 'pillarContent',
      type: 'richText',
      editor: pillarRichTextEditor,
      label: 'Pillar Content',
      admin: {
        description:
          'Long-form SEO content for this category page. Use this for scenario expertise, sourcing notes, and buyer education.',
      },
    },
    {
      name: 'oemCapabilities',
      type: 'group',
      label: 'OEM/ODM Capabilities',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
        },
        {
          name: 'introRichText',
          type: 'richText',
          editor: pillarRichTextEditor,
          label: 'Intro Rich Text',
          admin: {
            description:
              'Use this for richer OEM/ODM content with headings, media, lists, and tables. If filled, it is shown instead of the plain Intro field.',
          },
        },
        {
          name: 'items',
          type: 'array',
          label: 'Capability Items',
          maxRows: 8,
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
          ],
        },
      ],
    },
    {
      name: 'qualityHighlights',
      type: 'group',
      label: 'Materials & Quality Highlights',
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
        },
        {
          name: 'intro',
          type: 'textarea',
          label: 'Intro',
        },
        {
          name: 'items',
          type: 'array',
          label: 'Highlight Items',
          maxRows: 8,
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
          ],
        },
      ],
    },
    {
      name: 'relatedBlogs',
      type: 'relationship',
      relationTo: 'blogs',
      hasMany: true,
      maxRows: 6,
      label: 'Related Guides & Insights',
      admin: {
        description:
          'Manually select supporting blog posts for this category pillar page. Leave empty to hide the section.',
      },
    },
    {
      name: 'faqItems',
      type: 'array',
      label: 'FAQ Items',
      maxRows: 8,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          editor: pillarRichTextEditor,
          required: true,
        },
      ],
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
