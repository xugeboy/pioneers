import React from 'react'
import { Check } from 'lucide-react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

export const CallToActionBlock: React.FC<CTABlockProps> = ({
  links,
  media,
  richText,
  supportText,
}) => {
  const hasMedia = media && typeof media === 'object'

  return (
    <div className="container">
      <section className="relative overflow-visible py-6 md:py-8">
        <div className="absolute left-0 right-0 top-[5.75rem] bottom-0 bg-[#243238] md:top-1/2 md:h-[18rem] md:-translate-y-1/2 md:bottom-auto lg:h-[19rem]" />

        <div className="relative grid gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:items-center">
          <div className="relative z-10 px-5 pb-8 pt-[8.5rem] sm:px-6 sm:pt-[9rem] md:px-10 md:py-10 lg:px-12 lg:py-12">
            <div className="max-w-[34rem]">
              {richText && (
                <RichText
                  className="mb-0 max-w-none prose-headings:mb-3 prose-headings:font-display prose-headings:text-[2.15rem] prose-headings:leading-[1.05] prose-headings:text-[#f8faf7] prose-p:mb-0 prose-p:text-[1.05rem] prose-p:leading-8 prose-p:text-white/82 prose-strong:text-white"
                  data={richText}
                  enableGutter={false}
                />
              )}

              {supportText ? (
                <div className="mt-7 border-t border-white/12 pt-7">
                  <div className="flex items-start gap-3 text-white/88">
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-[#00A650] text-white shadow-[0_10px_24px_rgba(34,163,64,0.24)]">
                      <Check className="size-4" />
                    </span>
                    <p className="text-lg leading-8">{supportText}</p>
                  </div>
                </div>
              ) : null}
            </div>

            {(links || []).length > 0 ? (
              <div className="mt-8 grid gap-3 sm:max-w-xl sm:grid-cols-2">
                {(links || []).map(({ link }, i) => {
                  const isOutline = link.appearance === 'outline'

                  return (
                    <CMSLink
                      key={i}
                      {...link}
                      className={
                        isOutline
                          ? 'h-14 rounded-2xl border-white/45 bg-transparent text-white text-base font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.08)] hover:border-white hover:bg-white hover:text-[#243238]'
                          : 'h-14 rounded-2xl border-[#00A650] bg-[#00A650] text-white text-base font-semibold shadow-[0_16px_32px_rgba(36,145,63,0.24)] hover:border-[#11b25b] hover:bg-[#11b25b]'
                      }
                      size="clear"
                    />
                  )
                })}
              </div>
            ) : null}
          </div>

          <div className="pointer-events-none absolute left-5 top-0 z-20 flex justify-start md:right-10 md:justify-end xl:right-20">
            <div className="relative h-[8rem] w-[8rem] overflow-hidden rounded-none bg-[#d7ddd7] shadow-[0_16px_32px_rgba(15,23,42,0.22)] md:h-[10rem] md:w-[10rem] md:shadow-[0_24px_48px_rgba(15,23,42,0.22)] lg:h-[23rem] lg:w-[23rem]">
              {hasMedia ? (
                <Media
                  fill
                  imgClassName="object-cover object-center"
                  priority={false}
                  resource={media}
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.45),transparent_24%),linear-gradient(180deg,#dfe6df_0%,#bfc9bf_100%)]" />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
