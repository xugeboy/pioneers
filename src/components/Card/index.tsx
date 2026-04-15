'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React from 'react'

import type { Blog } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardBlogData = Pick<
  Blog,
  'slug' | 'categories' | 'heroImage' | 'meta' | 'publishedAt' | 'title'
>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardBlogData
  relationTo?: 'blogs'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, title: titleFromProps } = props

  const { slug, heroImage, meta, publishedAt, title } = doc || {}
  const { description, image: metaImage } = meta || {}
  const imageToUse =
    heroImage && typeof heroImage !== 'string'
      ? heroImage
      : metaImage && typeof metaImage !== 'string'
        ? metaImage
        : null

  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s+/g, ' ').trim()
  const href = `/${relationTo}/${slug}`
  const formattedDate = publishedAt ? formatBlogCardDate(publishedAt) : null

  return (
    <article
      className={cn(
        'overflow-hidden bg-white text-[#162019] transition-opacity hover:cursor-pointer hover:opacity-90',
        className,
      )}
      ref={card.ref}
    >
      <Link className="relative block" href={href} ref={link.ref}>
        {imageToUse ? (
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <Media
              fill
              resource={imageToUse}
              size="33vw"
              imgClassName="h-full w-full object-cover"
            />
          </div>
        ) : null}
      </Link>

      <div className="px-4 pb-2 pt-5 text-center md:px-5">
        {titleToUse ? (
          <h3 className="font-display text-[1.2rem] leading-tight text-[#162019] md:text-[1.35rem]">
            <Link className="transition-opacity hover:opacity-70" href={href}>
              {titleToUse}
            </Link>
          </h3>
        ) : null}

        {formattedDate ? (
          <div className="mx-auto mt-4 max-w-[12rem] border-t border-[#d8c7a8] pt-2 text-[12px] font-medium uppercase tracking-[0.24em] text-[#b6aa96]">
            <time dateTime={publishedAt ?? undefined}>{formattedDate}</time>
          </div>
        ) : null}

        {description ? (
          <p className="mt-4 text-left text-[16px] leading-7 text-[#3d4751]">
            {truncateDescription(sanitizedDescription)}
          </p>
        ) : null}

        <div className="mt-4 pb-2">
          <Link
            className="inline-flex items-center justify-center text-[13px] font-semibold uppercase tracking-[0.18em] text-[#162019] transition-opacity hover:opacity-70"
            href={href}
          >
            View More
          </Link>
        </div>
      </div>
    </article>
  )
}

function formatBlogCardDate(timestamp: string): string {
  const date = new Date(timestamp)
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date).toUpperCase()
  const day = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(date)
  const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date)

  return `${month} ${day}, ${year}`
}

function truncateDescription(value?: string | null): string {
  if (!value) return ''
  if (value.length <= 130) return value

  return `${value.slice(0, 127).trimEnd()}...`
}
