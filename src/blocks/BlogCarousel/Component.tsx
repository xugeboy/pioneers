import React from 'react'

import type { BlogCarouselBlock as BlogCarouselBlockProps } from '@/payload-types'

import { BlogCarouselClient } from './Component.client'
import { BLOG_CAROUSEL_LIMIT, getRecentlyUpdatedBlogs } from '@/utilities/queryBlogs'

export const BlogCarouselBlock: React.FC<
  BlogCarouselBlockProps & { disableInnerContainer?: boolean }
> = async ({ title }) => {
  const blogs = await getRecentlyUpdatedBlogs(BLOG_CAROUSEL_LIMIT)

  if (!blogs.length) return null

  return <BlogCarouselClient blogs={blogs} title={title} />
}
