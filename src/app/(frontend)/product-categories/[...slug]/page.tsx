import type { Metadata } from 'next/types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CertificateOfHonorSection } from '@/components/CertificateOfHonorSection'
import { JsonLd } from '@/components/JsonLd'
import { Media } from '@/components/Media'
import ProductCategoryBrowserSidebar from '@/components/ProductCategoryBrowserSidebar'
import { ProductCategoryPillarSections } from '@/components/ProductCategoryPillarSections'
import ProductCategoryResults from '@/components/ProductCategoryResults'
import { type ProductLeadCardData } from '@/components/ProductLeadCard'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import PageClient from './page.client'
import {
  PRODUCT_PAGE_LIMIT,
  getAllProductCategories,
  getDescendantProductCategoryIDs,
  getProductCategoryNavItems,
  getProductCategoryBreadcrumbItems,
  getProductCategoryHref,
  getProductCategoryPath,
  getProductCategoryProductsWhere,
  getProductCategorySegmentsFromPath,
  productCardSelect,
  resolveProductCategoryBySegments,
} from '@/utilities/productCategories'
import { generateMeta } from '@/utilities/generateMeta'
import {
  compactJsonLd,
  getBreadcrumbJsonLd,
  getProductCategoryFAQJsonLd,
  getProductCategoryJsonLd,
} from '@/utilities/jsonLd'

type Args = {
  params: Promise<{
    slug: string[]
  }>
}

export const revalidate = 600

export default async function ProductCategoryPage({ params: paramsPromise }: Args) {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })
  const decodedSlug = slug.map((segment) => decodeURIComponent(segment))
  const trailingPageSegment = decodedSlug.at(-2)
  const trailingPageNumber = decodedSlug.at(-1)
  const requestedPageNumber =
    trailingPageSegment === 'page' && trailingPageNumber ? Number(trailingPageNumber) : 1

  if (
    trailingPageSegment === 'page' &&
    (!Number.isInteger(requestedPageNumber) || requestedPageNumber < 1)
  ) {
    notFound()
  }

  const sanitizedSegments = trailingPageSegment === 'page' ? decodedSlug.slice(0, -2) : decodedSlug
  const currentCategory = await resolveProductCategoryBySegments(payload, sanitizedSegments)

  if (!currentCategory) {
    notFound()
  }

  const currentPath = getProductCategoryPath(currentCategory)
  if (!currentPath) {
    notFound()
  }

  const allCategories = await getAllProductCategories(payload)
  const categoryNavItems = getProductCategoryNavItems(allCategories)
  const descendantIDs = getDescendantProductCategoryIDs(allCategories, currentPath)
  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: PRODUCT_PAGE_LIMIT,
    page: requestedPageNumber,
    overrideAccess: false,
    select: productCardSelect,
    sort: '-publishedAt',
    where: getProductCategoryProductsWhere(descendantIDs),
  })

  if (
    (products.totalPages > 0 && requestedPageNumber > products.totalPages) ||
    (products.totalPages === 0 && requestedPageNumber > 1)
  ) {
    notFound()
  }
  const breadcrumbItems =
    requestedPageNumber > 1
      ? [
          ...getProductCategoryBreadcrumbItems(currentCategory),
          { label: `Page ${requestedPageNumber}` },
        ]
      : getProductCategoryBreadcrumbItems(currentCategory)
  const pagePath =
    requestedPageNumber > 1
      ? `${getProductCategoryHref(currentCategory)}/page/${requestedPageNumber}`
      : getProductCategoryHref(currentCategory)

  return (
    <div className="pt-16 md:pt-24 pb-16 md:pb-24">
      <JsonLd
        data={compactJsonLd([
          getProductCategoryJsonLd(currentCategory, products.docs),
          getBreadcrumbJsonLd(breadcrumbItems, pagePath),
          requestedPageNumber === 1 ? getProductCategoryFAQJsonLd(currentCategory) : null,
        ])}
      />
      <PageClient />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="container mb-8">
        <div className="max-w-6xl space-y-3">
          <h1 className="font-display text-3xl text-[#162019] md:text-4xl">
            {currentCategory.title}
          </h1>
          {currentCategory.description ? (
            <p className="text-base leading-7 text-[#66756b] md:text-lg">
              {currentCategory.description}
            </p>
          ) : null}
        </div>
      </div>

      {currentCategory.heroImage && typeof currentCategory.heroImage === 'object' ? (
        <div className="container mb-12">
          <div className="overflow-hidden border border-[#d7dfd5] shadow-[0_18px_42px_rgba(16,25,20,0.06)]">
            <div className="relative min-h-[240px] md:min-h-[320px] lg:min-h-[420px]">
              <Media
                fill
                imgClassName="object-cover"
                priority
                resource={currentCategory.heroImage}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start">
          <ProductCategoryBrowserSidebar
            categories={categoryNavItems}
            currentCategoryID={currentCategory.id}
          />

          <div className="min-w-0">
            <ProductCategoryResults
              basePath={getProductCategoryHref(currentCategory)}
              categoryID={currentCategory.id}
              page={products.page}
              products={products.docs as ProductLeadCardData[]}
              totalDocs={products.totalDocs}
              totalPages={products.totalPages}
            />
          </div>
        </div>
      </div>

      {requestedPageNumber === 1 ? (
        <ProductCategoryPillarSections category={currentCategory} />
      ) : null}

      <CertificateOfHonorSection />
    </div>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug } = await paramsPromise
  const payload = await getPayload({ config: configPromise })
  const decodedSlug = slug.map((segment) => decodeURIComponent(segment))
  const trailingPageSegment = decodedSlug.at(-2)
  const trailingPageNumber = decodedSlug.at(-1)
  const requestedPageNumber =
    trailingPageSegment === 'page' && trailingPageNumber ? Number(trailingPageNumber) : 1
  const category = await resolveProductCategoryBySegments(
    payload,
    trailingPageSegment === 'page' ? decodedSlug.slice(0, -2) : decodedSlug,
  )
  const path = `/product-categories/${decodedSlug.join('/')}`

  if (!category) {
    return generateMeta({
      doc: null,
      path,
      title:
        requestedPageNumber > 1
          ? `Product Category - Page ${requestedPageNumber} | Pioneers`
          : 'Product Category | Pioneers',
    })
  }

  const title =
    requestedPageNumber > 1
      ? `${category.title} - Page ${requestedPageNumber} | Pioneers Product Catalog`
      : `${category.title} | Pioneers Product Catalog`

  return generateMeta({
    description: category.description,
    doc: category,
    path:
      requestedPageNumber > 1
        ? `${getProductCategoryHref(category)}/page/${requestedPageNumber}`
        : getProductCategoryHref(category),
    title,
  })
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const categories = await getAllProductCategories(payload)
  const params: { slug: string[] }[] = []

  for (const category of categories) {
    const currentPath = getProductCategoryPath(category)

    if (!currentPath) {
      continue
    }

    const categorySlug = getProductCategorySegmentsFromPath(currentPath)
    params.push({ slug: categorySlug })

    const descendantIDs = getDescendantProductCategoryIDs(categories, currentPath)
    const { totalDocs } = await payload.count({
      collection: 'products',
      overrideAccess: false,
      where: getProductCategoryProductsWhere(descendantIDs),
    })
    const totalPages = Math.ceil(totalDocs / PRODUCT_PAGE_LIMIT)

    for (let pageNumber = 2; pageNumber <= totalPages; pageNumber++) {
      params.push({
        slug: [...categorySlug, 'page', String(pageNumber)],
      })
    }
  }

  return params
}
