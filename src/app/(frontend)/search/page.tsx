import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'
import { Input } from '@/components/ui/input'
import PageClient from './page.client'
import { CardPostData } from '@/components/Card'

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

  const posts = sanitizedQuery
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
        ...(sanitizedQuery
          ? {
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
            }
          : {}),
      })
    : null

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="max-w-2xl space-y-4">
          <p className="pioneers-kicker font-display">Search</p>
          <h1 className="font-display text-3xl md:text-4xl">搜索结果</h1>
          <form action="/search" method="get" className="flex flex-col gap-3 sm:flex-row">
            <Input
              name="q"
              placeholder="输入关键词"
              defaultValue={sanitizedQuery}
              className="h-11"
            />
            <button className="pioneers-btn pioneers-btn-primary" type="submit">
              搜索
            </button>
          </form>
        </div>
      </div>

      {posts && posts.totalDocs > 0 ? (
        <CollectionArchive posts={posts.docs as CardPostData[]} />
      ) : (
        <div className="container">未找到</div>
      )}

      {posts && posts.totalPages > 1 && (
        <div className="container mt-12 flex items-center justify-center gap-4 text-sm">
          {currentPage > 1 ? (
            <Link
              className="rounded-full border border-border px-4 py-2"
              href={buildSearchHref(sanitizedQuery, currentPage - 1)}
            >
              上一页
            </Link>
          ) : (
            <span className="rounded-full border border-border px-4 py-2 text-muted-foreground">
              上一页
            </span>
          )}
          <span className="text-muted-foreground">
            第 {currentPage} / {posts.totalPages} 页
          </span>
          {currentPage < posts.totalPages ? (
            <Link
              className="rounded-full border border-border px-4 py-2"
              href={buildSearchHref(sanitizedQuery, currentPage + 1)}
            >
              下一页
            </Link>
          ) : (
            <span className="rounded-full border border-border px-4 py-2 text-muted-foreground">
              下一页
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `搜索结果 | Pioneers`,
  }
}

const buildSearchHref = (query: string, page: number) => {
  const params = new URLSearchParams()
  if (query) params.set('q', query)
  if (page > 1) params.set('page', String(page))
  const qs = params.toString()
  return `/search${qs ? `?${qs}` : ''}`
}
