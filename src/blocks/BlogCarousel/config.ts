import type { Block } from 'payload'

export const BlogCarousel: Block = {
  slug: 'blogCarousel',
  interfaceName: 'BlogCarouselBlock',
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'Latest Blogs',
      required: true,
    },
  ],
  labels: {
    plural: 'Blog Carousels',
    singular: 'Blog Carousel',
  },
}
