'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { MobileDrawer } from '@/Header/MobileDrawer'
import type { HeaderMegaNavGroup } from '@/Header/getMegaNavData'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { cn } from '@/utilities/ui'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
  megaNavGroups: HeaderMegaNavGroup[]
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data, megaNavGroups }) => {
  const [isInteractive, setIsInteractive] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(96)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const headerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    setHeaderTheme(null)
    setIsInteractive(false)
    setIsMenuOpen(false)
    setHasScrolled(window.scrollY > 8)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    const updateScrollState = () => {
      setHasScrolled(window.scrollY > 8)
    }

    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScrollState)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    const headerElement = headerRef.current

    if (!headerElement || typeof ResizeObserver === 'undefined') {
      return
    }

    const updateHeaderHeight = () => {
      setHeaderHeight(headerElement.getBoundingClientRect().height)
    }

    updateHeaderHeight()

    const resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight()
    })

    resizeObserver.observe(headerElement)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const allowTransparentHeader = pathname === '/' || headerTheme === 'dark'
  const isImmersive =
    allowTransparentHeader && (headerTheme === 'dark' || headerTheme == null)
  const showSolidHeader = hasScrolled || isMenuOpen || isInteractive || !isImmersive
  const useTransparentTone = isImmersive && !showSolidHeader

  return (
    <>
      <header
        className={cn(
          'absolute inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300 md:fixed',
          showSolidHeader ? 'bg-white shadow-[0_14px_40px_rgba(0,0,0,0.08)]' : 'bg-transparent',
        )}
        onBlurCapture={(event) => {
          const nextTarget = event.relatedTarget

          if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
            setIsInteractive(false)
          }
        }}
        onFocusCapture={() => {
          setIsInteractive(true)
        }}
        onMouseEnter={() => {
          setIsInteractive(true)
        }}
        onMouseLeave={() => {
          setIsInteractive(false)
        }}
        ref={headerRef}
        style={
          {
            '--header-height': `${headerHeight}px`,
          } as React.CSSProperties
        }
      >
        <div className="container flex w-full items-center justify-between gap-3 py-3 md:gap-6 md:py-4">
          <Link className="shrink-0" href="/">
            <Logo
              className="h-10 w-auto sm:h-11 md:h-16"
              loading="eager"
              priority="high"
              src={useTransparentTone ? '/pioneers-logo-white.png' : '/pioneers-logo.png'}
            />
          </Link>

          <HeaderNav
            data={data}
            megaNavGroups={megaNavGroups}
            onOpenMenu={() => {
              setIsMenuOpen(true)
            }}
            tone={useTransparentTone ? 'light' : 'dark'}
          />
        </div>
      </header>

      <MobileDrawer
        items={data.navItems || []}
        megaNavGroups={megaNavGroups}
        onClose={() => {
          setIsMenuOpen(false)
        }}
        open={isMenuOpen}
      />
    </>
  )
}
