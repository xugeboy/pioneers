import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const FullscreenHero: Block = {
  slug: 'fullscreenHero',
  interfaceName: 'FullscreenHeroBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'Ergonomic Engineering',
      required: true,
    },
    {
      name: 'title',
      type: 'textarea',
      defaultValue: 'Fits In Your Palm',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        "Don't let the size fool you. Industrial performance in a pocket-sized form factor.",
      required: true,
    },
    linkGroup({
      appearances: ['default', 'outline'],
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'backgroundImage',
      type: 'upload',
      admin: {
        description:
          'Optional. If empty, the block falls back to the default Pioneers homepage artwork.',
      },
      relationTo: 'media',
    },
    {
      name: 'featureCards',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          required: true,
        },
      ],
      maxRows: 3,
    },
  ],
  labels: {
    plural: 'Fullscreen Heroes',
    singular: 'Fullscreen Hero',
  },
}
