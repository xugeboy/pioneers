'use client'

import React from 'react'
import { Download } from 'lucide-react'

import type { CertificationsLibraryBlock as CertificationsLibraryBlockProps, Media } from '@/payload-types'

const formatFileSize = (bytes?: number | null): string | null => {
  if (!bytes || bytes <= 0) return null

  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** exponent

  return `${value < 10 && exponent > 0 ? value.toFixed(1) : Math.round(value)} ${units[exponent]}`
}

const isMediaDoc = (value: number | Media | null | undefined): value is Media =>
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

              <div className="mt-6 border-y border-zinc-200">
                {(group.items || []).map((item) => {
                  const media = isMediaDoc(item.file) ? item.file : null
                  const href = media?.frontendURL || media?.url

                  if (!href) return null

                  const displayName = item.label || media?.filename || 'Certificate'
                  const sizeText = formatFileSize(media?.filesize)

                  return (
                    <a
                      className="group flex items-center justify-between gap-4 border-b border-zinc-200 px-3 py-5 last:border-b-0 hover:bg-white/70"
                      download
                      href={href}
                      key={item.id ?? `${group.title}-${displayName}`}
                      target="_blank"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-base font-medium text-zinc-700">{displayName}</p>
                        {sizeText ? <p className="text-sm text-zinc-500">({sizeText})</p> : null}
                      </div>
                      <span className="inline-flex size-8 shrink-0 items-center justify-center text-zinc-500 group-hover:text-zinc-800">
                        <Download className="size-4" />
                      </span>
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
