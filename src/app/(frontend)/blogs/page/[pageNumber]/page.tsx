import type { Metadata } from 'next/types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CollectionArchive } from '@/components/CollectionArchive'
import { JsonLd } from '@/components/JsonLd'
import { Pagination } from '@/components/Pagination'
import { getBreadcrumbJsonLd, getCollectionPageJsonLd } from '@/utilities/jsonLd'
import {
  BLOG_ARCHIVE_PAGE_SIZE,
  getBlogArchivePage,
  getLatestPublishedBlogs,
} from '@/utilities/queryBlogs'
import { notFound } from 'next/navigation'
import React from 'react'

import PageClient from './page.client'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const sanitizedPageNumber = Number(pageNumber)

  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const latestBlogs = await getLatestPublishedBlogs(1)
  const excludedIDs = latestBlogs.map((blog) => blog.id)
  const archiveBlogs = await getBlogArchivePage({
    excludeIDs: excludedIDs,
    page: sanitizedPageNumber,
  })
  const pagePath = `/blogs/page/${sanitizedPageNumber}`
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/blogs', label: 'Blogs' },
    { label: `Page ${sanitizedPageNumber}` },
  ]

  return (
    <div className="pt-[68px] md:pt-24">
      <JsonLd
        data={[
          getCollectionPageJsonLd({
            items: archiveBlogs.docs.map((blog) => ({
              name: blog.title,
              url: `/blogs/${blog.slug}`,
            })),
            name: `PioneersGears Blog Page ${sanitizedPageNumber}`,
            path: pagePath,
          }),
          getBreadcrumbJsonLd(breadcrumbItems, pagePath),
        ]}
      />
      <PageClient />
      <Breadcrumbs items={breadcrumbItems} />
      <div className="container mb-12">
        <h1 className="font-display text-3xl text-[#162019] md:text-4xl">Blogs</h1>
      </div>

      <CollectionArchive blogs={archiveBlogs.docs} />

      <div className="container">
        {archiveBlogs.page && archiveBlogs.totalPages > 1 ? (
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

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise

  return {
    title: `China 16+ years OEM Factory Blogs Page ${pageNumber || ''}`,
  }
}

export async function generateStaticParams() {
  const latestBlogs = await getLatestPublishedBlogs(1)
  const excludedIDs = latestBlogs.map((blog) => blog.id)
  const firstArchivePage = await getBlogArchivePage({ excludeIDs: excludedIDs, page: 1 })
  const totalPages = Math.ceil(firstArchivePage.totalDocs / BLOG_ARCHIVE_PAGE_SIZE)

  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
