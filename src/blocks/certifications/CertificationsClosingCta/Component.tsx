'use client'

import React from 'react'

import type { CertificationsClosingCtaBlock as CertificationsClosingCtaBlockProps } from '@/payload-types'

import { certificationsPageContent } from '@/blocks/certifications/content'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const CertificationsClosingCtaBlock: React.FC<
  CertificationsClosingCtaBlockProps & { disableInnerContainer?: boolean }
> = () => {
  return (
    <section className="bg-[#0d1a30] text-white" data-theme="dark">
      <div className="container pb-16 md:pb-20">
        <div className="border border-white/12 bg-white/6 p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#90ebb1]">
                Closing CTA
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
                {certificationsPageContent.closingCta.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-slate-300">
                {certificationsPageContent.closingCta.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 cursor-pointer rounded-none bg-[#90ebb1] px-6 text-[#10203a] hover:bg-[#7edca3]"
                size="lg"
              >
                <Link href={certificationsPageContent.closingCta.primaryHref}>
                  {certificationsPageContent.closingCta.primaryLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <Button
                asChild
                className="h-12 cursor-pointer rounded-none border border-white/18 bg-transparent px-6 text-white hover:bg-white/10"
                size="lg"
                variant="outline"
              >
                <Link href={certificationsPageContent.closingCta.secondaryHref}>
                  {certificationsPageContent.closingCta.secondaryLabel}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
