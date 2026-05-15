'use client'

import type {
  File as PayloadFile,
  Form as PayloadForm,
  Product as PayloadProduct,
} from '@/payload-types'

import React, { useEffect, useMemo, useState } from 'react'
import { Download } from 'lucide-react'

import { Media } from '@/components/Media'
import { ProductInquiryForm } from '@/components/ProductInquiryForm'
import { ProductVideoPreview } from '@/components/ProductVideoPreview'
import RichText from '@/components/RichText'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

type ProductDetailShellProps = {
  form?: PayloadForm | null
  product: Pick<
    PayloadProduct,
    | 'attachments'
    | 'description'
    | 'gallery'
    | 'model'
    | 'primaryImage'
    | 'secondaryImage'
    | 'specs'
    | 'slug'
    | 'summary'
    | 'title'
    | 'video'
  >
}

type ProductImage = {
  key: string
  resource: PayloadProduct['primaryImage']
}

type TabKey = 'detail' | 'specifications' | 'files'

const buildImageKey = (resource: PayloadProduct['primaryImage'], fallback: string) => {
  if (resource && typeof resource === 'object') {
    if ('id' in resource && resource.id) return `media-${String(resource.id)}`
    if ('url' in resource && resource.url) return `url-${resource.url}`
  }

  return fallback
}

const getAttachmentURL = (file?: PayloadFile | number | null) => {
  if (!file || typeof file === 'number') return ''
  return getMediaUrl(file.url, file.updatedAt)
}

