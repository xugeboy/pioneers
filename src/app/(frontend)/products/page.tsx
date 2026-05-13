import type { Metadata } from 'next/types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { ProductLeadCard, type ProductLeadCardData } from '@/components/ProductLeadCard'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import PageClient from './page.client'
import { PRODUCT_PAGE_LIMIT } from '@/utilities/productCategories'
import { getCollectionPageJsonLd } from '@/utilities/jsonLd'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ProductsPage() {
  const payload = await getPayload({ config: configPromise })

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
  const productItems = (products.docs as ProductLeadCardData[]).map((product) => ({
    name: product.title,
    url: `/products/${product.slug}`,
  }))

  return (
    <div className="pt-[68px] md:pt-24">
      <JsonLd
        data={getCollectionPageJsonLd({
          items: productItems,
          name: 'Pioneers Product Catalog',
          path: '/products',
        })}
      />
      <PageClient />
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'Products' }]} />

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

export function generateMetadata(): Metadata {
  return {
    title: 'Pioneers Product Catalog',
  }
}
