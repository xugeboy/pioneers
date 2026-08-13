'use client'

import { ChevronLeft, ChevronRight, LoaderCircle, X } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { ImageMedia } from '@/components/Media/ImageMedia'
import type { Gallery, Media } from '@/payload-types'

export type GalleryItem = NonNullable<Gallery['items']>[number] & { image: Media }

type GalleryResponse = {
  docs: GalleryItem[]
  hasNextPage: boolean
  page: number
  totalDocs: number
}

export const GalleryMasonryClient: React.FC<{
  initialItems: GalleryItem[]
  pageSize: number
  totalItems: number
}> = ({ initialItems, pageSize, totalItems }) => {
  const [items, setItems] = useState(initialItems)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const hasNextPage = items.length < totalItems

  const loadNextPage = useCallback(async () => {
    if (isLoading || !hasNextPage) return

    setIsLoading(true)
    const nextPage = page + 1

    try {
      const response = await fetch(`/api/gallery?page=${nextPage}&limit=${pageSize}`, {
        cache: 'no-store',
      })

      if (!response.ok) throw new Error(`Gallery request failed with ${response.status}`)

      const result = (await response.json()) as GalleryResponse
      setItems((currentItems) => [...currentItems, ...result.docs])
      setPage(result.page)
    } catch (error) {
      console.error('Unable to load more gallery images.', error)
    } finally {
      setIsLoading(false)
    }
  }, [hasNextPage, isLoading, page, pageSize])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void loadNextPage()
      },
      { rootMargin: '1200px 0px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, loadNextPage])

  useEffect(() => {
    if (activeIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveIndex(null)
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) =>
          current === null ? null : (current - 1 + items.length) % items.length,
        )
      }
      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => (current === null ? null : (current + 1) % items.length))
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, items.length])

  const activeItem = activeIndex === null ? null : items[activeIndex]

  return (
    <>
      <div className="columns-2 gap-2 md:columns-3 lg:columns-4 2xl:columns-5">
        {items.map((item, index) => {
          const alt = item.image.alt || 'Pioneers production gallery image'

          return (
            <button
              aria-label={`Open ${alt}`}
              className="group relative mb-2 block w-full cursor-pointer break-inside-avoid overflow-hidden rounded-md bg-slate-100 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
              key={item.id || `${item.image.id}-${index}`}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <ImageMedia
                alt={alt}
                imgClassName="block h-auto w-full transition-opacity duration-200 group-hover:opacity-90 motion-reduce:transition-none"
                resource={item.image}
                size="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1535px) 25vw, 20vw"
              />
            </button>
          )
        })}
      </div>

      <div
        aria-hidden={!hasNextPage}
        className="flex h-24 items-center justify-center"
        ref={sentinelRef}
      >
        {isLoading ? (
          <LoaderCircle aria-label="Loading more images" className="size-6 animate-spin text-slate-400" />
        ) : null}
      </div>

      {activeItem ? (
        <div
          aria-label={activeItem.image.alt || 'Gallery image'}
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-3 backdrop-blur-sm md:p-8"
          onClick={() => setActiveIndex(null)}
          role="dialog"
        >
          <button
            aria-label="Close image preview"
            className="absolute right-4 top-4 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/30 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-7 md:top-7"
            onClick={() => setActiveIndex(null)}
            type="button"
          >
            <X className="size-5" />
          </button>

          {items.length > 1 ? (
            <>
              <button
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/30 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:left-7"
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveIndex((current) =>
                    current === null ? null : (current - 1 + items.length) % items.length,
                  )
                }}
                type="button"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 flex size-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/30 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-7"
                onClick={(event) => {
                  event.stopPropagation()
                  setActiveIndex((current) =>
                    current === null ? null : (current + 1) % items.length,
                  )
                }}
                type="button"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          ) : null}

          <div onClick={(event) => event.stopPropagation()}>
            <ImageMedia
              alt={activeItem.image.alt || 'Pioneers production gallery image'}
              imgClassName="max-h-[90vh] w-auto max-w-full rounded-md object-contain"
              priority
              resource={activeItem.image}
              size="92vw"
            />
          </div>
        </div>
      ) : null}
    </>
  )
}
