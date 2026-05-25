'use client'

import React from 'react'
import { Download, FileText } from 'lucide-react'

import { Media as MediaComponent } from '@/components/Media'
import type {
  CertificationsLibraryBlock as CertificationsLibraryBlockProps,
  File as PayloadFile,
  Media as PayloadMedia,
} from '@/payload-types'

const formatFileSize = (bytes?: number | null): string | null => {
  if (!bytes || bytes <= 0) return null

  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** exponent

  return `${value < 10 && exponent > 0 ? value.toFixed(1) : Math.round(value)} ${units[exponent]}`
}

const isFileDoc = (value: number | PayloadFile | null | undefined): value is PayloadFile =>
  typeof value === 'object' && value !== null

const isMediaDoc = (value: number | PayloadMedia | null | undefined): value is PayloadMedia =>
  typeof value === 'object' && value !== null

export const CertificationsLibraryBlock: React.FC<
  CertificationsLibraryBlockProps & { disableInnerContainer?: boolean }
> = ({ groups }) => {
  const visibleCategories = (groups || []).filter(
    (group) => group?.title && group?.items && group.items.length > 0,
  )

  if (visibleCategories.length === 0) {
    return null
  }

  return (
    <section>
      <div className="container">
        <div className="mt-10 space-y-12">
          {visibleCategories.map((group) => (
            <section key={group.id ?? group.title}>
              <h3 className="text-[2rem] font-semibold leading-tight tracking-tight text-zinc-900">
                {group.title}
              </h3>

              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {(group.items || []).map((item) => {
                  const file = isFileDoc(item.file) ? item.file : null
                  const href = file?.url

                  if (!href) return null

                  const displayName = item.label || file?.title || file?.filename || 'Certificate'
                  const sizeText = formatFileSize(file?.filesize)
                  const previewImage = isMediaDoc(item.previewImage) ? item.previewImage : null

                  return (
                    <a
                      className="group block border border-zinc-200 bg-white transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                      download
                      href={href}
                      key={item.id ?? `${group.title}-${displayName}`}
                      target="_blank"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
                        {previewImage ? (
                          <MediaComponent
                            fill
                            imgClassName="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            resource={previewImage}
                            size="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center text-zinc-500">
                            <FileText className="size-12" />
                            <span className="text-sm font-medium uppercase tracking-[0.18em]">
                              PDF Download
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-start justify-between gap-4 px-4 py-4">
                        <div className="min-w-0">
                          <p className="line-clamp-2 text-base font-medium leading-6 text-zinc-800">
                            {displayName}
                          </p>
                          {sizeText ? (
                            <p className="mt-1 text-sm text-zinc-500">{sizeText}</p>
                          ) : null}
                        </div>
                        <span className="inline-flex size-8 shrink-0 items-center justify-center text-zinc-500 group-hover:text-zinc-800">
                          <Download className="size-4" />
                        </span>
                      </div>
                    </a>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
