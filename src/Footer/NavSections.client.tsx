'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import type { Footer } from '@/payload-types'

import { resolveCMSLinkHref } from '@/utilities/resolveCMSLinkHref'
import { cn } from '@/utilities/ui'

type FooterNavItem = NonNullable<Footer['navItems']>[number]

export const FooterNavSections: React.FC<{ items: FooterNavItem[] }> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      {items.map((item, index) => {
        const href = resolveCMSLinkHref(item.link)
        const hasSubItems = Array.isArray(item.subItems) && item.subItems.length > 0
        const isOpen = openIndex === index

        return (
          <div
            className="lg:border-l lg:border-white/24 lg:pl-8"
            key={`${item.link?.label}-${index}`}
          >
            <div className="hidden space-y-3 lg:block">
              {href ? (
                <Link
                  className="text-sm font-semibold uppercase tracking-[0.08em] text-white"
                  href={href}
                  rel={item.link?.newTab ? 'noopener noreferrer' : undefined}
                  target={item.link?.newTab ? '_blank' : undefined}
                >
                  {item.link?.label}
                </Link>
              ) : (
                <div className="text-sm font-semibold uppercase tracking-[0.08em] text-white">
                  {item.link?.label}
                </div>
              )}

              {hasSubItems && (
                <div className="flex flex-col gap-2 text-sm text-white/80">
                  {item.subItems?.map((subItem, subIndex) => {
                    const subHref = resolveCMSLinkHref(subItem.link)

                    if (!subHref) return null

                    return (
                      <Link
                        className="text-white/80 transition-colors hover:text-white"
                        href={subHref}
                        key={subIndex}
                        rel={subItem.link?.newTab ? 'noopener noreferrer' : undefined}
                        target={subItem.link?.newTab ? '_blank' : undefined}
                      >
                        {subItem.link?.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="border-b border-white/24 lg:hidden">
              <button
                className="flex w-full items-center justify-between py-4 text-left"
                onClick={() => {
                  setOpenIndex(isOpen ? null : index)
                }}
                type="button"
              >
                <span className="text-sm font-semibold uppercase tracking-[0.08em] text-white">
                  {item.link?.label}
                </span>
                <Plus
                  className={cn(
                    'size-4 text-white/80 transition-transform duration-200',
                    isOpen && 'rotate-45',
                  )}
                />
              </button>

              <div
                className={cn(
                  'grid transition-[grid-template-rows] duration-200 ease-out',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="overflow-hidden">
                  <div className="space-y-1 pb-4">
                    {href && (
                      <Link
                        className="block py-2 text-sm font-medium text-white"
                        href={href}
                        rel={item.link?.newTab ? 'noopener noreferrer' : undefined}
                        target={item.link?.newTab ? '_blank' : undefined}
                      >
                        {item.link?.label}
                      </Link>
                    )}

                    {hasSubItems &&
                      item.subItems?.map((subItem, subIndex) => {
                        const subHref = resolveCMSLinkHref(subItem.link)

                        if (!subHref) return null

                        return (
                          <Link
                            className="block py-2 text-sm text-white/80 transition-colors hover:text-white"
                            href={subHref}
                            key={subIndex}
                            rel={subItem.link?.newTab ? 'noopener noreferrer' : undefined}
                            target={subItem.link?.newTab ? '_blank' : undefined}
                          >
                            {subItem.link?.label}
                          </Link>
                        )
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
