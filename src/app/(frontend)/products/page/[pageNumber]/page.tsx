import type { Metadata } from 'next/types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import Link from 'next/link'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'

import { Media } from '@/components/Media'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'

import PageClient from '../../page.client'

export const revalidate = 600

const PAGE_LIMIT = 12

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

type ProductListItem = {
  id: string
  title?: string | null
  model?: string | null
  slug?: string | null
  summary?: string | null
  primaryImage?: unknown
  secondaryImage?: unknown
}

export default async function ProductsPageNumber({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber)) notFound()

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: PAGE_LIMIT,
    page: sanitizedPageNumber,
    overrideAccess: false,
    select: {
      title: true,
      model: true,
      slug: true,
      summary: true,
      primaryImage: true,
      secondaryImage: true,
    },
    sort: '-publishedAt',
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <Breadcrumbs
        items={[
          { href: '/', label: 'Home' },
          { href: '/products', label: 'Products' },
          { label: `Page ${sanitizedPageNumber}` },
        ]}
      />
      <div className="container mb-10">
        <div className="max-w-2xl space-y-3">
          <p className="pioneers-kicker font-display">Catalog</p>
          <h1 className="font-display text-3xl md:text-4xl">产品目录</h1>
          <p className="text-muted-foreground">
            以户外越野、露营与水上装备为核心场景，支持多型号与定制规格组合。
          </p>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collectionLabels={{ plural: 'Products', singular: 'Product' }}
          currentPage={products.page}
          limit={PAGE_LIMIT}
          totalDocs={products.totalDocs}
        />
      </div>

      <div className="container">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(products.docs as ProductListItem[]).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="container">
        {products?.page && products?.totalPages > 1 && (
          <Pagination basePath="/products" page={products.page} totalPages={products.totalPages} />
        )}
      </div>
    </div>
  )
}

const ProductCard: React.FC<{ product: ProductListItem }> = ({ product }) => {
  const { title, model, slug, summary, primaryImage, secondaryImage } = product
  const href = slug ? `/products/${slug}` : '#'

  return (
    <Link className="group block" href={href}>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="relative aspect-[4/3]">
          {primaryImage && (
            <Media
              fill
              imgClassName="object-cover transition-opacity duration-300"
              resource={primaryImage}
            />
          )}
          {secondaryImage && (
            <Media
              fill
              imgClassName="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              resource={secondaryImage}
            />
          )}
        </div>
        <div className="p-5 space-y-2">
          {model && <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{model}</p>}
          <h3 className="font-display text-lg">{title}</h3>
          {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
        </div>
      </div>
    </Link>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise
  return {
    title: `Pioneers 产品目录 - 第 ${pageNumber || ''} 页`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'products',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / PAGE_LIMIT)
  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
