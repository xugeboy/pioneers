import type { Block } from 'payload'

export const GoogleMapLocation: Block = {
  slug: 'googleMapLocation',
  interfaceName: 'GoogleMapLocationBlock',
  labels: {
    plural: 'Google Map Locations',
    singular: 'Google Map Location',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'placeName',
          type: 'text',
          defaultValue: 'Kinedyne - Prattville',
          required: true,
        },
        {
          name: 'height',
          type: 'select',
          defaultValue: 'standard',
          options: [
            {
              label: 'Compact',
              value: 'compact',
            },
            {
              label: 'Standard',
              value: 'standard',
            },
            {
              label: 'Tall',
              value: 'tall',
            },
          ],
          required: true,
        },
      ],
    },
    {
      name: 'address',
      type: 'textarea',
      defaultValue: '1104 Washington Ferry Rd, Prattville, AL 36067, USA',
      required: true,
    },
    {
      name: 'embedUrl',
      type: 'text',
      admin: {
        description:
          'Optional Google Maps embed URL. Leave blank to auto-generate from the place name and address.',
      },
    },
  ],
}
