import type { Metadata } from 'next'

import { RelatedBlogs } from '@/blocks/RelatedBlogs/Component'
import { BlogRelatedProductsSidebar } from '@/components/BlogRelatedProductsSidebar'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import {
  compactJsonLd,
  getBlogPostingJsonLd,
  getBlogVideoJsonLd,
  getBreadcrumbJsonLd,
  getWebPageJsonLd,
} from '@/utilities/jsonLd'
import { queryBlogBySlug } from '@/utilities/queryBlogs'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import PageClient from './page.client'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const blogs = await payload.find({
    collection: 'blogs',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  return blogs.docs.map(({ slug }) => ({ slug }))
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function Blog({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = `/blogs/${decodedSlug}`
  const blog = await queryBlogBySlug({ slug: decodedSlug })
  const payload = await getPayload({ config: configPromise })

  if (!blog) return <PayloadRedirects url={url} />

  const relatedProducts = await payload.find({
    collection: 'products',
    depth: 1,
    draft,
    limit: 4,
    overrideAccess: draft,
    pagination: false,
    select: {
      title: true,
      slug: true,
      primaryImage: true,
      summary: true,
      model: true,
    },
    sort: '-publishedAt',
    where: {
      relatedBlogs: {
        in: [blog.id],
      },
    },
  })
  const hasRelatedProducts = relatedProducts.docs.length > 0
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/blogs', label: 'Blogs' },
    { label: blog.title },
  ]

  return (
    <article className="pt-[68px] pb-16 md:pt-24">
      <JsonLd
        data={compactJsonLd([
          getWebPageJsonLd(blog, url),
          getBlogPostingJsonLd(blog),
          getBlogVideoJsonLd(blog),
          getBreadcrumbJsonLd(breadcrumbItems, url),
        ])}
      />
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft ? <LivePreviewListener /> : null}

      <Breadcrumbs items={breadcrumbItems} />

      <div className="container mt-6">
        <div className="min-w-0">
          <div className="relative bg-slate-100">
            <div className="relative aspect-16/10 overflow-hidden md:aspect-video">
              {blog.heroImage && typeof blog.heroImage === 'object' ? (
                <Media fill priority imgClassName="object-contain" resource={blog.heroImage} />
              ) : blog.meta?.image && typeof blog.meta.image === 'object' ? (
                <Media fill priority imgClassName="object-contain" resource={blog.meta.image} />
              ) : null}

              <div className="absolute inset-x-0 bottom-0 bg-muted/72 px-4 pb-10 pt-4 backdrop-blur-sm md:px-6 md:pb-12 md:pt-5">
                <h1 className="max-w-5xl font-display text-[1.25rem] leading-[0.98] text-slate-950 md:text-[2rem]">
                  {blog.title}
                </h1>
              </div>
            </div>

            {blog.publishedAt ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-1/2 justify-center">
                <div className="inline-flex min-w-56 justify-center bg-[#efb23d] px-6 py-3 text-sm font-semibold text-slate-950 md:min-w-[16rem] md:text-base">
                  <time dateTime={blog.publishedAt}>{formatBlogHeroDate(blog.publishedAt)}</time>
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-b border-slate-200 bg-white pb-3 pt-10 md:pt-12" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <RichText className="blog-richtext mx-auto" data={blog.content} enableGutter={false} />
          {blog.relatedBlogs && blog.relatedBlogs.length > 0 ? (
            <RelatedBlogs
              className="mt-12 max-w-208 lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={blog.relatedBlogs.filter((relatedBlog) => typeof relatedBlog === 'object')}
            />
          ) : null}
        </div>
      </div>

      {hasRelatedProducts ? (
        <section className="container mt-16 border-t border-slate-200 pt-10 md:mt-20 md:pt-12">
          <BlogRelatedProductsSidebar layout="grid" products={relatedProducts.docs} />
        </section>
      ) : null}

      <section className="container mt-20 border-t border-slate-200 pt-10 md:mt-24 md:pt-12">
        <div className="mx-auto">
          <p className="mb-6 font-display text-sm uppercase tracking-[0.2em] text-slate-900">
            About PioneersGears
          </p>
          <p className="max-w-5xl text-sm leading-8 text-slate-700 md:text-[15px]">
            PioneersGears is your expert in application-driven cargo control and mobility
            restraints. We design and manufacture purpose-built, OEM/ODM custom tie-down solutions
            for industry-specific transport and securement scenarios.
          </p>

          <div className="mt-14 flex justify-center md:mt-16">
            <Link
              className="inline-flex items-center gap-3 text-[28px] font-light text-slate-900 transition-opacity hover:opacity-70"
              href="/blogs"
            >
              <ArrowLeft aria-hidden="true" className="size-5" />
              <span className="text-[18px] font-normal">Back to blog</span>
            </Link>
          </div>
        </div>
      </section>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const blog = await queryBlogBySlug({ slug: decodedSlug })

  return generateMeta({ collection: 'blogs', doc: blog, path: `/blogs/${decodedSlug}` })
}

function formatBlogHeroDate(timestamp: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(timestamp))
}
