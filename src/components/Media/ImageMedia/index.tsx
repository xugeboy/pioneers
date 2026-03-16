'use client'

import type { StaticImageData } from 'next/image'

import React from 'react'

import type { Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/ui'
import { getMediaUrl } from '@/utilities/getMediaUrl'

import type { Props as MediaProps } from '../types'

const buildSrcSet = (resource: MediaType): string | undefined => {
  const variants = [
    ...(resource.url && resource.width
      ? [{ url: resource.url, width: resource.width, updatedAt: resource.updatedAt }]
      : []),
    ...Object.entries(resource.sizes || {}).flatMap(([name, size]) =>
      name !== 'og' && size?.url && size.width
        ? [{ url: size.url, width: size.width, updatedAt: resource.updatedAt }]
        : [],
    ),
  ]

  const uniqueVariants = Array.from(new Map(variants.map((item) => [item.width, item])).values()).sort(
    (a, b) => a.width - b.width,
  )

  if (uniqueVariants.length <= 1) return undefined

  return uniqueVariants.map((item) => `${getMediaUrl(item.url, item.updatedAt)} ${item.width}w`).join(', ')
}

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    pictureClassName,
    imgClassName,
    loading: loadingFromProps,
    onClick,
    onLoad,
    priority,
    ref,
    resource,
    size,
    src: srcFromProps,
  } = props

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''
  let srcSet: string | undefined

  if (!src && resource && typeof resource === 'object') {
    const { alt: altFromResource, height: fullHeight, url, width: fullWidth } = resource

    width = fullWidth || undefined
    height = fullHeight || undefined
    alt = altFromResource || ''

    src = getMediaUrl(url, resource.updatedAt)
    srcSet = buildSrcSet(resource)
  }

  const resolvedSrc = typeof src === 'string' ? src : src?.src
  const sizes = srcSet ? size || (fill ? '100vw' : width ? `${width}px` : undefined) : undefined

  if (!resolvedSrc) return null

  return (
    <picture className={cn(fill && 'block h-full w-full', pictureClassName)}>
      <img
        alt={alt || ''}
        className={cn(fill && 'absolute inset-0 h-full w-full', imgClassName)}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
        height={!fill ? height : undefined}
        loading={loadingFromProps || (!priority ? 'lazy' : undefined)}
        onClick={onClick}
        onLoad={onLoad}
        ref={ref as React.Ref<HTMLImageElement>}
        src={resolvedSrc}
        srcSet={srcSet}
        sizes={sizes}
        width={!fill ? width : undefined}
      />
    </picture>
  )
}
