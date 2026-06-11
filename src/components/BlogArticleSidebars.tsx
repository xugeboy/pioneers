import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { BlogArticleImageCarousel } from '@/components/BlogArticleImageCarousel.client'
import type { Blog } from '@/payload-types'

import { cn } from '@/utilities/ui'

export { BlogArticleLeftSidebar } from './BlogArticleLeftSidebar.client'

type RichTextChildNode = {
  children?: RichTextChildNode[]
  tag?: string
  text?: string
  type?: string
}

export type TableOfContentsItem = {
  href: string
  label: string
  level: number
}

const CTA_STATS = [
  { label: 'Years', value: '16+' },
  { label: 'Parts Manufactured', value: '100K+' },
  { label: 'On-time Delivery', value: '98%' },
]

export function BlogArticleRightSidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        'block xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:self-start xl:overflow-y-auto xl:px-4 xl:pb-6',
        className,
      )}
    >
      <div className="mx-auto w-full max-w-3xl xl:max-w-none">
        <div className="rounded-[22px] border border-slate-200 border-t-[5px] border-t-[#00A650] bg-white p-5 text-center shadow-sm">
          <p className="font-display text-3xl font-semibold text-[#1f1f1f]">PioneersGears</p>
          <p className="mt-3 text-sm font-semibold text-[#00A650]">Factory direct MFG</p>

          <BlogArticleImageCarousel className="mt-4" />

          <h2 className="mt-4 text-xl font-semibold text-[#1f1f1f]">Ready to Manufacture?</h2>
          <p className="mt-2 text-sm text-slate-600">Get instant pricing and DFM feedback</p>

          <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-md bg-white shadow-[0_10px_24px_rgba(6,18,11,0.1)]">
            {CTA_STATS.map((stat, index) => (
              <div
                className={cn('px-2 py-4', index > 0 ? 'border-l border-slate-200' : '')}
                key={stat.label}
              >
                <p className="font-display text-xl font-semibold text-[#00A650]">{stat.value}</p>
                <p className="mt-2 text-[11px] leading-4 text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <Link
            className="mx-auto mt-5 inline-flex h-14 w-full max-w-[15rem] cursor-pointer items-center justify-center gap-3 rounded-md bg-[#00A650] px-5 text-base font-semibold text-white transition-colors hover:bg-[#078944] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#00A650]/25"
            href="/request-quote"
          >
            Get Instant Quote
            <ExternalLink aria-hidden="true" className="size-4" />
          </Link>

          <p className="mt-4 text-sm text-slate-500">Trusted by industry leaders</p>
        </div>
      </div>
    </aside>
  )
}

export function getBlogTableOfContents(content: Blog['content']): TableOfContentsItem[] {
  const nodes = content?.root?.children || []
  const seen = new Map<string, number>()
  const items: TableOfContentsItem[] = []

  for (const node of nodes as RichTextChildNode[]) {
    if (node.type !== 'heading') continue

    const level = getHeadingLevel(node.tag)
    if (!level || level > 4) continue

    const label = getNodeText(node).trim().replace(/\s+/g, ' ')
    if (!label) continue

    const id = getUniqueHeadingID(label, seen)
    items.push({
      href: `#${id}`,
      label,
      level,
    })
  }

  return items
}

function getHeadingLevel(tag?: string): number | null {
  if (!tag || !/^h[1-6]$/.test(tag)) return null
  return Number(tag.replace('h', ''))
}

function getNodeText(node: RichTextChildNode): string {
  if (typeof node.text === 'string') return node.text
  return (node.children || []).map(getNodeText).join(' ')
}

function getUniqueHeadingID(label: string, seen: Map<string, number>): string {
  const base =
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  const count = seen.get(base) || 0
  seen.set(base, count + 1)
  return count > 0 ? `${base}-${count + 1}` : base
}
