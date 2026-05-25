import type { Metadata } from 'next/types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CollectionArchive } from '@/components/CollectionArchive'
import type { CardBlogData } from '@/components/Card'
import { PageRange } from '@/components/PageRange'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'

type Args = {
  searchParams: Promise<{
    q?: string
    page?: string
  }>
}

export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query, page } = await searchParamsPromise
  const sanitizedQuery = (query || '').trim()
  const sanitizedPage = Number(page || '1')
  const currentPage = Number.isInteger(sanitizedPage) && sanitizedPage > 0 ? sanitizedPage : 1
  const payload = await getPayload({ config: configPromise })

  const blogs = sanitizedQuery
    ? await payload.find({
        collection: 'search',
        depth: 1,
        limit: 12,
        page: currentPage,
        overrideAccess: false,
        select: {
          title: true,
          slug: true,
          categories: true,
          meta: true,
        },
        where: {
          or: [
            {
              title: {
                like: sanitizedQuery,
              },
            },
            {
              'meta.description': {
                like: sanitizedQuery,
              },
            },
            {
              'meta.title': {
                like: sanitizedQuery,
              },
            },
            {
              slug: {
                like: sanitizedQuery,
              },
            },
          ],
        },
      })
    : null

  return (
    <div className="pt-[68px] md:pt-24 pb-16 md:pb-24">
      <PageClient />
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'Search' }]} />

      <div className="container mb-12">
        <div className="max-w-3xl space-y-4">
          <p className="pioneers-kicker font-display">Site Search</p>
          <h1 className="font-display text-3xl md:text-4xl">Search Results</h1>
          <p className="max-w-2xl text-muted-foreground">
            {sanitizedQuery
              ? `Showing matches for "${sanitizedQuery}".`
              : 'Use the header search icon to search products, blogs, and pages.'}
          </p>
        </div>
      </div>

      {blogs ? (
        <div className="container mb-8">
          <PageRange
            collectionLabels={{ plural: 'Results', singular: 'Result' }}
            currentPage={blogs.page}
            emptyMessage="Search produced no results."
            limit={12}
            totalDocs={blogs.totalDocs}
          />
        </div>
      ) : null}

      {blogs && blogs.totalDocs > 0 ? (
        <CollectionArchive blogs={blogs.docs as CardBlogData[]} />
      ) : (
        <div className="container">
          <div className="rounded-[1.5rem] border border-border bg-card px-6 py-8 text-muted-foreground">
            {sanitizedQuery
              ? 'No results matched your search.'
              : 'No search has been submitted yet.'}
          </div>
        </div>
      )}

      {blogs && blogs.totalPages > 1 ? (
        <div className="container mt-12 flex items-center justify-center gap-4 text-sm">
          {currentPage > 1 ? (
            <Link
              className="rounded-full border border-border px-4 py-2 transition-colors hover:bg-muted"
              href={buildSearchHref(sanitizedQuery, currentPage - 1)}
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-full border border-border px-4 py-2 text-muted-foreground">
              Previous
            </span>
          )}
          <span className="text-muted-foreground">
            Page {currentPage} of {blogs.totalPages}
          </span>
          {currentPage < blogs.totalPages ? (
            <Link
              className="rounded-full border border-border px-4 py-2 transition-colors hover:bg-muted"
              href={buildSearchHref(sanitizedQuery, currentPage + 1)}
            >
              Next
            </Link>
          ) : (
            <span className="rounded-full border border-border px-4 py-2 text-muted-foreground">
              Next
            </span>
          )}
        </div>
      ) : null}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    ...generateMeta({
      doc: null,
      path: '/search',
      title: 'Search Results | Pioneers',
    }),
    robots: {
      follow: true,
      googleBot: {
        follow: true,
        index: false,
      },
      index: false,
    },
  }
}

const buildSearchHref = (query: string, page: number) => {
  const params = new URLSearchParams()

  if (query) params.set('q', query)
  if (page > 1) params.set('page', String(page))

  const qs = params.toString()

  return `/search${qs ? `?${qs}` : ''}`
}
