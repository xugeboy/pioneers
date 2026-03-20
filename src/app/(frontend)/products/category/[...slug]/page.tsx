import type { Metadata } from 'next/types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Media } from '@/components/Media'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { ProductCategoryCard } from '@/components/ProductCategoryCard'
import { ProductLeadCard, type ProductLeadCardData } from '@/components/ProductLeadCard'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import PageClient from './page.client'
import {
  PRODUCT_PAGE_LIMIT,
  getAllProductCategories,
  getDescendantProductCategoryIDs,
  getDirectChildProductCategories,
  getProductCategoryBreadcrumbItems,
  getProductCategoryHref,
  getProductCategoryPath,
  getProductCategoryProductsWhere,
  getProductCategorySegmentsFromPath,
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

  const sanitizedSegments =
    trailingPageSegment === 'page' ? decodedSlug.slice(0, -2) : decodedSlug
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
  const childCategories = getDirectChildProductCategories(allCategories, currentCategory.id)
  const products = await payload.find({
    collection: 'products',
    depth: 1,
    limit: PRODUCT_PAGE_LIMIT,
    page: requestedPageNumber,
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
    where: getProductCategoryProductsWhere(descendantIDs),
  })

  if (
    (products.totalPages > 0 && requestedPageNumber > products.totalPages) ||
    (products.totalPages === 0 && requestedPageNumber > 1)
  ) {
    notFound()
  }

  return (
    <div className="pt-24 pb-24">
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

      <div className="container mb-12">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div className="rounded-[2rem] border border-[#d7dfd5] bg-[linear-gradient(180deg,#fbfcf8_0%,#eff3ec_100%)] p-7 shadow-[0_18px_42px_rgba(16,25,20,0.06)] md:p-9">
            <p className="pioneers-kicker font-display">Product Category</p>
            <h1 className="mt-4 font-display text-3xl text-[#162019] md:text-4xl">
              {currentCategory.title}
            </h1>
            {currentCategory.description ? (
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#506055]">
                {currentCategory.description}
              </p>
            ) : null}
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-[#d7dfd5] bg-[linear-gradient(180deg,#f8fbf6_0%,#e8eee5_100%)] shadow-[0_18px_42px_rgba(16,25,20,0.06)]">
            {currentCategory.heroImage && typeof currentCategory.heroImage === 'object' ? (
              <div className="relative min-h-72">
                <Media
                  fill
                  imgClassName="object-cover"
                  priority
                  resource={currentCategory.heroImage}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,25,20,0.06)_0%,rgba(16,25,20,0.22)_100%)]" />
              </div>
            ) : (
              <div className="flex min-h-72 items-end bg-[radial-gradient(circle_at_top,_rgba(54,81,63,0.14),_transparent_48%),linear-gradient(180deg,#f8fbf6_0%,#e8eee5_100%)] p-8">
                <p className="max-w-xs text-sm font-medium uppercase tracking-[0.22em] text-[#56715e]">
                  Explore products across this category and its subcategories.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {childCategories.length > 0 ? (
        <div className="container mb-14">
          <div className="mb-6 max-w-2xl space-y-2">
            <p className="pioneers-kicker font-display">Subcategories</p>
            <h2 className="font-display text-2xl md:text-3xl">Drill into the next level</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {childCategories.map((category) => (
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
            basePath={getProductCategoryHref(currentCategory)}
            page={products.page}
            totalPages={products.totalPages}
          />
        ) : null}
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
