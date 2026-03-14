import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { socialLinks } from '@/components/socialLinks'
import { FooterNavSections } from '@/Footer/NavSections.client'
import { Logo } from '@/components/Logo/Logo'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()
  const navItems = (footerData?.navItems || []) as NonNullable<Footer['navItems']>

  const legalLinks = [
    { href: '/accessibility', label: 'Accessibility' },
    { href: '/terms', label: 'Terms of Use' },
    { href: '/privacy', label: 'Privacy Policy' },
  ]

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-900">
      <div className="container py-10 md:py-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2.8fr)] lg:gap-10">
          <div className="space-y-4 md:space-y-5">
            <Link className="flex items-start shrink-0" href="/">
              <Logo className="h-10 w-auto md:h-12" />
            </Link>

            <div className="max-w-md space-y-3">
              <p className="text-lg font-semibold leading-snug text-slate-900">
                Built for pioneers who push industries forward.
              </p>
              <p className="text-sm leading-6 text-slate-500 md:text-[15px]">
                We engineer reliable cargo control solutions for brands, distributors, and
                outdoor innovators.
              </p>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-3 lg:gap-8">
            <FooterNavSections items={navItems} />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 bg-slate-900 text-slate-200">
        <div className="container flex flex-col gap-4 py-4 text-xs md:flex-row md:items-center md:justify-between">
          <div>(c) {new Date().getFullYear()} Pioneers. All Rights Reserved.</div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {legalLinks.map((item) => (
              <Link className="text-slate-300 hover:text-white" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon

              return (
                <a
                  aria-label={item.label}
                  className="flex h-9 w-9 items-center justify-center text-slate-300 transition-colors hover:text-white"
                  href={item.href}
                  key={item.label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
