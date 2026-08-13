import React from 'react'

import type { Gallery, GalleryMasonryBlock as GalleryMasonryBlockProps, Media } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

import { GalleryMasonryClient } from './GalleryMasonry.client'

const GALLERY_PAGE_SIZE = 18

const isResolvedMedia = (image: number | Media | null | undefined): image is Media =>
  Boolean(image && typeof image === 'object' && 'url' in image)

export const GalleryMasonryBlock: React.FC<
  GalleryMasonryBlockProps & { disableInnerContainer?: boolean }
> = async () => {
  const gallery = (await getCachedGlobal('gallery', 1)()) as Gallery
  const items = (gallery.items || []).filter(
    (item): item is NonNullable<Gallery['items']>[number] & { image: Media } =>
      item.visible !== false && isResolvedMedia(item.image),
  )

  if (!items.length) return null

  return (
    <section aria-label="Product and production gallery" className="bg-white p-2 sm:p-3 lg:p-4">
      <GalleryMasonryClient
        initialItems={items.slice(0, GALLERY_PAGE_SIZE)}
        pageSize={GALLERY_PAGE_SIZE}
        totalItems={items.length}
      />
    </section>
  )
}
