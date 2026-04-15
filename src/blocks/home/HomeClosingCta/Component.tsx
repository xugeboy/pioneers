import Link from 'next/link'
import React from 'react'

import type { HomeClosingCtaBlock as HomeClosingCtaBlockProps } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

export const HomeClosingCtaBlock: React.FC<
  HomeClosingCtaBlockProps & { disableInnerContainer?: boolean }
> = () => {
  return (
    <section className="bg-[#67718a] text-white">
      <div className="container py-16 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/72">
            Call to action
          </p>
          <h2 className="mt-4 font-industrial text-3xl uppercase leading-[0.9] tracking-[-0.05em] md:text-5xl">
            Sourcing cargo control products for a new program, OEM request, or application-specific line?
          </h2>

          <p className={cn('mx-auto mt-5 max-w-2xl text-base leading-8 text-white/80')}>
            Talk with us about quoting, private-label support, or the right product direction for
            your marine, outdoor, and off-road cargo securement needs.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="h-12 rounded-none border border-[#00a650] bg-[#00a650] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white hover:border-[#119d52] hover:bg-[#119d52]"
              size="clear"
            >
              <Link href="/contact">Request a quote</Link>
            </Button>

            <Button
              asChild
              className="h-12 rounded-none border border-white/30 bg-white/10 px-6 text-sm font-semibold uppercase tracking-[0.12em] text-white hover:border-white hover:bg-white hover:text-[#10203a]"
              size="clear"
              variant="outline"
            >
              <Link href="/products">Browse products</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