export const ProductDetailShell: React.FC<ProductDetailShellProps> = ({ form, product }) => {
  const images = useMemo<ProductImage[]>(() => {
    const nextImages: ProductImage[] = [
      {
        key: buildImageKey(product.primaryImage, 'primary-image'),
        resource: product.primaryImage,
      },
    ]

    if (product.secondaryImage) {
      nextImages.push({
        key: buildImageKey(product.secondaryImage, 'secondary-image'),
        resource: product.secondaryImage,
      })
    }

    product.gallery?.forEach((item, index) => {
      if (!item?.image) return

      nextImages.push({
        key: buildImageKey(item.image, `gallery-${index}`),
        resource: item.image,
      })
    })

    return Array.from(new Map(nextImages.map((item) => [item.key, item])).values())
  }, [product.gallery, product.primaryImage, product.secondaryImage, product.title])

  const availableTabs = useMemo<{ key: TabKey; label: string }[]>(
    () => [
      { key: 'detail', label: 'Detail' },
      { key: 'specifications', label: 'Specifications' },
      ...(product.attachments?.length ? [{ key: 'files' as const, label: 'Related Files' }] : []),
    ],
    [product.attachments?.length],
  )

  const [selectedImageKey, setSelectedImageKey] = useState(images[0]?.key ?? '')
  const [activeTab, setActiveTab] = useState<TabKey>('detail')

  useEffect(() => {
    setSelectedImageKey(images[0]?.key ?? '')
  }, [images])

  useEffect(() => {
    if (availableTabs.some((tab) => tab.key === activeTab)) return
    setActiveTab('detail')
  }, [activeTab, availableTabs])

  const selectedImage = images.find((image) => image.key === selectedImageKey) ?? images[0]

  return (
    <div className="space-y-14 md:mb-16">
      <section className="grid gap-10 md:grid-cols-[minmax(0,0.92fr)_minmax(21rem,1.08fr)] xl:gap-14">
        <div className="space-y-5">
          <div className="relative overflow-hidden">
            <div className="relative aspect-4/3 md:aspect-5/4">
              {selectedImage ? (
                <Media
                  fill
                  imgClassName="object-contain p-6 md:p-8"
                  priority
                  resource={selectedImage.resource}
                />
              ) : null}
            </div>
          </div>

          {images.length > 1 ? (
            <div className="flex flex-wrap gap-3">
              {images.map((image, index) => {
                const isActive = image.key === selectedImage?.key

                return (
                  <button
                    aria-label={`Show product image ${index + 1}`}
                    className={cn(
                      'relative h-20 w-20 overflow-hidden border bg-white transition-all duration-200',
                      isActive
                        ? 'border-[#101914] shadow-[0_12px_30px_-24px_rgba(16,25,20,0.5)]'
                        : 'border-[#d8ddd5] hover:border-[#f97316]',
                    )}
                    key={image.key}
                    onClick={() => {
                      setSelectedImageKey(image.key)
                    }}
                    type="button"
                  >
                    <Media
                      fill
                      imgClassName="object-contain p-2"
                      loading="lazy"
                      resource={image.resource}
                    />
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>

        <div className="space-y-8">
          <div className="space-y-5">
            <div className="space-y-3">
              <h1 className="font-display text-[1.8rem] font-semibold leading-[1.05] text-[#101914] md:text-[2.2rem]">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:text-base">
                <span className="font-semibold text-[#263229]">Product Code:</span>
                <span className="font-semibold text-[#00A650]">{product.model}</span>
              </div>
            </div>

            {product.summary ? (
              <p className="max-w-3xl text-base leading-8 text-[#465449] md:text-[1.05rem]">
                {product.summary}
              </p>
            ) : null}
          </div>

          {form ? <ProductInquiryForm form={form} product={product} /> : null}
        </div>
      </section>

      <ProductVideoPreview title={product.title || 'Product video'} video={product.video} />

      <section className="border-t border-[#d8ddd5] pt-8">
        <div
          className="flex flex-wrap gap-x-7 gap-y-3 border-b border-[#d8ddd5] pb-4"
          role="tablist"
        >
          {availableTabs.map((tab) => {
            const isActive = tab.key === activeTab

            return (
              <button
                aria-controls={`product-tabpanel-${tab.key}`}
                aria-selected={isActive}
                className={cn(
                  'border-b-2 pb-3 text-sm font-semibold uppercase tracking-[0.16em] transition-colors duration-200',
                  isActive
                    ? 'border-[#f97316] text-[#101914]'
                    : 'border-transparent text-[#67756b] hover:text-[#101914]',
                )}
                id={`product-tab-${tab.key}`}
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                }}
                role="tab"
                type="button"
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div
          aria-labelledby={`product-tab-${activeTab}`}
          className="pt-8"
          id={`product-tabpanel-${activeTab}`}
          role="tabpanel"
        >
          {activeTab === 'detail' ? (
            product.description ? (
              <div className="max-w-none">
                <RichText
                  className="prose prose-slate max-w-none prose-headings:font-display prose-headings:text-[#101914] prose-p:text-[#465449] prose-p:leading-8 prose-li:text-[#465449] md:prose-lg"
                  data={product.description}
                  enableGutter={false}
                />
              </div>
            ) : (
              <p className="text-base leading-8 text-[#526258]">Details will be available soon.</p>
            )
          ) : null}

          {activeTab === 'specifications' ? (
            product.specs?.length ? (
              <div className="grid gap-x-10 gap-y-5 md:grid-cols-[minmax(12rem,18rem)_minmax(0,1fr)] md:gap-y-6">
                {product.specs.map((spec, index) => (
                  <div className="contents" key={spec.id || `${spec.label}-${index}`}>
                    <span className="text-[0.98rem] font-medium leading-7 text-[#101914]">
                      {spec.label}:
                    </span>
                    <span className="text-[0.98rem] leading-7 text-[#465449]">{spec.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base leading-8 text-[#526258]">
                Specifications will be available soon.
              </p>
            )
          ) : null}

          {activeTab === 'files' ? (
            <ul className="space-y-3">
              {product.attachments?.map((attachment, index) => {
                const file = attachment.file
                const href = getAttachmentURL(file)

                if (!href || !file || typeof file === 'number') return null

                return (
                  <li key={attachment.id || `${attachment.label || 'attachment'}-${index}`}>
                    <a
                      className="group inline-flex max-w-full items-center gap-3 py-1 transition-colors duration-200"
                      href={href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="truncate text-base font-semibold text-[#101914] transition-colors duration-200 group-hover:text-[#f97316]">
                        {attachment.label || file.filename || 'Download file'}
                      </span>

                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fff1e8] text-[#f97316] transition-transform duration-200 group-hover:scale-105">
                        <Download className="size-4" />
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      </section>
    </div>
  )
}
