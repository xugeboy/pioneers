'use client'

import React, { useEffect } from 'react'

import type { FullscreenHeroBlock as FullscreenHeroBlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { useHeaderTheme } from '@/providers/HeaderTheme'

export const FullscreenHeroBlock: React.FC<
  FullscreenHeroBlockProps & { disableInnerContainer?: boolean }
> = ({ backgroundImage, links, title }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-black">
      <div className="absolute inset-0">
        <Media fill priority imgClassName="object-cover object-center" resource={backgroundImage} />
      </div>

      <div className="relative z-10 flex min-h-[100svh] items-end px-6 pb-[18svh] pt-28 sm:px-10 md:px-16 lg:px-[8vw] lg:pb-[20svh]">
        <div className="max-w-[860px] text-left text-white">
          <h1 className="whitespace-pre-line text-balance font-industrial text-[clamp(2.75rem,5.6vw,6.75rem)] font-bold uppercase leading-[0.92] drop-shadow-[0_4px_16px_rgba(0,0,0,0.62)]">
            {title}
          </h1>

          {links?.length ? (
            <div className="mt-7 flex flex-wrap gap-3">
              {links.map(({ id, link }, index) => (
                <CMSLink
                  {...link}
                  className={
                    link.appearance === 'outline'
                      ? 'h-12 rounded-none border-white bg-transparent px-7 text-sm font-bold uppercase text-white shadow-[0_10px_28px_rgba(0,0,0,0.28)] hover:bg-white hover:text-black'
                      : 'h-12 rounded-none bg-[#f7c531] px-7 text-sm font-bold uppercase text-black shadow-[0_10px_28px_rgba(0,0,0,0.28)] hover:bg-[#ffd84d]'
                  }
                  key={id || index}
                  size="lg"
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center md:bottom-10">
        <div className="flex flex-col items-center gap-3 text-white">
          <span className="text-2xl font-medium">Scroll</span>
          <div className="flex h-[76px] w-[42px] items-start justify-center rounded-full border-2 border-white/90 p-2">
            <span className="block h-4 w-[2px] animate-[scroll-nudge_1.8s_ease-in-out_infinite] rounded-full bg-white" />
          </div>
        </div>
      </div>
    </section>
  )
}
