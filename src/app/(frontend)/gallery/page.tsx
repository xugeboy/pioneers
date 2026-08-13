import type { Metadata } from 'next'
import React from 'react'

import type { Gallery, Media } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import { getCachedGlobal } from '@/utilities/getGlobals'

import { GalleryGrid } from './GalleryGrid.client'

export const dynamic = 'force-static'
export const revalidate = 600

const GALLERY_PAGE_SIZE = 18

const isResolvedMedia = (image: number | Media | null | undefined): image is Media =>
  Boolean(image && typeof image === 'object' && 'url' in image)

const getGallery = () => getCachedGlobal('gallery', 1)() as Promise<Gallery>

export default async function GalleryPage() {
  const gallery = await getGallery()
  const allItems = (gallery.items || []).filter(
    (item): item is NonNullable<Gallery['items']>[number] & { image: Media } =>
      item.visible !== false && isResolvedMedia(item.image),
  )

  return (
    <main className="bg-white pt-[68px] md:pt-24">
      <section aria-label="Production gallery" className="p-2 sm:p-3 lg:p-4">
        <GalleryGrid
          initialItems={allItems.slice(0, GALLERY_PAGE_SIZE)}
          pageSize={GALLERY_PAGE_SIZE}
          totalItems={allItems.length}
        />
      </section>
    </main>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const gallery = await getGallery()
  const firstVisibleImage = gallery.items?.find(
    (item) => item.visible !== false && isResolvedMedia(item.image),
  )?.image

  return generateMeta({
    description: gallery.metaDescription,
    doc: null,
    image: firstVisibleImage,
    path: '/gallery',
    title: gallery.metaTitle || 'Production Gallery | Pioneers',
  })
}
