import type { Metadata } from 'next/types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { ProductCategoryCard } from '@/components/ProductCategoryCard'
import { ProductLeadCard, type ProductLeadCardData } from '@/components/ProductLeadCard'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import PageClient from '../../page.client'
import {
  PRODUCT_PAGE_LIMIT,
  getAllProductCategories,
  getTopLevelProductCategories,
} from '@/utilities/productCategories'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function ProductsPageNumber({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })
  const allCategories = await getAllProductCategories(payload)
  const topLevelCategories = getTopLevelProductCategories(allCategories)

  const sanitizedPageNumber = Number(pageNumber)
  if (!Number.isInteger(sanitizedPageNumber) || sanitizedPageNumber < 1) notFound()

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: PRODUCT_PAGE_LIMIT,
    page: sanitizedPageNumber,
    overrideAccess: false,
    select: {
      title: true,
      model: true,
      slug: true,
      summary: true,
      primaryCategory: true,
      additionalCategories: true,
      primaryImage: true,
      secondaryImage: true,
      isFeatured: true,
      specs: true,
    },
    sort: '-publishedAt',
  })

  if (products.totalPages > 0 && sanitizedPageNumber > products.totalPages) {
    notFound()
  }

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
        <div className="max-w-3xl space-y-4">
          <p className="pioneers-kicker font-display">B2B Catalog</p>
          <h1 className="font-display text-3xl md:text-4xl">Retractable Cargo Control Systems</h1>
          <p className="max-w-2xl text-muted-foreground">
            Industrial-grade tie-down gear engineered for outdoor transport, off-road rigs,
            powersports, marine use, and demanding cargo securement programs.
          </p>
        </div>
      </div>

      {topLevelCategories.length > 0 ? (
        <div className="container mb-14">
          <div className="mb-6 max-w-2xl space-y-2">
            <p className="pioneers-kicker font-display">Browse by Category</p>
            <h2 className="font-display text-2xl md:text-3xl">Navigate the catalog by product family</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {topLevelCategories.map((category) => (
              <ProductCategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      ) : null}

      <div className="container mb-8">
        <PageRange
          collectionLabels={{ plural: 'Products', singular: 'Product' }}
          currentPage={products.page}
          limit={PRODUCT_PAGE_LIMIT}
          totalDocs={products.totalDocs}
        />
      </div>

      <div className="container">
        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {(products.docs as ProductLeadCardData[]).map((product) => (
            <ProductLeadCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="container">
        {products.page && products.totalPages > 1 ? (
          <Pagination basePath="/products" page={products.page} totalPages={products.totalPages} />
        ) : null}
      </div>
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { pageNumber } = await paramsPromise

  return {
    title: `Pioneers Product Catalog - Page ${pageNumber}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.count({
    collection: 'products',
    overrideAccess: false,
  })

  const totalPages = Math.ceil(totalDocs / PRODUCT_PAGE_LIMIT)
  const pages: { pageNumber: string }[] = []

  for (let i = 1; i <= totalPages; i++) {
    pages.push({ pageNumber: String(i) })
  }

  return pages
}
