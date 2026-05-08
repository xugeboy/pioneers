import type { MetadataRoute } from 'next'

import { getSiteSitemap } from '@/utilities/sitemap'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return getSiteSitemap()
}
