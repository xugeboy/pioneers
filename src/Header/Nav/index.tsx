'use client'

import { cn } from '@/utilities/ui'
import { Menu, SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { resolveCMSLinkHref } from '@/utilities/resolveCMSLinkHref'

type HeaderNavProps = {
  data: HeaderType
  onOpenMenu: () => void
  tone?: 'dark' | 'light'
}

type NavLinkData = NonNullable<HeaderType['navItems']>[number]['link']

export const HeaderNav: React.FC<HeaderNavProps> = ({ data, onOpenMenu, tone = 'dark' }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const navItems = (data?.navItems || []) as Array<
    NonNullable<HeaderType['navItems']>[number] & {
      subItems?: Array<{ link?: NavLinkData }>
    }
  >

  const isLightTone = tone === 'light'
  const navItemShellClasses = cn(
    'inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-[15px] font-medium no-underline transition-[background-color,color,box-shadow] duration-200 hover:no-underline lg:text-base',
    isLightTone
      ? 'text-white [text-shadow:0_1px_18px_rgba(0,0,0,0.55)] hover:bg-white/14'
      : 'text-[#2d2d2d] hover:bg-[#f1eee8]',
  )
  const navTextClasses = cn(
    'leading-none no-underline transition-colors hover:no-underline',
    isLightTone ? 'text-white' : 'text-[#2d2d2d]',
  )
  const dropdownPanelClasses = cn(
    'min-w-[15rem] rounded-[1.5rem] border p-2 shadow-[0_20px_48px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-[background-color,border-color]',
    isLightTone
      ? 'border-white/20 bg-black/68 text-white'
      : 'border-black/8 bg-white/96 text-black',
  )
  const dropdownLinkClasses = cn(
    'block rounded-[1rem] px-4 py-3 text-[15px] font-medium no-underline transition-[background-color,color] duration-150 hover:no-underline',
    isLightTone ? 'text-white hover:bg-white/10' : 'text-[#2d2d2d] hover:bg-[#f3f0ea]',
  )
  const searchShellClasses = cn(
    'relative min-w-0 flex-1 overflow-hidden rounded-[1rem] border transition-[background-color,border-color,box-shadow] duration-200 md:w-[16rem] md:flex-none md:rounded-full lg:w-[18rem]',
    isLightTone
      ? 'border-white/38 bg-black/28 backdrop-blur-md hover:border-white/55 hover:bg-black/36 focus-within:border-white/70 focus-within:bg-black/40 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.08)]'
      : 'border-[#dad7d1] bg-[#faf9f7] hover:border-[#c8c1b7] hover:bg-white focus-within:border-[#b8b0a6] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(36,79,44,0.08)]',
  )
  const searchInputClasses = cn(
    'h-11 w-full border-0 bg-transparent pr-12 text-[15px] shadow-none focus-visible:ring-0 focus-visible:outline-none',
    isLightTone
      ? 'text-white placeholder:text-white/72 [text-shadow:0_1px_18px_rgba(0,0,0,0.45)]'
      : 'text-[#2d2d2d] placeholder:text-[#a7a29a]',
  )
  const searchButtonClasses = cn(
    'absolute right-1 top-1 inline-flex size-9 items-center justify-center rounded-full transition-colors',
    isLightTone ? 'text-white hover:bg-white/12' : 'text-[#2d2d2d] hover:bg-black/5',
  )
  const menuButtonClasses = cn(
    'inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[1rem] border px-4 text-[15px] font-medium transition-[background-color,border-color,color] duration-200 xl:hidden',
    isLightTone
      ? 'border-white/35 bg-black/28 text-white backdrop-blur-md hover:border-white/55 hover:bg-black/36'
      : 'border-[#dad7d1] bg-[#faf9f7] text-[#2d2d2d] hover:border-[#c8c1b7] hover:bg-white',
  )

  return (
    <nav className="flex w-full min-w-0 flex-col gap-3 md:w-auto md:flex-row md:items-center md:justify-end md:gap-4">
      <div className="hidden flex-wrap items-center gap-1 xl:flex md:gap-2">
        {navItems.map((item, i) => {
          const { link, subItems } = item
          const hasSubItems = Array.isArray(subItems) && subItems.length > 0
          const href = resolveCMSLinkHref(link)

          if (!hasSubItems) {
            if (!href) return null

            return (
              <Link
                className={navItemShellClasses}
                href={href}
                key={i}
                rel={link?.newTab ? 'noopener noreferrer' : undefined}
                target={link?.newTab ? '_blank' : undefined}
              >
                <span className={navTextClasses}>{link?.label}</span>
              </Link>
            )
          }

          return (
            <div className="group relative py-1" key={i}>
              <div className={cn(navItemShellClasses, 'pr-3')}>
                {href ? (
                  <Link
                    className={navTextClasses}
                    href={href}
                    rel={link?.newTab ? 'noopener noreferrer' : undefined}
                    target={link?.newTab ? '_blank' : undefined}
                  >
                    {link?.label}
                  </Link>
                ) : (
                  <span className={navTextClasses}>{link?.label}</span>
                )}
                <svg
                  aria-hidden="true"
                  className="size-3 transition-transform duration-200 group-hover:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    clipRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.7a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>

              <div
                className={cn(
                  'pointer-events-none invisible absolute left-1/2 top-full z-20 w-max -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-all duration-200',
                  'group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100',
                  'group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100',
                )}
              >
                <div className={dropdownPanelClasses}>
                  {subItems?.map((subItem, subIndex) => {
                    const subHref = resolveCMSLinkHref(subItem.link)

                    if (!subHref) return null

                    return (
                      <Link
                        className={dropdownLinkClasses}
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
          )
        })}
      </div>

      <div className="flex w-full min-w-0 items-center gap-2 md:w-auto">
        <form
          className={searchShellClasses}
          onSubmit={(event) => {
            event.preventDefault()

            const trimmedQuery = query.trim()

            router.push(trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : '/search')
          }}
        >
          <label className="sr-only" htmlFor="site-search">
            Search the site
          </label>
          <input
            autoComplete="off"
            className={searchInputClasses}
            id="site-search"
            onChange={(event) => {
              setQuery(event.target.value)
            }}
            placeholder="Search products, blogs, pages"
            type="search"
            value={query}
          />
          <button aria-label="Search the site" className={searchButtonClasses} type="submit">
            <SearchIcon className="size-4" />
          </button>
        </form>

        <button className={menuButtonClasses} onClick={onOpenMenu} type="button">
          <Menu className="size-4" />
        </button>
      </div>
    </nav>
  )
}
