'use client'

import Link from 'next/link'
import React from 'react'

import type { Blog } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { ContentCarousel } from '@/components/ContentCarousel'
import { Media } from '@/components/Media'

type BlogCarouselPreview = Pick<
  Blog,
  'id' | 'title' | 'slug' | 'heroImage' | 'meta' | 'publishedAt' | 'updatedAt'
>

type Props = {
  blogs: BlogCarouselPreview[]
  title: string
}

export const BlogCarouselClient: React.FC<Props> = ({ blogs, title }) => {
  return (
    <ContentCarousel itemSelector="[data-blog-carousel-card='true']" title={title}>
      {blogs.map((blog) => (
        <BlogCarouselCard blog={blog} key={blog.id} />
      ))}
    </ContentCarousel>
  )
}

const BlogCarouselCard: React.FC<{ blog: BlogCarouselPreview }> = ({ blog }) => {
  const image = typeof blog.heroImage === 'object' ? blog.heroImage : blog.meta?.image
  const date = blog.publishedAt || blog.updatedAt

  return (
    <article
      className="group flex w-[17rem] shrink-0 snap-start flex-col text-center sm:w-[18rem] lg:w-[19rem]"
      data-blog-carousel-card="true"
    >
      <Link
        className="relative block aspect-video overflow-hidden bg-white"
        href={`/blogs/${blog.slug}`}
      >
        {image && typeof image === 'object' ? (
          <Media
            fill
            imgClassName="h-full w-full object-contain"
            resource={image}
            size="(max-width: 768px) 75vw, 320px"
          />
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col items-center">
        {date ? (
          <time
            className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#6e7c72]"
            dateTime={date}
          >
            {formatCarouselDate(date)}
          </time>
        ) : null}

        <h3 className="mt-3 line-clamp-3 min-h-[4.5rem] font-industrial text-xl font-bold uppercase leading-tight text-[#101914]">
          <Link className="transition-colors hover:text-[#00A650]" href={`/blogs/${blog.slug}`}>
            {blog.title}
          </Link>
        </h3>

        <Button
          asChild
          className="mt-5 h-12 rounded-md bg-[#00A650] px-9 font-industrial text-xl font-bold uppercase text-white hover:bg-[#008f45]"
          size="clear"
        >
          <Link href={`/blogs/${blog.slug}`}>Read More</Link>
        </Button>
      </div>
    </article>
  )
}

function formatCarouselDate(timestamp: string): string {
  const date = new Date(timestamp)
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date).toUpperCase()
  const day = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(date)
  const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date)

  return `${month} ${day}, ${year}`
}
