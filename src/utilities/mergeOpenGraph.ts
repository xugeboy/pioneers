import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Application-driven cargo control and mobility restraint solutions for OEM and ODM programs.',
  siteName: 'China 16+ years OEM Factory',
  title: 'China 16+ years OEM Factory',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
  }
}
