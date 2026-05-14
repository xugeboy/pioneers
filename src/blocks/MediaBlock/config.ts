import type { Block } from 'payload'
import type { CollectionSlug } from 'payload'

type MediaBlockSiblingData = {
  mediaType?: 'image' | 'youtube' | 'uploadVideo' | null
}

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'mediaType',
      type: 'select',
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'YouTube URL', value: 'youtube' },
        { label: 'Upload Video', value: 'uploadVideo' },
      ],
      required: true,
    },
    {
      name: 'media',
      type: 'upload',
      admin: {
        condition: (_data, siblingData) =>
          !siblingData?.mediaType || siblingData.mediaType === 'image',
      },
      relationTo: 'media',
      validate: (value: unknown, { siblingData }: { siblingData?: MediaBlockSiblingData }) => {
        if ((!siblingData?.mediaType || siblingData.mediaType === 'image') && !value) {
          return 'Please select an image.'
        }

        return true
      },
    },
    {
      name: 'videoURL',
      type: 'text',
      admin: {
        condition: (_data, siblingData) => siblingData?.mediaType === 'youtube',
      },
      label: 'YouTube URL',
      validate: (value: unknown, { siblingData }: { siblingData?: MediaBlockSiblingData }) => {
        if (siblingData?.mediaType === 'youtube' && !String(value || '').trim()) {
          return 'Please enter a YouTube URL.'
        }

        return true
      },
    },
    {
      name: 'videoFile',
      type: 'upload',
      admin: {
        condition: (_data, siblingData) => siblingData?.mediaType === 'uploadVideo',
      },
      label: 'Video File',
      relationTo: 'videos' as CollectionSlug,
      validate: (value: unknown, { siblingData }: { siblingData?: MediaBlockSiblingData }) => {
        if (siblingData?.mediaType === 'uploadVideo' && !value) {
          return 'Please select a video file.'
        }

        return true
      },
    },
  ],
}
