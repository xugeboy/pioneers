'use client'

import { ChevronDown, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import type { HeaderMegaNavGroup, HeaderMegaNavItem } from '@/Header/getMegaNavData'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type ProductMegaNavProps = {
  groups: HeaderMegaNavGroup[]
  tone: 'dark' | 'light'
}

type GroupItemProps = {
  group: HeaderMegaNavGroup
  tone: 'dark' | 'light'
}

export const ProductMegaNav: React.FC<ProductMegaNavProps> = ({ groups, tone }) => {
  if (groups.length === 0) {
    return null
  }

  return (
    <div className="relative hidden min-w-0 items-center gap-1 xl:flex">
      {groups.map((group) => (
        <DesktopMegaNavGroup key={group.id} group={group} tone={tone} />
      ))}
    </div>
  )
}

const DesktopMegaNavGroup: React.FC<GroupItemProps> = ({ group, tone }) => {
  const defaultItem = group.items[0]
  const [activeItemID, setActiveItemID] = useState(defaultItem?.id ?? null)
  const activeItem =
    group.items.find((item) => item.id === activeItemID) || defaultItem || null
  const isLightTone = tone === 'light'

  const triggerClasses = cn(
    'inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-medium no-underline transition-[background-color,color,box-shadow] duration-200 hover:no-underline lg:text-base',
    isLightTone
      ? 'text-white [text-shadow:0_1px_18px_rgba(0,0,0,0.55)] hover:bg-white/14'
      : 'text-[#2d2d2d] hover:bg-[#f1eee8]',
  )
  const panelClasses = cn(
    'rounded-[2rem] border shadow-[0_28px_80px_rgba(8,15,10,0.18)] backdrop-blur-xl',
    isLightTone ? 'border-white/20 bg-black/72 text-white' : 'border-[#dadfd7] bg-white/98 text-[#162019]',
  )
  const listItemClasses = cn(
    'flex items-center justify-between gap-4 rounded-[1rem] px-4 py-3 text-left text-[15px] font-medium transition-[background-color,color] duration-150',
    isLightTone ? 'text-white/88 hover:bg-white/10' : 'text-[#2b342d] hover:bg-[#eff3ec]',
  )
  const listItemActiveClasses = cn(
    isLightTone ? 'bg-white/12 text-white' : 'bg-[#eff3ec] text-[#162019]',
  )
  const productCardClasses = cn(
    'group/product grid gap-4 rounded-[1.35rem] border p-3 text-left transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36513f]/25',
    isLightTone
      ? 'border-white/12 bg-white/6 hover:border-white/22 hover:bg-white/10'
      : 'border-[#d8dfd7] bg-[#f7f9f5] hover:border-[#b7c5b8] hover:bg-white hover:shadow-[0_18px_40px_rgba(16,25,20,0.08)]',
  )

  if (!defaultItem || !activeItem) {
    return null
  }

  return (
    <div
      className="group relative py-1"
      onMouseEnter={() => {
        setActiveItemID(defaultItem.id)
      }}
      onMouseLeave={() => {
        setActiveItemID(defaultItem.id)
      }}
    >
      <Link
        aria-expanded="false"
        className={cn(triggerClasses, 'pr-3')}
        href={group.href}
        onFocus={() => {
          setActiveItemID(defaultItem.id)
        }}
      >
        <span>{group.label}</span>
        <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" />
      </Link>

      <div
        className={cn(
          'pointer-events-none invisible absolute left-0 top-full z-30 pt-4 opacity-0 transition-all duration-200',
          'group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100',
          'group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100',
        )}
      >
        <div className={cn(panelClasses, 'w-[min(72rem,calc(100vw-8rem))] overflow-hidden')}>
          <div className="grid min-h-[26rem] grid-cols-[18rem_minmax(0,1fr)]">
            <div
              className={cn(
                'border-r p-5',
                isLightTone ? 'border-white/10 bg-white/[0.04]' : 'border-[#e1e7de] bg-[#f7faf6]',
              )}
            >
              <div className="mb-4 px-4">
                <p
                  className={cn(
                    'text-[0.7rem] font-semibold uppercase tracking-[0.22em]',
                    isLightTone ? 'text-white/64' : 'text-[#5d6f62]',
                  )}
                >
                  Product Family
                </p>
              </div>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = item.id === activeItem.id

                  return (
                    <Link
                      className={cn(listItemClasses, isActive && listItemActiveClasses)}
                      href={item.href}
                      key={item.id}
                      onFocus={() => {
                        setActiveItemID(item.id)
                      }}
                      onMouseEnter={() => {
                        setActiveItemID(item.id)
                      }}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="size-4 shrink-0" />
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="grid gap-6 p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p
                    className={cn(
                      'text-[0.7rem] font-semibold uppercase tracking-[0.22em]',
                      isLightTone ? 'text-white/64' : 'text-[#5d6f62]',
                    )}
                  >
                    Hot Products
                  </p>
                  <div className="space-y-1">
                    <h3 className="font-display text-3xl">{activeItem.label}</h3>
                    <p className={cn('max-w-2xl text-sm', isLightTone ? 'text-white/74' : 'text-[#556459]')}>
                      Explore highlighted products curated for this category.
                    </p>
                  </div>
                </div>

                <Link
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:no-underline',
                    isLightTone ? 'bg-white/10 text-white hover:bg-white/16' : 'bg-[#eef3eb] text-[#213128] hover:bg-[#e5ede2]',
                  )}
                  href={activeItem.href}
                >
                  View category
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              {activeItem.products.length > 0 ? (
                <div className="grid grid-cols-5 gap-4">
                  {activeItem.products.map((product) => (
                    <MegaNavProductCard
                      isLightTone={isLightTone}
                      key={product.id}
                      product={product}
                      productCardClasses={productCardClasses}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className={cn(
                    'grid place-items-center rounded-[1.5rem] border border-dashed p-10 text-center',
                    isLightTone ? 'border-white/18 bg-white/[0.04]' : 'border-[#d5ddd4] bg-[#f7faf6]',
                  )}
                >
                  <div className="max-w-sm space-y-3">
                    <p className="font-display text-2xl">No featured products yet</p>
                    <p className={cn('text-sm leading-6', isLightTone ? 'text-white/72' : 'text-[#556459]')}>
                      This category is ready for navigation. Add curated products in Payload to highlight them here.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const MegaNavProductCard: React.FC<{
  isLightTone: boolean
  product: HeaderMegaNavItem['products'][number]
  productCardClasses: string
}> = ({ isLightTone, product, productCardClasses }) => {
  const href = product.slug ? `/products/${product.slug}` : '/products'
  const hasImage = product.primaryImage && typeof product.primaryImage === 'object'

  return (
    <Link className={productCardClasses} href={href}>
      <div
        className={cn(
          'relative aspect-square overflow-hidden rounded-[1rem]',
          isLightTone
            ? 'bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.22),_transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_100%)]'
            : 'bg-[radial-gradient(circle_at_top,_rgba(54,81,63,0.16),_transparent_52%),linear-gradient(180deg,#fbfcf8_0%,#edf1ea_100%)]',
        )}
      >
        {hasImage ? (
          <Media fill imgClassName="object-contain p-4" resource={product.primaryImage} />
        ) : (
          <div className="absolute inset-0" />
        )}
      </div>
      <div className="space-y-1">
        {product.model ? (
          <p
            className={cn(
              'text-[0.68rem] font-semibold uppercase tracking-[0.18em]',
              isLightTone ? 'text-white/58' : 'text-[#5d6f62]',
            )}
          >
            {product.model}
          </p>
        ) : null}
        <p className="text-sm font-semibold leading-5">{product.title}</p>
      </div>
    </Link>
  )
}
