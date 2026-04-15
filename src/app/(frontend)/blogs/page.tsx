import type { Metadata } from 'next/types'

import { LatestBlogsBlock } from '@/blocks/LatestBlogs/Component'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CollectionArchive } from '@/components/CollectionArchive'
import { Pagination } from '@/components/Pagination'
import { getBlogArchivePage, getLatestPublishedBlogs } from '@/utilities/queryBlogs'
import React from 'react'

import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const latestBlogs = await getLatestPublishedBlogs(1)
  const excludedIDs = latestBlogs.map((blog) => blog.id)
  const archiveBlogs = await getBlogArchivePage({ excludeIDs: excludedIDs, page: 1 })

  return (
    <div className="pt-[68px] md:pt-24">
      <PageClient />
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'Blogs' }]} />
      <div className="container mb-12">
        <h1 className="font-display text-3xl text-[#162019] md:text-4xl">PioneersGears Blog</h1>
        <p className="mt-3 max-w-3xl text-base text-[#4b5b50] md:text-lg">
          Your Go-To Guide for Tie-Down Solutions, Safety Standards, and Gear Tips.
        </p>
      </div>

      <div className="mb-12 md:mb-16">
        <LatestBlogsBlock blogs={latestBlogs} />
      </div>

      <CollectionArchive blogs={archiveBlogs.docs} />

      <div className="container">
        {archiveBlogs.totalPages > 1 && archiveBlogs.page ? (
          <Pagination
            basePath="/blogs"
            page={archiveBlogs.page}
            totalPages={archiveBlogs.totalPages}
          />
        ) : null}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Payload Website Template Blogs',
  }
}
