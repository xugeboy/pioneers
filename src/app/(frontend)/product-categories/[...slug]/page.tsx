import type { Metadata } from 'next/types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Media } from '@/components/Media'
import ProductCategoryBrowserSidebar from '@/components/ProductCategoryBrowserSidebar'
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
  getProductCategoryBreadcrumbItems,
  getProductCategoryHref,
  getProductCategoryPath,
  getProductCategoryProductsWhere,
  getProductCategorySegmentsFromPath,
  productCardSelect,
  resolveProductCategoryBySegments,
} from '@/utilities/productCategories'

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

  return (
    <div className=" pt-16 md:pt-24">
      <PageClient />
      <Breadcrumbs
        items={
          requestedPageNumber > 1
            ? [
                ...getProductCategoryBreadcrumbItems(currentCategory),
                { label: `Page ${requestedPageNumber}` },
              ]
            : getProductCategoryBreadcrumbItems(currentCategory)
        }
      />

      <div className="container mb-8">
        <div className="max-w-3xl space-y-3">
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
            categories={allCategories}
            currentCategory={currentCategory}
          />

          <div className="min-w-0">
            <ProductCategoryResults
              basePath={getProductCategoryHref(currentCategory)}
              categoryPath={currentPath}
              page={products.page}
              products={products.docs as ProductLeadCardData[]}
              totalDocs={products.totalDocs}
              totalPages={products.totalPages}
            />
          </div>
        </div>
      </div>
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

  if (!category) {
    return {
      title:
        requestedPageNumber > 1
          ? `Product Category - Page ${requestedPageNumber} | Pioneers`
          : 'Product Category | Pioneers',
    }
  }

  return {
    title:
      requestedPageNumber > 1
        ? `${category.title} - Page ${requestedPageNumber} | Pioneers Product Catalog`
        : `${category.title} | Pioneers Product Catalog`,
    description: category.description || undefined,
  }
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
