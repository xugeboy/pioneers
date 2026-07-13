'use client'

import { cn } from '@/utilities/ui'
import { Menu, SearchIcon, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import type { HeaderMegaNavGroup } from '@/Header/getMegaNavData'
import type { Header as HeaderType } from '@/payload-types'

import { resolveCMSLinkHref } from '@/utilities/resolveCMSLinkHref'
import { ProductMegaNav } from './ProductMegaNav'

type HeaderNavProps = {
  data: HeaderType
  megaNavGroups: HeaderMegaNavGroup[]
  onOpenMenu: () => void
  tone?: 'dark' | 'light'
}

type NavLinkData = NonNullable<HeaderType['navItems']>[number]['link']

export const HeaderNav: React.FC<HeaderNavProps> = ({
  data,
  megaNavGroups,
  onOpenMenu,
  tone = 'dark',
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const nextQuery = new URLSearchParams(window.location.search).get('q') ?? ''

    setQuery(nextQuery)
    setIsSearchOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isSearchOpen) {
      return
    }

    searchInputRef.current?.focus()
  }, [isSearchOpen])

  useEffect(() => {
    if (!isSearchOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSearchOpen])

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedQuery = query.trim()

    setIsSearchOpen(false)
    router.push(trimmedQuery ? `/search?q=${encodeURIComponent(trimmedQuery)}` : '/search')
  }

  const navItems = (data?.navItems || []) as Array<
    NonNullable<HeaderType['navItems']>[number] & {
      subItems?: Array<{ link?: NavLinkData }>
    }
  >

  const isLightTone = tone === 'light'
  const navItemShellClasses = cn(
    'inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2.5 text-[14px] font-medium no-underline transition-[background-color,color,box-shadow] duration-200 hover:no-underline lg:text-[15px]',
    isLightTone
      ? 'text-white [text-shadow:0_1px_18px_rgba(0,0,0,0.55)] hover:bg-white/14'
      : 'text-[#2d2d2d] hover:bg-[#f1eee8]',
  )
  const navTextClasses = cn(
    'leading-none whitespace-nowrap no-underline transition-colors hover:no-underline',
    isLightTone ? 'text-white' : 'text-[#2d2d2d]',
  )
  const dropdownPanelClasses = cn(
    'min-w-[15rem] rounded-[1.5rem] border p-2 shadow-[0_20px_48px_rgba(0,0,0,0.16)] backdrop-blur-xl transition-[background-color,border-color]',
    isLightTone
      ? 'border-white/20 bg-black/68 text-white'
      : 'border-black/8 bg-white/96 text-black',
  )
  const dropdownLinkClasses = cn(
    'block rounded-[1rem] px-4 py-3 text-[14px] font-medium no-underline transition-[background-color,color] duration-150 hover:no-underline lg:text-[15px]',
    isLightTone ? 'text-white hover:bg-white/10' : 'text-[#2d2d2d] hover:bg-[#f3f0ea]',
  )
  const searchToggleClasses = cn(
    'inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-[background-color,color,box-shadow] duration-200',
    isLightTone
      ? 'text-white [text-shadow:0_1px_18px_rgba(0,0,0,0.45)] hover:bg-white/12 focus-visible:bg-white/12 focus-visible:outline-none'
      : 'text-[#2d2d2d] hover:bg-[#f3f0ea] focus-visible:bg-[#f3f0ea] focus-visible:outline-none',
  )
  const searchInputClasses = cn(
    'h-14 min-w-0 flex-1 border-0 bg-transparent px-0 text-base text-[#1f2933] shadow-none outline-none placeholder:text-[#8a928d] focus-visible:ring-0 focus-visible:outline-none md:h-16 md:text-lg',
  )
  const searchSubmitClasses = cn(
    'inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[#1f2933] transition-colors hover:bg-black/5 focus-visible:bg-black/5 focus-visible:outline-none',
  )
  const menuButtonClasses = cn(
    'inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[1rem] px-4 text-[15px] font-medium transition-[background-color,color] duration-200 xl:hidden',
    isLightTone
      ? 'bg-transparent text-white hover:bg-white/10'
      : 'bg-transparent text-[#2d2d2d] hover:bg-[#f3f0ea]',
  )
  return (
    <nav className="relative flex w-full min-w-0 flex-1 flex-col gap-3 md:flex-row md:items-center md:gap-4">
      <div
        className={cn(
          'hidden min-w-0 flex-1 items-center justify-end gap-1 transition-opacity duration-150 xl:flex',
        )}
      >
        <ProductMegaNav groups={megaNavGroups} tone={tone} />

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

      <div className="flex w-full min-w-0 items-center justify-end gap-2 md:w-auto">
        <div className="relative flex shrink-0 items-center">
          <button
            aria-expanded={isSearchOpen}
            aria-label="Open search"
            className={searchToggleClasses}
            onClick={() => {
              setIsSearchOpen(true)
            }}
            type="button"
          >
            <SearchIcon className="size-4" />
          </button>
        </div>

        <button className={menuButtonClasses} onClick={onOpenMenu} type="button">
          <Menu className="size-4" />
        </button>
      </div>

      {isSearchOpen ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/45 px-4 pt-24 backdrop-blur-[2px] md:px-8 md:pt-32"
          onClick={() => {
            setIsSearchOpen(false)
          }}
          role="dialog"
        >
          <form
            className="flex w-full max-w-3xl items-center gap-2 rounded-lg border border-white/70 bg-white px-4 py-3 shadow-[0_24px_80px_rgba(0,0,0,0.22)] md:px-5"
            onClick={(event) => {
              event.stopPropagation()
            }}
            onSubmit={submitSearch}
          >
            <label className="sr-only" htmlFor="site-search">
              Search the site
            </label>
            <SearchIcon aria-hidden="true" className="size-5 shrink-0 text-[#66756b]" />
            <input
              autoComplete="off"
              className={searchInputClasses}
              id="site-search"
              onChange={(event) => {
                setQuery(event.target.value)
              }}
              placeholder="Search products, blogs, pages"
              ref={searchInputRef}
              type="search"
              value={query}
            />
            <button aria-label="Search the site" className={searchSubmitClasses} type="submit">
              <SearchIcon className="size-5" />
            </button>
            <button
              aria-label="Close search"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[#66756b] transition-colors hover:bg-black/5 focus-visible:bg-black/5 focus-visible:outline-none"
              onClick={() => {
                setIsSearchOpen(false)
              }}
              type="button"
            >
              <X className="size-5" />
            </button>
          </form>
        </div>
      ) : null}
    </nav>
  )
}
