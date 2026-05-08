import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const FullscreenHero: Block = {
  slug: 'fullscreenHero',
  interfaceName: 'FullscreenHeroBlock',
  fields: [
    {
      name: 'title',
      type: 'textarea',
      defaultValue: 'Fits In Your Palm',
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
  ],
  labels: {
    plural: 'Fullscreen Heroes',
    singular: 'Fullscreen Hero',
  },
}
