import type { RequiredDataFromCollectionSlug } from 'payload'

export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'none',
  },
  meta: {
    description: 'Cargo control solutions for marine, outdoor, and off-road transport programs.',
    title: 'Pioneers | Cargo Control Solutions',
  },
  title: 'Home',
  layout: [
    {
      blockName: 'Homepage Fullscreen Hero',
      blockType: 'fullscreenHero',
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
    {
      blockName: 'Homepage Applications Nav',
      blockType: 'homeApplicationsNav',
    },
    {
      blockName: 'Homepage Trust Signals',
      blockType: 'homeTrustSignals',
    },
    {
      blockName: 'Homepage Closing CTA',
      blockType: 'homeClosingCta',
    },
  ],
}
