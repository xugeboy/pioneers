'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { socialLinks } from '@/components/socialLinks'
import { resolveCMSLinkHref } from '@/utilities/resolveCMSLinkHref'
import { cn } from '@/utilities/ui'

type HeaderNavItem = NonNullable<Header['navItems']>[number]

export const MobileDrawer: React.FC<{
  items: HeaderNavItem[]
  onClose: () => void
  open: boolean
}> = ({ items, onClose, open }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <>
      <div
        aria-hidden={!open}
        className={cn(
          'fixed inset-0 z-40 bg-black/45 transition-opacity duration-300 xl:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        aria-hidden={!open}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-[24rem] flex-col bg-[#f7f4ee] shadow-[20px_0_60px_rgba(0,0,0,0.18)] transition-transform duration-300 xl:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-5">
          <Link className="flex items-center" href="/" onClick={onClose}>
            <Logo className="h-10 w-auto" loading="eager" priority="high" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div>
            {items.map((item, index) => {
              const href = resolveCMSLinkHref(item.link)
              const hasSubItems = Array.isArray(item.subItems) && item.subItems.length > 0
              const isOpen = openIndex === index

              if (!hasSubItems) {
                if (!href) {
                  return (
                    <div
                      className="border-b border-slate-200 py-4 text-base font-medium text-slate-800"
                      key={index}
                    >
                      {item.link?.label}
                    </div>
                  )
                }

                return (
                  <Link
                    className="block border-b border-slate-200 py-4 text-base font-medium text-slate-800"
                    href={href}
                    key={index}
                    onClick={onClose}
                    rel={item.link?.newTab ? 'noopener noreferrer' : undefined}
                    target={item.link?.newTab ? '_blank' : undefined}
                  >
                    {item.link?.label}
                  </Link>
                )
              }

              return (
                <div className="border-b border-slate-200" key={index}>
                  <button
                    className="flex w-full items-center justify-between py-4 text-left"
                    onClick={() => {
                      setOpenIndex(isOpen ? null : index)
                    }}
                    type="button"
                  >
                    <span className="text-base font-medium text-slate-800">{item.link?.label}</span>
                    <Plus
                      className={cn(
                        'size-4 text-slate-500 transition-transform duration-200',
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
                            className="block py-2 text-sm font-medium text-slate-800"
                            href={href}
                            onClick={onClose}
                            rel={item.link?.newTab ? 'noopener noreferrer' : undefined}
                            target={item.link?.newTab ? '_blank' : undefined}
                          >
                            {item.link?.label}
                          </Link>
                        )}

                        {item.subItems?.map((subItem, subIndex) => {
                          const subHref = resolveCMSLinkHref(subItem.link)

                          if (!subHref) return null

                          return (
                            <Link
                              className="block py-2 text-sm text-slate-600 transition-colors hover:text-slate-900"
                              href={subHref}
                              key={subIndex}
                              onClick={onClose}
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
              )
            })}
          </div>
        </div>

        <div className="border-t border-slate-200 px-5 py-5">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Social Media
          </div>
          <div className="flex items-center gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon

              return (
                <a
                  aria-label={item.label}
                  className="flex size-11 items-center justify-center text-slate-700 transition-colors hover:text-black"
                  href={item.href}
                  key={item.label}
                >
                  <Icon className="size-4" />
                </a>
              )
            })}
          </div>
        </div>
      </aside>
    </>
  )
}
