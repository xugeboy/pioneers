import type { RequiredDataFromCollectionSlug } from 'payload'

import type { Media } from '@/payload-types'

type HomeArgs = {
  heroImage: Media
  metaImage: Media
}

export const home: (args: HomeArgs) => RequiredDataFromCollectionSlug<'pages'> = ({
  heroImage,
  metaImage,
}) => {
  return {
    slug: 'home',
    _status: 'published',
    hero: {
      type: 'none',
    },
    layout: [
      {
        blockName: 'Homepage Fullscreen Hero',
        blockType: 'fullscreenHero',
        backgroundImage: heroImage.id,
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
        blockName: 'Homepage Product Families',
        blockType: 'homeProductFamilies',
      },
      {
        blockName: 'Homepage Strengths',
        blockType: 'homeStrengths',
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
    meta: {
      description: 'Cargo control solutions for marine, outdoor, and off-road transport programs.',
      image: metaImage.id,
      title: 'Pioneers | Cargo Control Solutions',
    },
    title: 'Home',
  }
}
