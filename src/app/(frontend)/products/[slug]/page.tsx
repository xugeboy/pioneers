import type { Metadata } from 'next/types'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import Link from 'next/link'
import React from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import type {
  File as PayloadFile,
  Product as PayloadProduct,
  Video as PayloadVideo,
} from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getProductCategoryBreadcrumbItems } from '@/utilities/productCategories'

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

  const {
    title,
    model,
    summary,
    primaryCategory,
    description,
    primaryImage,
    secondaryImage,
    gallery,
    specs,
    video,
    attachments,
    customLayout,
  } = product
  const breadcrumbItems = [
    ...getProductCategoryBreadcrumbItems(
      typeof primaryCategory === 'object' && primaryCategory !== null ? primaryCategory : null,
    ),
    { label: title || 'Product' },
  ]

  return (
    <article className="pt-24 pb-24">
      <PageClient />
      <Breadcrumbs items={breadcrumbItems} />

      <div className="container mb-10">
        <Link className="text-sm text-muted-foreground" href="/products">
          ← 返回产品目录
        </Link>
      </div>

      <div className="container grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-[4/3]">
              {primaryImage && (
                <Media fill imgClassName="object-cover" priority resource={primaryImage} />
              )}
              {secondaryImage && (
                <Media
                  fill
                  imgClassName="object-cover opacity-0 transition-opacity duration-300 hover:opacity-100"
                  resource={secondaryImage}
                />
              )}
            </div>
          </div>

          {gallery && gallery.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {gallery.map((item, index) => (
                <div
                  key={`${item?.alt || 'gallery'}-${index}`}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-card"
                >
                  {item?.image && <Media fill imgClassName="object-cover" resource={item.image} />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {model && (
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{model}</p>
          )}
          <h1 className="font-display text-3xl md:text-4xl">{title}</h1>
          {summary && <p className="text-muted-foreground">{summary}</p>}

          {specs && specs.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display text-lg">规格参数</p>
              <div className="mt-4 space-y-3 text-sm">
                {specs.map((spec, index) => (
                  <div
                    key={`${spec?.label || 'spec'}-${index}`}
                    className="flex items-start justify-between gap-4 border-b border-border/60 pb-3 last:border-b-0 last:pb-0"
                  >
                    <span className="text-muted-foreground">{spec?.label}</span>
                    <span className="text-foreground">{spec?.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {video && (video.url || video.file) && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display text-lg">产品视频</p>
              <div className="mt-4">
                {video.type === 'url' && video.url ? (
                  <video className="w-full rounded-xl" controls src={video.url} />
                ) : (
                  <UploadedFilePreview file={video.file} />
                )}
              </div>
            </div>
          )}

          {attachments && attachments.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="font-display text-lg">附件下载</p>
              <div className="mt-4 space-y-2 text-sm">
                {attachments.map((item, index) => (
                  <AttachmentLink key={`${item?.label || 'file'}-${index}`} item={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {description && (
        <div className="container mt-16">
          <RichText data={description} />
        </div>
      )}

      {customLayout && customLayout.length > 0 && (
        <div className="mt-12">
          <RenderBlocks blocks={customLayout} />
        </div>
      )}
    </article>
  )
}

const UploadedFilePreview: React.FC<{ file?: PayloadFile | PayloadVideo | number | null }> = ({
  file,
}) => {
  if (!file || typeof file === 'number') return null

  const url = getMediaUrl(file.url, file.updatedAt)
  if (!url) return null

  const isVideo = file.mimeType?.startsWith('video/')

  if (isVideo) {
    return <video className="w-full rounded-xl" controls src={url} />
  }

  return (
    <a className="text-sm text-primary underline" href={url} target="_blank" rel="noreferrer">
      {file.filename || '查看文件'}
    </a>
  )
}

const AttachmentLink: React.FC<{
  item: { file?: PayloadFile | number | null; label?: string | null }
}> = ({ item }) => {
  const file = item.file
  if (!file || typeof file === 'number') return null

  const url = getMediaUrl(file.url, file.updatedAt)
  if (!url) return null

  return (
    <a className="text-primary underline" href={url} target="_blank" rel="noreferrer">
      {item.label || file.filename || '附件下载'}
    </a>
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
    depth: 0,
    overrideAccess: false,
    where: {
      slug: {
        equals: decodedSlug,
      },
    },
  })

  const product = result.docs?.[0] as Product | undefined
  return {
    title: product?.title ? `${product.title} | Pioneers` : 'Pioneers 产品详情',
    description: product?.summary || undefined,
  }
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
