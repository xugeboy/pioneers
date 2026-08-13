import configPromise from '@payload-config'
import { getPayload } from 'payload'
import type { NextRequest } from 'next/server'

import type { Gallery, Media } from '@/payload-types'

const DEFAULT_PAGE_SIZE = 18
const MAX_PAGE_SIZE = 30

const isResolvedMedia = (image: number | Media | null | undefined): image is Media =>
  Boolean(image && typeof image === 'object' && 'url' in image)

const toPositiveInteger = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value || '', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export async function GET(request: NextRequest) {
  const page = toPositiveInteger(request.nextUrl.searchParams.get('page'), 1)
  const requestedLimit = toPositiveInteger(
    request.nextUrl.searchParams.get('limit'),
    DEFAULT_PAGE_SIZE,
  )
  const limit = Math.min(requestedLimit, MAX_PAGE_SIZE)
  const payload = await getPayload({ config: configPromise })
  const gallery = (await payload.findGlobal({
    slug: 'gallery',
    depth: 1,
    overrideAccess: false,
  })) as Gallery
  const items = (gallery.items || []).filter(
    (item): item is NonNullable<Gallery['items']>[number] & { image: Media } =>
      item.visible !== false && isResolvedMedia(item.image),
  )
  const start = (page - 1) * limit
  const docs = items.slice(start, start + limit)

  return Response.json(
    {
      docs,
      hasNextPage: start + docs.length < items.length,
      page,
      totalDocs: items.length,
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}
