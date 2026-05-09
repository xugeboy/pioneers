export const aboutMedia = {
  closing: {
    alt: 'Pioneers Gears support and contact team',
    url: 'https://cdn.pioneersgears.com/images/prodcutshows.webp',
  },
  advantages: [
    {
      alt: 'Cargo restraint assembly detail for application-led engineering',
      url: 'https://cdn.pioneersgears.com/images/right products.webp',
    },
    {
      alt: 'Finished hardware and strap detail for specification review',
      url: 'https://cdn.pioneersgears.com/images/clear planning.webp',
    },
    {
      alt: 'Pioneers Gears team aligning around customer program needs',
      url: 'https://cdn.pioneersgears.com/images/multi_stock.webp',
    },
  ],
  hero: {
    alt: 'Pioneers Gears leadership and operations team',
    url: 'https://cdn.pioneersgears.com/images/abouthero.webp',
  },
  profile: {
    alt: 'Pioneers Gears leadership and operations team',
    url: 'https://cdn.pioneersgears.com/images/Xiangle%20Team.webp',
  },
} as const

export const aboutHeroContent = {
  image: aboutMedia.hero,
  summary:
    'Driven by practical engineering and dependable production, we provide cargo securing and outdoor gear solutions for brands and buyers who need products that are clear to specify, easy to launch, and built for real use.',
  titleLineOne: 'RUGGED BY PURPOSE,',
  titleLineTwo: 'CLEAR BY DESIGN.',
} as const

export const aboutCompanyProfileContent = {
  body: [
    'Pioneers Gears has grown from a focused tie-down manufacturer into a reliable partner for outdoor, overlanding, cargo control, and custom restraint products. We supply practical, durable gear for brands and buyers who need consistency from development through delivery.',
    'Our work is built around real use, clear communication, and dependable production. From material selection and sampling to quality checks and packing, we help customers shape product programs that are easier to launch, repeat, and trust.',
  ],
  image: aboutMedia.profile,
  title: 'About Us',
} as const

export const aboutAdvantageContent = {
  cards: [
    {
      image: aboutMedia.advantages[0],
      title: 'Right Product, Right Fit',
      points: [
        'Application-led product selection',
        'Factory-direct production',
        'Custom solution support',
      ],
    },
    {
      image: aboutMedia.advantages[1],
      title: 'Clear Planning, Faster Response',
      points: ['Fast project review', 'Clear quotation process', 'Flexible OEM / ODM support'],
    },
    {
      image: aboutMedia.advantages[2],
      title: 'Reliable Supply, Built to Scale',
      points: [
        'Stable quality control',
        'Consistent production capacity',
        'On-time delivery support',
      ],
    },
  ],
  summary:
    'Our production and support teams help customers keep projects on track. Tell us what you need, and we will help you find the right product path for your application.',
  summaryTitle: 'High-quality products, when you need them',
  title: 'The Pioneers Gears Advantage',
} as const

export const aboutClosingCtaContent = {
  body: 'View our product catalog and use our quick quote builder to expedite your free estimate, or contact us today to speak with one of our product specialists.',
  image: aboutMedia.closing,
  primaryHref: '/request-quote',
  primaryLabel: 'Contact A Specialist',
  title: 'Contact Us Today',
} as const
