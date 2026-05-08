import type { Block } from 'payload'

export const FeaturedProductsCarousel: Block = {
  slug: 'featuredProductsCarousel',
  interfaceName: 'FeaturedProductsCarouselBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Featured Products',
      required: true,
    },
  ],
  labels: {
    plural: 'Featured Products Carousels',
    singular: 'Featured Products Carousel',
  },
}
