import React from 'react'

import type { HomeStrengthsBlock as HomeStrengthsBlockProps } from '@/payload-types'

const strengths = [
  {
    body: 'Built around restraint systems, securement hardware, and practical transport use cases.',
    title: 'Cargo-control manufacturing focus',
  },
  {
    body: 'Structured support for customers sourcing private-label, OEM, or program-specific product lines.',
    title: 'OEM / private-label support',
  },
  {
    body: 'Flexible thinking for fit, hardware combinations, and application-driven product adaptation.',
    title: 'Practical customization',
  },
  {
    body: 'Clear communication for inquiries, quoting, and the needs of long-term B2B supply relationships.',
    title: 'Consistent B2B response',
  },
] as const

export const HomeStrengthsBlock: React.FC<
  HomeStrengthsBlockProps & { disableInnerContainer?: boolean }
> = () => {
  return (
    <section className="bg-[#10203a] text-white">
      <div className="container py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#78e39b]">
              Key strengths
            </p>
            <h2 className="mt-4 font-industrial text-3xl uppercase leading-[0.92] tracking-[-0.05em] text-white md:text-5xl">
              A concise view of what buyers and sourcing teams rely on us for.
            </h2>
          </div>

          <div className="grid gap-px bg-white/10 sm:grid-cols-2">
            {strengths.map((item) => (
              <div className="bg-white/5 p-6" key={item.title}>
                <p className="font-industrial text-lg uppercase leading-[0.98] tracking-[-0.03em] text-white">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-7 text-white/72 md:text-base">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
