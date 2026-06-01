import Link from 'next/link'
import React from 'react'

import { Media } from '@/components/Media'
import type { Blog } from '@/payload-types'
import { BLOG_FEATURED_LIMIT, getLatestPublishedBlogs } from '@/utilities/queryBlogs'

type LatestBlogPreview = Pick<
  Blog,
  'id' | 'slug' | 'title' | 'categories' | 'heroImage' | 'meta' | 'publishedAt'
>

type Props = {
  blogs?: LatestBlogPreview[]
  id?: string
}

export const LatestBlogsBlock: React.FC<Props> = async ({ blogs: blogsFromProps, id }) => {
  const blogs = blogsFromProps || (await getLatestPublishedBlogs(BLOG_FEATURED_LIMIT))

  if (!blogs.length) return null

  const [featuredBlog, ...secondaryBlogs] = blogs
  const hasSecondaryBlogs = secondaryBlogs.length > 0

  return (
    <section className="container" id={id ? `block-${id}` : undefined}>
      <div
        className={
          hasSecondaryBlogs ? 'grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.9fr)]' : ''
        }
      >
        <Link className="group block overflow-hidden" href={`/blogs/${featuredBlog.slug}`}>
          <div className="relative aspect-video overflow-hidden bg-white">
            {featuredBlog.heroImage && typeof featuredBlog.heroImage === 'object' ? (
              <Media
                fill
                priority
                className="h-full"
                imgClassName="h-full w-full object-contain"
                resource={featuredBlog.heroImage}
              />
            ) : featuredBlog.meta?.image && typeof featuredBlog.meta.image === 'object' ? (
              <Media
                fill
                priority
                className="h-full"
                imgClassName="h-full w-full object-contain"
                resource={featuredBlog.meta.image}
              />
            ) : null}

            <div className="absolute inset-x-0 bottom-0 bg-muted/72 px-5 py-4 backdrop-blur-sm md:px-8 md:py-6">
              <div className="space-y-3">
                {featuredBlog.publishedAt ? (
                  <time
                    className="block text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground"
                    dateTime={featuredBlog.publishedAt}
                  >
                    {formatFeaturedBlogDate(featuredBlog.publishedAt)}
                  </time>
                ) : null}
                <h3 className="font-display text-[1.18rem] leading-[1.16] text-[#162019] transition-colors group-hover:text-primary md:text-[2.1rem] md:leading-tight">
                  {featuredBlog.title}
                </h3>
                {featuredBlog.meta?.description ? (
                  <p className="hidden max-w-3xl text-sm leading-6 text-[#4a5650] md:block md:text-base md:leading-7">
                    {truncateFeaturedDescription(featuredBlog.meta.description)}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </Link>

        {hasSecondaryBlogs ? (
          <div className="flex flex-col">
            {secondaryBlogs.map((blog) => (
              <Link
                className="group grid grid-cols-[7rem_minmax(0,1fr)] gap-4 border-b border-border py-4 first:pt-0"
                href={`/blogs/${blog.slug}`}
                key={blog.id}
              >
                <div className="relative aspect-video overflow-hidden bg-white">
                  {blog.heroImage && typeof blog.heroImage === 'object' ? (
                    <Media
                      fill
                      className="h-full"
                      imgClassName="h-full w-full object-contain"
                      resource={blog.heroImage}
                    />
                  ) : blog.meta?.image && typeof blog.meta.image === 'object' ? (
                    <Media
                      fill
                      className="h-full"
                      imgClassName="h-full w-full object-contain"
                      resource={blog.meta.image}
                    />
                  ) : null}
                </div>
                <div className="space-y-2">
                  {blog.publishedAt ? (
                    <time
                      className="block text-[11px] uppercase tracking-[0.22em] text-muted-foreground"
                      dateTime={blog.publishedAt}
                    >
                      {formatFeaturedBlogDate(blog.publishedAt)}
                    </time>
                  ) : null}
                  <h3 className="text-lg font-medium text-[#162019] transition-colors group-hover:text-primary">
                    {blog.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}

function formatFeaturedBlogDate(timestamp: string): string {
  const date = new Date(timestamp)
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date).toUpperCase()
  const day = new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(date)
  const year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(date)

  return `${month} ${day}, ${year}`
}

function truncateFeaturedDescription(value?: string | null): string {
  if (!value) return ''

  const sanitized = value.replace(/\s+/g, ' ').trim()
  if (sanitized.length <= 220) return sanitized

  return `${sanitized.slice(0, 217).trimEnd()}...`
}
