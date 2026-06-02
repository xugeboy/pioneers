import { ChevronDown } from 'lucide-react'
import React from 'react'

const homeFaqItems = [
  {
    answer:
      'We manufacture tie-down straps, bungee cords, motorcycle restraints, marine tie-downs, kayak and canoe tie-downs, cargo nets, and related restraint products for outdoor, automotive, marine, and utility programs.',
    question: 'What types of tie-down products can PioneersGears manufacture?',
  },
  {
    answer:
      'Yes. We support OEM and private-label work including webbing colors, cord lengths, hooks, buckles, labels, packaging, instruction cards, and product sets matched to your market requirements.',
    question: 'Can you support OEM or private-label customization?',
  },
  {
    answer:
      'Share the product use case, target working load or break strength, attachment points, hardware preferences, strap or cord dimensions, packaging needs, and estimated order quantity. Our team will review the configuration before sampling.',
    question: 'How do I confirm a strap configuration fits my application?',
  },
  {
    answer:
      'Send photos, drawings, target dimensions, materials, hardware notes, color requirements, packaging ideas, and your expected quantity. Existing product references are also helpful when you want a similar build.',
    question: 'What information should I send for a quote?',
  },
  {
    answer:
      'Yes. Samples can usually be prepared before bulk production. Timing depends on whether the request uses existing components or needs custom materials, labels, packaging, or new tooling.',
    question: 'Do you provide samples before bulk production?',
  },
  {
    answer:
      'We can coordinate export packaging, carton marks, pallet requirements, product labels, instruction cards, and shipping document support for brands, distributors, and private-label buyers.',
    question: 'Can you support export orders and packaging requirements?',
  },
  {
    answer:
      'Production is reviewed through material checks, stitching and assembly checks, hardware inspection, packing review, and load-focused validation where required by the product type or buyer specification.',
    question: 'How does PioneersGears control product quality?',
  },
] as const

export const HomeFAQSection: React.FC = () => {
  return (
    <section className="bg-[#f5f5f4] pb-16 pt-14 md:pb-20 md:pt-20 lg:pb-24">
      <div className="container grid gap-10 lg:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1.45fr)] lg:gap-14">
        <div>
          <div className="flex items-center gap-2 md:gap-3">
            <h2 className="font-display text-2xl font-semibold leading-tight text-[#06120b] md:text-3xl">
              PioneersGears FAQs
            </h2>
            <span className="mt-1 h-0.5 w-14 shrink-0 bg-[#e87412] md:w-20" />
          </div>
        </div>

        <div className="space-y-3">
          {homeFaqItems.map((item) => (
            <details
              className="group rounded-lg border border-[#d5d9d6] bg-white/20 transition-colors open:bg-white/50"
              key={item.question}
            >
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A650]/25 md:min-h-[60px] md:px-6 [&::-webkit-details-marker]:hidden">
                <span className="text-base font-semibold leading-7 text-[#06120b] md:text-lg">
                  {item.question}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className="size-5 shrink-0 text-[#e87412] transition-transform duration-200 group-open:rotate-180"
                  strokeWidth={2.6}
                />
              </summary>
              <div className="px-5 pb-5 pr-12 md:px-6 md:pb-6 md:pr-16">
                <p className="text-sm leading-7 text-[#4d5c53] md:text-[15px]">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
