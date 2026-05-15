import type { Metadata } from 'next/types'

import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { ProductDetailShell } from '@/components/ProductDetailShell'
import { ProductInterestCarousel } from '@/components/ProductInterestCarousel'
import type { ProductLeadCardData } from '@/components/ProductLeadCard'
import type { Form as PayloadForm, Product as PayloadProduct } from '@/payload-types'
import { generateMeta } from '@/utilities/generateMeta'
import { getProductCategoryBreadcrumbItems } from '@/utilities/productCategories'
import { getBreadcrumbJsonLd, getProductJsonLd } from '@/utilities/jsonLd'

import PageClient from './page.client'

export const revalidate = 600

type Args = {
  params: Promise<{
    slug: string
  }>
}

type Product = PayloadProduct

export default async function ProductDetailPage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    draft,
    limit: 1,
    pagination: false,
    depth: 2,
    overrideAccess: draft,
    where: {
      slug: {
        equals: decodedSlug,
      },
    },
  })

  const product = result.docs?.[0] as Product | undefined

  if (!product) {
    notFound()
  }

  const inquiryFormResult = await payload.find({
    collection: 'forms',
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      title: {
        equals: 'Product Inquiry Form',
      },
    },
  })

  const inquiryForm = inquiryFormResult.docs?.[0] as PayloadForm | undefined

  const relatedProductsResult = await payload.find({
    collection: 'products',
    depth: 1,
    draft,
    limit: 10,
    pagination: false,
    overrideAccess: draft,
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
    where: {
      and: [
        {
          id: {
            not_equals: product.id,
          },
        },
        {
          isFeatured: {
            equals: true,
          },
        },
      ],
    },
    sort: '-publishedAt',
  })

  const relatedProducts = relatedProductsResult.docs as ProductLeadCardData[]

  const { title, primaryCategory, customLayout } = product
  const breadcrumbItems = [
    ...getProductCategoryBreadcrumbItems(
      typeof primaryCategory === 'object' && primaryCategory !== null ? primaryCategory : null,
    ),
    { label: title || 'Product' },
  ]
  const productPath = `/products/${decodedSlug}`

  return (
    <article className="pt-[68px] md:pt-24 pb-16 md:pb-24">
      <JsonLd
        data={[getProductJsonLd(product), getBreadcrumbJsonLd(breadcrumbItems, productPath)]}
      />
      <PageClient />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="container">
        <ProductDetailShell form={inquiryForm || null} product={product} />
      </div>

      {customLayout && customLayout.length > 0 ? (
        <div className="mt-12">
          <RenderBlocks blocks={customLayout} />
        </div>
      ) : null}

      {relatedProducts.length ? (
        <div className="container">
          <ProductInterestCarousel products={relatedProducts} />
        </div>
      ) : null}
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1,
    pagination: false,
    depth: 1,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      summary: true,
      primaryImage: true,
    },
    where: {
      slug: {
        equals: decodedSlug,
      },
    },
  })

  const product = result.docs?.[0] as Product | undefined

  return generateMeta({
    collection: 'products',
    description: product?.summary,
    doc: product || null,
    title: product?.title ? `${product.title} | Pioneers` : 'Pioneers Product Detail',
  })
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const products = await payload.find({
    collection: 'products',
    draft: false,
    limit: 1000,
    pagination: false,
    overrideAccess: false,
    select: {
      slug: true,
    },
  })

  return products.docs
    ?.filter((doc) => Boolean(doc.slug))
    .map((doc) => ({ slug: doc.slug as string }))
}
