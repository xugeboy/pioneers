'use client'

import { cn } from '@/utilities/ui'
import { Menu, SearchIcon } from 'lucide-react'
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
  const searchContainerRef = useRef<HTMLElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const nextQuery = new URLSearchParams(window.location.search).get('q') ?? ''

    setQuery(nextQuery)
    setIsSearchOpen(pathname.startsWith('/search') && nextQuery.length > 0)
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

    const handlePointerDown = (event: MouseEvent) => {
      if (!searchContainerRef.current?.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSearchOpen])

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
  const searchFormClasses = cn(
    'absolute inset-y-0 left-0 right-0 z-30 hidden items-center border-b pl-0 pr-0 transition-opacity duration-200 md:flex',
    isLightTone
      ? 'border-white/65 bg-black/92'
      : 'border-[#2d2d2d]/20 bg-white',
  )
  const searchInputClasses = cn(
    'h-full min-w-0 flex-1 border-0 bg-transparent px-0 pr-1 text-[14px] shadow-none focus-visible:ring-0 focus-visible:outline-none lg:text-[15px]',
    isLightTone
      ? 'text-white placeholder:text-white/68 [text-shadow:0_1px_18px_rgba(0,0,0,0.45)]'
      : 'text-[#2d2d2d] placeholder:text-[#a7a29a]',
  )
  const searchSubmitClasses = cn(
    'inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none',
    isLightTone ? 'text-white hover:bg-white/10' : 'text-[#2d2d2d] hover:bg-black/5',
  )
  const menuButtonClasses = cn(
    'inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[1rem] px-4 text-[15px] font-medium transition-[background-color,color] duration-200 xl:hidden',
    isLightTone
      ? 'bg-transparent text-white hover:bg-white/10'
      : 'bg-transparent text-[#2d2d2d] hover:bg-[#f3f0ea]',
  )

  return (
    <nav
      className="relative flex w-full min-w-0 flex-col gap-3 md:w-auto md:flex-row md:items-center md:gap-4"
      ref={searchContainerRef}
    >
      <div
        className={cn(
          'hidden min-w-0 flex-1 items-center gap-4 transition-opacity duration-150 xl:flex',
          isSearchOpen && 'pointer-events-none opacity-0',
        )}
      >
        <ProductMegaNav groups={megaNavGroups} tone={tone} />

        <div className="ml-auto flex min-w-0 items-center gap-1 md:gap-2">
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
      </div>

      <form
        className={cn(
          searchFormClasses,
          isSearchOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
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
          ref={searchInputRef}
          type="search"
          value={query}
        />
        <button aria-label="Search the site" className={searchSubmitClasses} type="submit">
          <SearchIcon className="size-4" />
        </button>
      </form>

      <div className="flex w-full min-w-0 items-center justify-end gap-2 md:w-auto">
        <div className="relative flex shrink-0 items-center">
          <button
            aria-expanded={isSearchOpen}
            aria-label={isSearchOpen ? 'Submit search' : 'Open search'}
            className={searchToggleClasses}
            onClick={() => {
              setIsSearchOpen((currentValue) => !currentValue)
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
    </nav>
  )
}
