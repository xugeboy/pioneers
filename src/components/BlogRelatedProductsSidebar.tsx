import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

export type BlogRelatedProduct = Pick<
  Product,
  'id' | 'title' | 'slug' | 'primaryImage' | 'summary' | 'model'
>

export const BlogRelatedProductsSidebar: React.FC<{
  className?: string
  layout?: 'stacked' | 'grid'
  products: BlogRelatedProduct[]
}> = ({ className, layout = 'stacked', products }) => {
  const isGrid = layout === 'grid'

  return (
    <aside className={cn('space-y-6', className)}>
      <p className="font-display text-sm uppercase tracking-[0.2em] text-slate-900">
        Related Products
      </p>

      {products.length > 0 ? (
        <div className={cn(isGrid ? 'space-y-6' : 'space-y-5')}>
          {products.map((product) => {
            const href = product.slug ? `/products/${product.slug}` : '/products'

            return (
              <article
                className={cn(
                  isGrid
                    ? 'border-b border-slate-200 pb-6 last:border-b-0 last:pb-0'
                    : 'border-b border-slate-200 pb-5 last:border-b-0 last:pb-0',
                )}
                key={product.id}
              >
                <div
                  className={cn(
                    'grid gap-5',
                    isGrid
                      ? 'grid-cols-[8rem_minmax(0,1fr)] md:grid-cols-[10rem_minmax(0,1fr)]'
                      : 'grid-cols-[6.5rem_minmax(0,1fr)]',
                  )}
                >
                  <Link
                    className="relative block aspect-square overflow-hidden"
                    href={href}
                  >
                    {product.primaryImage ? (
                      <Media
                        fill
                        imgClassName="object-contain p-3"
                        resource={product.primaryImage}
                      />
                    ) : null}
                  </Link>

                  <div className="space-y-3">
                    {product.model ? (
                      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                        {product.model}
                      </p>
                    ) : null}

                    <Link
                      className="block text-base leading-6 text-slate-950 hover:opacity-70"
                      href={href}
                    >
                      {product.title}
                    </Link>

                    {product.summary ? (
                      <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                        {product.summary}
                      </p>
                    ) : null}

                    <Link
                      className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:opacity-70"
                      href={href}
                    >
                      View item
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <p className="text-sm leading-7 text-slate-600">
          Related products will appear here once they are connected to this blog.
        </p>
      )}
    </aside>
  )
}
