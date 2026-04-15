import Link from 'next/link'
import React from 'react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'

export type BlogRelatedProduct = Pick<
  Product,
  'id' | 'title' | 'slug' | 'primaryImage' | 'summary' | 'model'
>

export const BlogRelatedProductsSidebar: React.FC<{
  products: BlogRelatedProduct[]
}> = ({ products }) => {
  return (
    <aside className="space-y-6">
      <div>
        <p className="font-display text-sm uppercase tracking-[0.2em] text-slate-900">
          Related Products
        </p>
      </div>

      {products.length > 0 ? (
        <div className="space-y-5">
          {products.map((product) => {
            const href = product.slug ? `/products/${product.slug}` : '/products'

            return (
              <article className="border-b border-slate-200 pb-5 last:border-b-0 last:pb-0" key={product.id}>
                <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4">
                  <Link
                    className="relative block aspect-square overflow-hidden bg-slate-100"
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

                    <Link className="block text-base leading-6 text-slate-950 hover:opacity-70" href={href}>
                      {product.title}
                    </Link>

                    {product.summary ? (
                      <p className="line-clamp-2 text-sm leading-6 text-slate-600">{product.summary}</p>
                    ) : null}

                    <Link
                      className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:opacity-70"
                      href={href}
                    >
                      View item
                      <span aria-hidden="true">→</span>
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
