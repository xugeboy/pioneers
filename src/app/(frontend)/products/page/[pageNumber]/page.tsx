import type { Metadata } from 'next/types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { ProductLeadCard, type ProductLeadCardData } from '@/components/ProductLeadCard'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import PageClient from '../../page.client'
import { PRODUCT_PAGE_LIMIT } from '@/utilities/productCategories'
import { getBreadcrumbJsonLd, getCollectionPageJsonLd } from '@/utilities/jsonLd'

export const revalidate = 600

type Args = {
  params: Promise<{
    pageNumber: string
  }>
}

export default async function ProductsPageNumber({ params: paramsPromise }: Args) {
  const { pageNumber } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

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
  const pagePath = `/products/page/${sanitizedPageNumber}`
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { label: `Page ${sanitizedPageNumber}` },
  ]
  const productItems = (products.docs as ProductLeadCardData[]).map((product) => ({
    name: product.title,
    url: `/products/${product.slug}`,
  }))

  return (
    <div className="pt-[68px] md:pt-24">
      <JsonLd
        data={[
          getCollectionPageJsonLd({
            items: productItems,
            name: `Pioneers Product Catalog - Page ${sanitizedPageNumber}`,
            path: pagePath,
          }),
          getBreadcrumbJsonLd(breadcrumbItems, pagePath),
        ]}
      />
      <PageClient />
      <Breadcrumbs items={breadcrumbItems} />

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
