'use client'

import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { cn } from '@/utilities/ui'

type TableOfContentsItem = {
  href: string
  label: string
  level: number
}

export function BlogArticleLeftSidebar({
  className,
  shareTitle,
  shareURL,
  tableOfContents,
}: {
  className?: string
  shareTitle: string
  shareURL: string
  tableOfContents: TableOfContentsItem[]
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const encodedShareTitle = encodeURIComponent(shareTitle)
  const encodedShareURL = encodeURIComponent(shareURL)
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedShareURL}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedShareURL}`,
    x: `https://twitter.com/intent/tweet?url=${encodedShareURL}&text=${encodedShareTitle}`,
  }

  return (
    <aside className={cn('block', className)}>
      <div className="space-y-9 xl:sticky xl:top-28">
        <div className="flex items-center gap-5">
          <p className="text-lg font-semibold text-[#06120b]">Share</p>
          <a
            aria-label="Share on LinkedIn"
            className="text-[#1b1b1b] transition-colors hover:text-[#00A650]"
            href={shareLinks.linkedin}
            rel="noreferrer"
            target="_blank"
          >
            <LinkedInIcon className="size-7" />
          </a>
          <a
            aria-label="Share on X"
            className="text-[#1b1b1b] transition-colors hover:text-[#00A650]"
            href={shareLinks.x}
            rel="noreferrer"
            target="_blank"
          >
            <XIcon className="size-7" />
          </a>
          <a
            aria-label="Share on Facebook"
            className="text-[#1b1b1b] transition-colors hover:text-[#00A650]"
            href={shareLinks.facebook}
            rel="noreferrer"
            target="_blank"
          >
            <FacebookIcon className="size-7" />
          </a>
        </div>

        <div className="border-t border-slate-200 pt-9">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-[#06120b]">Table of Contents</h2>
            <button
              aria-controls="blog-table-of-contents"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse table of contents' : 'Expand table of contents'}
              className="flex size-8 cursor-pointer items-center justify-center rounded-full text-[#06120b] transition-colors hover:bg-slate-100 hover:text-[#00A650] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A650]/30"
              onClick={() => setIsExpanded((current) => !current)}
              type="button"
            >
              {isExpanded ? (
                <ChevronUp aria-hidden="true" className="size-5" />
              ) : (
                <ChevronDown aria-hidden="true" className="size-5" />
              )}
            </button>
          </div>

          {isExpanded ? (
            <nav
              aria-label="Table of contents"
              className="mt-5 space-y-3"
              id="blog-table-of-contents"
            >
              {tableOfContents.length > 0 ? (
                tableOfContents.map((item) => (
                  <a
                    className={cn(
                      'block text-base leading-6 text-slate-700 transition-colors hover:text-[#00A650]',
                      item.level > 2 ? 'pl-4 text-sm' : '',
                    )}
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </a>
                ))
              ) : (
                <p className="text-sm leading-6 text-slate-500">
                  Article sections will appear here.
                </p>
              )}
            </nav>
          ) : null}
        </div>
      </div>
    </aside>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.68H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.1 20.45H3.53V9H7.1v11.45z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.9 10.47 21.35 2h-1.76l-6.37 7.24L8.1 2H2.4l7.8 11.08L2.4 22h1.76l6.92-7.88L16.62 22h5.7l-8.42-11.53zm-2.45 2.78-.8-1.11L4.36 3.3h2.9l5.01 7.05.8 1.11 6.6 9.28h-2.9l-5.32-7.49z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.92 3.78-3.92 1.1 0 2.24.2 2.24.2v2.48h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.18 22 17.02 22 12.06z" />
    </svg>
  )
}
