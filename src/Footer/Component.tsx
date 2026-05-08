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
    { href: '/terms', label: 'Terms' },
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/sitemap.xml', label: 'Sitemap' },
  ]

  return (
    <footer
      className="border-t border-white/20 bg-[#00A650] bg-repeat text-white md:mt-auto"
      style={{ backgroundImage: "url('/topography.svg')", backgroundSize: '1840px auto' }}
    >
      <div className="container py-10 md:py-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2.8fr)] lg:gap-10">
          <div className="space-y-4 md:space-y-5">
            <Link className="flex items-start shrink-0" href="/">
              <Logo className="h-10 w-auto md:h-12" src="/pioneers-logo-pure-white.png" />
            </Link>

            <div className="max-w-md space-y-3">
              <p className="text-lg font-semibold leading-snug text-white">
                Built for pioneers who push industries forward.
              </p>
              <p className="text-sm leading-6 text-white/84 md:text-[15px]">
                PioneersGears is your expert in application-driven cargo control and mobility
                restraints. We design and manufacture purpose-built, OEM/ODM custom tie-down
                solutions for your specific industry scenarios.
              </p>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-3 lg:gap-8">
            <FooterNavSections items={navItems} />
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 text-white">
        <div className="container flex flex-col gap-4 py-4 text-xs md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} PioneersGears. All Rights Reserved.</div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            {legalLinks.map((item) => (
              <Link
                className="text-white/90 transition-colors hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((item) => {
              return (
                <a
                  aria-label={item.label}
                  className="flex h-9 w-9 items-center justify-center text-white/90 transition-colors hover:text-white"
                  href={item.href}
                  key={item.label}
                >
                  <svg aria-hidden="true" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d={item.path} />
                  </svg>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}
