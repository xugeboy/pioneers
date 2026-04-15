'use client'

import { ChevronDown, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

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
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeTimeoutRef = useRef<number | null>(null)
  const activeItem =
    group.items.find((item) => item.id === activeItemID) || defaultItem || null
  const isLightTone = tone === 'light'

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current != null) {
      window.clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
  }

  const openMenu = () => {
    clearCloseTimeout()
    setIsOpen(true)
  }

  const scheduleClose = () => {
    clearCloseTimeout()
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false)
      closeTimeoutRef.current = null
    }, 160)
  }

  useEffect(() => {
    return () => {
      clearCloseTimeout()
    }
  }, [])

  const triggerClasses = cn(
    'inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-[14px] font-medium no-underline transition-[background-color,color,box-shadow] duration-200 hover:no-underline lg:text-[15px]',
    isLightTone
      ? 'text-white [text-shadow:0_1px_18px_rgba(0,0,0,0.55)] hover:bg-white/14'
      : 'text-[#2d2d2d] hover:bg-[#f1eee8]',
  )
  const panelClasses = cn(
    'border-t border-b shadow-[0_18px_45px_rgba(8,15,10,0.08)]',
    isLightTone ? 'border-white/12 bg-black/94 text-white' : 'border-[#e4e7df] bg-white text-[#162019]',
  )
  const listItemClasses = cn(
    'flex items-center justify-between gap-4 rounded-full px-4 py-3 text-left text-[14px] font-medium transition-[background-color,color] duration-150 motion-reduce:transition-none lg:text-[15px]',
    isLightTone ? 'text-white/88 hover:bg-white/10' : 'text-[#2b342d] hover:bg-[#eff3ec]',
  )
  const listItemActiveClasses = cn(
    isLightTone ? 'bg-white/12 text-white' : 'bg-[#eff3ec] text-[#162019]',
  )
  const productCardClasses = cn(
    'group/product grid gap-3 text-center transition-[opacity,color] duration-200 motion-reduce:transition-none hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36513f]/25',
    isLightTone ? 'text-white hover:opacity-80' : 'text-[#162019] hover:opacity-80',
  )

  if (!defaultItem || !activeItem) {
    return null
  }

  return (
    <div
      className="group relative py-1"
      onMouseEnter={() => {
        setActiveItemID(defaultItem.id)
        openMenu()
      }}
      onMouseLeave={(event) => {
        const nextTarget = event.relatedTarget

        if (nextTarget instanceof Node && panelRef.current?.contains(nextTarget)) {
          return
        }

        scheduleClose()
      }}
    >
      <Link
        aria-expanded="false"
        className={cn(triggerClasses, 'pr-3')}
        href={group.href}
        onFocus={() => {
          setActiveItemID(defaultItem.id)
          openMenu()
        }}
      >
        <span className="whitespace-nowrap">{group.label}</span>
        <ChevronDown
          className={cn(
            'size-3.5 transition-transform duration-200 motion-reduce:transition-none',
            isOpen && 'rotate-180',
          )}
        />
      </Link>

      <div
        className={cn(
          'fixed inset-x-0 z-30 transition-opacity duration-200 motion-reduce:transition-none',
          isOpen ? 'pointer-events-auto visible opacity-100' : 'pointer-events-none invisible opacity-0',
        )}
        onMouseEnter={() => {
          openMenu()
        }}
        onMouseLeave={() => {
          scheduleClose()
        }}
        ref={panelRef}
        style={{ top: 'var(--header-height, 96px)' }}
      >
        <div className={panelClasses}>
          <div className="container">
            <div className="grid min-h-[20rem] grid-cols-[18rem_minmax(0,1fr)] gap-10 py-8">
              <div className="space-y-1">
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

              <div className="flex min-w-0 items-center">
                {activeItem.products.length > 0 ? (
                  <div className="grid w-full grid-cols-5 gap-8">
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
                      'flex h-full min-h-[12rem] w-full items-center justify-center rounded-[1.25rem] border border-dashed px-6 text-center text-sm',
                      isLightTone ? 'border-white/18 text-white/72' : 'border-[#d5ddd4] text-[#556459]',
                    )}
                  >
                    <p>No featured products yet.</p>
                  </div>
                )}
              </div>
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
      <div className="relative mx-auto aspect-square w-full max-w-[10rem] overflow-hidden">
        {hasImage ? (
          <Media fill imgClassName="object-contain p-2" resource={product.primaryImage} />
        ) : (
          <div
            className={cn(
              'absolute inset-0 rounded-[1rem]',
              isLightTone ? 'bg-white/8' : 'bg-[#f3f5f1]',
            )}
          />
        )}
      </div>
      <p className="text-sm font-medium leading-5">{product.title}</p>
    </Link>
  )
}
