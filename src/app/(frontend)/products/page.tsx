import type { Metadata } from 'next/types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { ProductCategoryCard } from '@/components/ProductCategoryCard'
import { ProductLeadCard, type ProductLeadCardData } from '@/components/ProductLeadCard'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import PageClient from './page.client'
import {
  PRODUCT_PAGE_LIMIT,
  getAllProductCategories,
  getTopLevelProductCategories,
} from '@/utilities/productCategories'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ProductsPage() {
  const payload = await getPayload({ config: configPromise })
  const allCategories = await getAllProductCategories(payload)
  const topLevelCategories = getTopLevelProductCategories(allCategories)

  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: PRODUCT_PAGE_LIMIT,
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

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'Products' }]} />

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
          <Pagination
            basePath="/products"
            page={products.page}
            totalPages={products.totalPages}
          />
        ) : null}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Pioneers Product Catalog',
  }
}
