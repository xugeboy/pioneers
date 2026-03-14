import type { RequiredDataFromCollectionSlug } from 'payload'

// Used for pre-seeded content so that the homepage is not empty
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'none',
  },
  meta: {
    description: 'An open-source website built with Payload and Next.js.',
    title: 'Payload Website Template',
  },
  title: 'Home',
  layout: [
    {
      blockName: 'Homepage Fullscreen Hero',
      blockType: 'fullscreenHero',
      description: "Don't let the size fool you. Industrial performance in a pocket-sized form factor.",
      eyebrow: 'Ergonomic Engineering',
      featureCards: [
        {
          description: 'Simple trigger mechanism for effortless use.',
          title: 'One-Hand Operation',
        },
        {
          description: 'Ready when you are, wherever you go.',
          title: 'Tactical Portability',
        },
      ],
      links: [
        {
          link: {
            appearance: 'default',
            label: 'Explore Products',
            type: 'custom',
            url: '/products',
          },
        },
        {
          link: {
            appearance: 'outline',
            label: 'Get in Touch',
            type: 'custom',
            url: '/contact',
          },
        },
      ],
      title: 'Fits In\nYour Palm',
    },
  ],
}
