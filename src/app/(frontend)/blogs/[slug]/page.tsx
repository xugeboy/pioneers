import type { Metadata } from 'next'

import { RelatedBlogs } from '@/blocks/RelatedBlogs/Component'
import {
  BlogArticleLeftSidebar,
  BlogArticleRightSidebar,
  getBlogTableOfContents,
} from '@/components/BlogArticleSidebars'
import { BlogRelatedProductsSidebar } from '@/components/BlogRelatedProductsSidebar'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import { getServerSideURL } from '@/utilities/getURL'
import {
  compactJsonLd,
  getBlogPostingJsonLd,
  getBlogVideoJsonLd,
  getBreadcrumbJsonLd,
  getWebPageJsonLd,
} from '@/utilities/jsonLd'
import { queryBlogBySlug } from '@/utilities/queryBlogs'
import { cn } from '@/utilities/ui'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
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
  const shareURL = new URL(url, getServerSideURL()).toString()
  const tableOfContents = getBlogTableOfContents(blog.content)
  const authorName = blog.populatedAuthors?.find((author) => author.name)?.name || null
  const blogHeroImage =
    blog.heroImage && typeof blog.heroImage === 'object'
      ? blog.heroImage
      : blog.meta?.image && typeof blog.meta.image === 'object'
        ? blog.meta.image
        : null
  const blogHeroImageStyle = getBlogHeroImageStyle(blogHeroImage)
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

      <section
        className="bg-[#00A650] bg-repeat py-12 text-white md:py-16 lg:py-20"
        style={{ backgroundImage: "url('/topography.svg')", backgroundSize: '1840px auto' }}
      >
        <div className="container grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(26rem,1fr)] lg:items-center xl:gap-14">
          <div>
            <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-[3.25rem]">
              {blog.title}
            </h1>

            <div className="mt-8 flex flex-col gap-5 text-white sm:flex-row sm:items-center md:mt-10">
              {authorName ? (
                <Link
                  className="flex w-fit items-center gap-3 rounded-full pr-2 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                  href="/author/dustin-xu"
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-white">
                    <Image
                      alt={authorName}
                      className="object-cover"
                      fill
                      sizes="48px"
                      src="/Dustin.png"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold leading-6">{authorName}</p>
                  </div>
                </Link>
              ) : null}

              {blog.publishedAt ? (
                <div
                  className={cn(
                    'text-base leading-6',
                    authorName ? 'border-l border-white/45 pl-6' : '',
                  )}
                >
                  <span className="font-semibold">Published Date:</span>{' '}
                  <time dateTime={blog.publishedAt}>{formatBlogHeroDate(blog.publishedAt)}</time>
                </div>
              ) : null}
            </div>
          </div>

          {blogHeroImage ? (
            <div
              className="relative mx-auto flex w-fit max-w-full overflow-hidden rounded-md bg-white/95 shadow-[0_18px_45px_rgba(6,18,11,0.08)]"
              style={blogHeroImageStyle}
            >
              <Media
                priority
                imgClassName="block h-auto max-h-[32rem] max-w-full object-contain"
                resource={blogHeroImage}
                size="(min-width: 1280px) 46rem, (min-width: 1024px) 48vw, calc(100vw - 2rem)"
              />
            </div>
          ) : null}
        </div>
      </section>

      <div className="pt-8">
        <div className="mx-auto grid w-[calc(100%-2rem)] max-w-[128rem] gap-10 sm:w-[calc(100%-3rem)] md:w-[calc(100%-4rem)] xl:grid-cols-[minmax(16rem,21rem)_minmax(0,78rem)_minmax(16rem,21rem)] xl:items-start 2xl:grid-cols-[22rem_minmax(0,84rem)_22rem] 2xl:gap-14">
          <BlogArticleLeftSidebar
            shareTitle={blog.title}
            shareURL={shareURL}
            tableOfContents={tableOfContents}
          />

          <div className="min-w-0">
            <RichText className="blog-richtext mx-auto" data={blog.content} enableGutter={false} />
            {blog.relatedBlogs && blog.relatedBlogs.length > 0 ? (
              <RelatedBlogs
                className="mt-12"
                docs={blog.relatedBlogs.filter((relatedBlog) => typeof relatedBlog === 'object')}
              />
            ) : null}
          </div>

          <BlogArticleRightSidebar />
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

function getBlogHeroImageStyle(
  image: { height?: number | null; width?: number | null } | null,
): React.CSSProperties {
  if (!image?.width || !image?.height) {
    return {}
  }

  return { maxWidth: `${image.width}px` }
}
