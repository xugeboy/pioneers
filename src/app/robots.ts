import type { MetadataRoute } from 'next'

import { getSiteRobots } from '@/utilities/sitemap'

export default function robots(): MetadataRoute.Robots {
  return getSiteRobots()
}
