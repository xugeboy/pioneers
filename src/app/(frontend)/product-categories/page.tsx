import type { Metadata } from 'next/types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { Media } from '@/components/Media'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import PageClient from './page.client'
import {
  getAllProductCategories,
  getDirectChildProductCategories,
  getProductCategoryHref,
  getTopLevelProductCategories,
} from '@/utilities/productCategories'
import { getCollectionPageJsonLd } from '@/utilities/jsonLd'
import { cn } from '@/utilities/ui'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function ProductCategoriesPage() {
  const payload = await getPayload({ config: configPromise })
  const allCategories = await getAllProductCategories(payload)
  const topLevelCategories = getTopLevelProductCategories(allCategories)
  const categoryItems = topLevelCategories.map((category) => ({
    name: category.title,
    url: getProductCategoryHref(category),
  }))

  return (
    <div className=" pt-16 md:pt-24">
      <JsonLd
        data={getCollectionPageJsonLd({
          items: categoryItems,
          name: 'Product Categories',
          path: '/product-categories',
        })}
      />
      <PageClient />
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'Product Categories' }]} />

      <div className="container">
        <section className="py-2 md:py-4">
          <h1 className="font-display text-4xl leading-tight text-[#162019] md:text-5xl">
            Product Categories
          </h1>
        </section>

        <div className="mt-12 space-y-8 md:mt-16 md:space-y-10">
          {topLevelCategories.map((category, index) => {
            const hasHeroImage = category.heroImage && typeof category.heroImage === 'object'
            const categoryHref = getProductCategoryHref(category)
            const childCategories = getDirectChildProductCategories(allCategories, category.id)
            const reverseLayout = index % 2 === 1

            return (
              <section
                className="relative overflow-hidden border border-[#d7dfd5] bg-[#f8faf7] shadow-[0_22px_48px_rgba(16,25,20,0.06)]"
                key={category.id}
              >
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(54,81,63,0.05),transparent_36%,rgba(214,224,211,0.32)_100%)]" />
                <div className="relative grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch">
                  <div className={cn('relative min-h-[320px]', reverseLayout && 'lg:order-2')}>
                    <Link className="group block h-full cursor-pointer" href={categoryHref}>
                      <div className="relative h-full min-h-[320px] overflow-hidden bg-[#e8eee6]">
                        {hasHeroImage ? (
                          <Media
                            fill
                            imgClassName="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            priority={index === 0}
                            resource={category.heroImage}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,#edf2ea_0%,#dfe8dd_100%)]" />
                        )}
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,16,11,0.04)_0%,rgba(9,16,11,0.2)_100%)]" />
                      </div>
                    </Link>
                  </div>

                  <div className={cn('flex items-center', reverseLayout && 'lg:order-1')}>
                    <div className="w-full p-6 md:p-8 lg:p-10">
                      <div className="max-w-2xl space-y-6">
                        <div className="space-y-3">
                          <h2 className="font-display text-3xl leading-tight text-[#162019] md:text-4xl">
                            {category.title}
                          </h2>
                          <p className="text-base leading-7 text-[#55645a] md:text-lg">
                            {category.description ||
                              'Explore this category family to find the right product line, related subcategories, and detailed item listings.'}
                          </p>
                        </div>

                        {childCategories.length > 0 ? (
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-3">
                              {childCategories.map((childCategory) => (
                                <Link
                                  className="cursor-pointer border border-[#d2dbcf] bg-white px-4 py-2 text-sm font-medium text-[#294133] transition-colors duration-200 hover:border-[#36513f] hover:bg-[#eff4ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36513f]/25"
                                  href={getProductCategoryHref(childCategory)}
                                  key={childCategory.id}
                                >
                                  {childCategory.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        <Link
                          className="inline-flex cursor-pointer items-center gap-2 border border-[#36513f] bg-[#36513f] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#2b4032] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36513f]/30"
                          href={categoryHref}
                        >
                          Explore {category.title}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: 'Product Categories | Pioneers',
  }
}
