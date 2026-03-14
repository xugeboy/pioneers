'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { MobileDrawer } from '@/Header/MobileDrawer'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { cn } from '@/utilities/ui'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const [isInteractive, setIsInteractive] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    setIsInteractive(false)
    setIsMenuOpen(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const isImmersive = headerTheme === 'dark' || (pathname === '/' && headerTheme == null)
  const showSolidHeader = isMenuOpen || isInteractive || !isImmersive
  const useTransparentTone = isImmersive && !showSolidHeader

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300',
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
            onOpenMenu={() => {
              setIsMenuOpen(true)
            }}
            tone={useTransparentTone ? 'light' : 'dark'}
          />
        </div>
      </header>

      <MobileDrawer
        items={data.navItems || []}
        onClose={() => {
          setIsMenuOpen(false)
        }}
        open={isMenuOpen}
      />
    </>
  )
}
