'use client'

import React, { useEffect } from 'react'

import type { FullscreenHeroBlock as FullscreenHeroBlockProps } from '@/payload-types'

import { Media } from '@/components/Media'
import { useHeaderTheme } from '@/providers/HeaderTheme'

export const FullscreenHeroBlock: React.FC<
  FullscreenHeroBlockProps & { disableInnerContainer?: boolean }
> = ({ backgroundImage }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  return (
    <section className="relative -mt-[10.5rem] min-h-[100svh] overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Media fill priority imgClassName="object-cover object-center" resource={backgroundImage} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center md:bottom-10">
        <div className="flex flex-col items-center gap-3 text-white">
          <span className="text-2xl font-medium tracking-[-0.03em]">Scroll</span>
          <div className="flex h-[76px] w-[42px] items-start justify-center rounded-full border-2 border-white/90 p-2">
            <span className="block h-4 w-[2px] animate-[scroll-nudge_1.8s_ease-in-out_infinite] rounded-full bg-white" />
          </div>
        </div>
      </div>
    </section>
  )
}
