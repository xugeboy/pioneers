import type { Block } from 'payload'

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

export const FAQAccordion: Block = {
  slug: 'faqAccordion',
  interfaceName: 'FAQAccordionBlock',
  fields: [
    {
      name: 'openFirstItem',
      type: 'checkbox',
      defaultValue: true,
      label: 'Open First Item by Default',
    },
    {
      name: 'items',
      type: 'array',
      label: 'FAQ Items',
      labels: {
        plural: 'FAQ Items',
        singular: 'FAQ Item',
      },
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Question',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          label: 'Answer',
          required: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
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
              ]
            },
          }),
        },
      ],
    },
  ],
  labels: {
    plural: 'FAQ Accordions',
    singular: 'FAQ Accordion',
  },
}
