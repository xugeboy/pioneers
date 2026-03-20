import type { Block } from 'payload'

const name = {
  name: 'name',
  type: 'text',
  label: 'Name (lowercase, no special characters)',
  required: true,
} as const

const label = {
  name: 'label',
  type: 'text',
  label: 'Label',
  localized: true,
} as const

const required = {
  name: 'required',
  type: 'checkbox',
  label: 'Required',
} as const

const width = {
  name: 'width',
  type: 'number',
  label: 'Field Width (percentage)',
} as const

export const phoneField: Block = {
  slug: 'phone',
  interfaceName: 'PhoneField',
  fields: [
    {
      type: 'row',
      fields: [
        {
          ...name,
          admin: {
            width: '50%',
          },
        },
        {
          ...label,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          ...width,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'defaultValue',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'Default Value',
          localized: true,
        },
      ],
    },
    {
      name: 'placeholder',
      type: 'text',
      label: 'Phone Placeholder',
      localized: true,
    },
    required,
  ],
  labels: {
    plural: 'Phone Fields',
    singular: 'Phone',
  },
}
