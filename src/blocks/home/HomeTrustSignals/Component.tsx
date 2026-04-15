import { BadgeCheck, Factory, ShieldCheck } from 'lucide-react'
import React from 'react'

import type { HomeTrustSignalsBlock as HomeTrustSignalsBlockProps } from '@/payload-types'

const trustSignals = [
  {
    body: 'A quality-focused production mindset built around consistency, reliability, and disciplined QC expectations.',
    icon: ShieldCheck,
    title: 'Quality-focused production',
  },
  {
    body: 'Category familiarity across transport, outdoor, marine, and off-road cargo securement use cases.',
    icon: Factory,
    title: 'Industry experience',
  },
  {
    body: 'Certification-aware support for buyers who need clear conversations around standards, testing, and compliance.',
    icon: BadgeCheck,
    title: 'Certification awareness',
  },
] as const

export const HomeTrustSignalsBlock: React.FC<
  HomeTrustSignalsBlockProps & { disableInnerContainer?: boolean }
> = () => {
  return (
    <section className="bg-white">
      <div className="container py-14 md:py-16">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#00a650]">
            Trust signals
          </p>
          <h2 className="mt-4 font-industrial text-3xl uppercase leading-[0.92] tracking-[-0.05em] text-[#10203a] md:text-5xl">
            Built on quality focus, experience, and confidence in certification conversations.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {trustSignals.map((item) => (
            <div
              className="border border-slate-200 bg-[#f5f7fb] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]"
              key={item.title}
            >
              <div className="flex size-12 items-center justify-center border border-[#00a650]/20 bg-white text-[#00a650]">
                <item.icon className="size-5" />
              </div>
              <h3 className="mt-5 font-industrial text-2xl uppercase leading-[0.95] tracking-[-0.04em] text-[#10203a]">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-8 text-slate-600">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
