'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import type { HeaderMegaNavGroup } from '@/Header/getMegaNavData'

import { cn } from '@/utilities/ui'

type MobileProductMegaNavProps = {
  groups: HeaderMegaNavGroup[]
  onClose: () => void
}

export const MobileProductMegaNav: React.FC<MobileProductMegaNavProps> = ({ groups, onClose }) => {
  const [openGroupID, setOpenGroupID] = useState<number | null>(groups[0]?.id ?? null)
  const [openItemID, setOpenItemID] = useState<string | null>(null)

  if (groups.length === 0) {
    return null
  }

  return (
    <section className="mb-6">
      <div className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Product Categories
      </div>

      <div className="space-y-3">
        {groups.map((group) => {
          const isGroupOpen = openGroupID === group.id

          return (
            <div
              className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white/80"
              key={group.id}
            >
              <button
                className="flex w-full items-center justify-between px-4 py-4 text-left"
                onClick={() => {
                  setOpenGroupID(isGroupOpen ? null : group.id)
                  setOpenItemID(null)
                }}
                type="button"
              >
                <span className="text-base font-semibold text-slate-900">{group.label}</span>
                <ChevronDown
                  className={cn('size-4 text-slate-500 transition-transform duration-200', isGroupOpen && 'rotate-180')}
                />
              </button>

              <div
                className={cn(
                  'grid transition-[grid-template-rows] duration-200 ease-out',
                  isGroupOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="overflow-hidden">
                  <div className="space-y-2 border-t border-slate-200 px-3 py-3">
                    {group.items.map((item) => {
                      const isItemOpen = openItemID === item.id
                      const href = item.href

                      return (
                        <div
                          className="overflow-hidden rounded-[1rem] border border-slate-200 bg-[#f8f6f1]"
                          key={item.id}
                        >
                          <div className="flex items-center gap-2 px-3 py-3">
                            <Link
                              className="flex-1 text-sm font-medium text-slate-900"
                              href={href}
                              onClick={onClose}
                            >
                              {item.label}
                            </Link>
                            <button
                              className="inline-flex size-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white"
                              onClick={() => {
                                setOpenItemID(isItemOpen ? null : item.id)
                              }}
                              type="button"
                            >
                              <ChevronDown
                                className={cn('size-4 transition-transform duration-200', isItemOpen && 'rotate-180')}
                              />
                            </button>
                          </div>

                          <div
                            className={cn(
                              'grid transition-[grid-template-rows] duration-200 ease-out',
                              isItemOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                            )}
                          >
                            <div className="overflow-hidden">
                              <div className="border-t border-slate-200 px-3 py-3">
                                <Link
                                  className="inline-flex text-xs font-semibold uppercase tracking-[0.16em] text-[#36513f]"
                                  href={href}
                                  onClick={onClose}
                                >
                                  View Category
                                </Link>

                                <div className="mt-3 space-y-2">
                                  {item.products.slice(0, 3).map((product) => {
                                    const productHref = product.slug ? `/products/${product.slug}` : '/products'

                                    return (
                                      <Link
                                        className="block text-sm text-slate-700 transition-colors hover:text-slate-950"
                                        href={productHref}
                                        key={product.id}
                                        onClick={onClose}
                                      >
                                        {product.title}
                                      </Link>
                                    )
                                  })}

                                  {item.products.length === 0 ? (
                                    <p className="text-sm text-slate-500">
                                      Featured products will appear here after they are configured.
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
