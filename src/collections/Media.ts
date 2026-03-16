import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { isAdmin } from '../access/isAdmin'
import { isEditorOrAdmin } from '../access/isEditorOrAdmin'
import { getMediaUrl } from '@/utilities/getMediaUrl'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  folders: true,
  access: {
    create: isEditorOrAdmin,
    delete: isAdmin,
    read: anyone,
    update: isEditorOrAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: ({ doc }) => {
      const thumbnailURL =
        typeof doc?.sizes === 'object' &&
        doc?.sizes &&
        'thumbnail' in doc.sizes &&
        typeof doc.sizes.thumbnail === 'object' &&
        doc.sizes.thumbnail &&
        'url' in doc.sizes.thumbnail
          ? doc.sizes.thumbnail.url
          : null

      if (typeof thumbnailURL === 'string' && thumbnailURL) {
        return getMediaUrl(thumbnailURL)
      }

      return typeof doc?.url === 'string' ? getMediaUrl(doc.url) : null
    },
    focalPoint: true,
    formatOptions: {
      format: 'webp',
      options: {
        quality: 82,
      },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
        formatOptions: {
          format: 'webp',
          options: {
            quality: 76,
          },
        },
      },
      {
        name: 'square',
        width: 500,
        height: 500,
        formatOptions: {
          format: 'webp',
          options: {
            quality: 80,
          },
        },
      },
      {
        name: 'small',
        width: 600,
        formatOptions: {
          format: 'webp',
          options: {
            quality: 80,
          },
        },
      },
      {
        name: 'medium',
        width: 900,
        formatOptions: {
          format: 'webp',
          options: {
            quality: 82,
          },
        },
      },
      {
        name: 'large',
        width: 1400,
        formatOptions: {
          format: 'webp',
          options: {
            quality: 82,
          },
        },
      },
      {
        name: 'xlarge',
        width: 1920,
        formatOptions: {
          format: 'webp',
          options: {
            quality: 84,
          },
        },
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        formatOptions: {
          format: 'jpeg',
          options: {
            mozjpeg: true,
            quality: 86,
          },
        },
      },
    ],
  },
}
