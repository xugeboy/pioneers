'use client'

import React, { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import type { FAQAccordionBlock as FAQAccordionBlockProps } from '@/payload-types'

import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const FAQAccordionBlock: React.FC<FAQAccordionBlockProps> = ({
  items,
  openFirstItem,
}) => {
  const instanceId = useId()
  const initialOpenId = openFirstItem && items?.[0]?.id ? items[0].id : null
  const [openItemId, setOpenItemId] = useState<string | null>(initialOpenId)

  if (!items || items.length === 0) return null

  return (
    <section className="container">
      <div className="mx-auto max-w-5xl">
        <div className="border-t border-[#dde3dd]">
          {items.map((item, index) => {
            const itemId = item.id || `${instanceId}-${index}`
            const isOpen = openItemId === itemId
            const panelId = `${instanceId}-${itemId}-panel`
            const buttonId = `${instanceId}-${itemId}-button`

            return (
              <article className="border-b border-[#dde3dd]" key={itemId}>
                <h3>
                  <button
                    aria-controls={panelId}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A650]/25 md:py-7"
                    id={buttonId}
                    onClick={() => {
                      setOpenItemId((current) => (current === itemId ? null : itemId))
                    }}
                    type="button"
                  >
                    <span className="pr-4 text-lg font-semibold leading-8 text-[#111915] md:text-[1.12rem]">
                      {item.question}
                    </span>
                    <span className="flex size-8 shrink-0 items-center justify-center text-[#1f2a22]">
                      <ChevronDown
                        className={cn('size-5 transition-transform duration-200', isOpen && 'rotate-180')}
                      />
                    </span>
                  </button>
                </h3>

                <div
                  aria-labelledby={buttonId}
                  className={cn(
                    'grid transition-[grid-template-rows] duration-200 ease-out',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                  id={panelId}
                  role="region"
                >
                  <div className="overflow-hidden">
                    <div className="pb-6 pr-10 md:pb-7">
                      <RichText
                        className="max-w-none prose-p:text-[#516056] prose-p:leading-7 prose-li:text-[#516056] prose-headings:text-[#162019]"
                        data={item.answer}
                        enableGutter={false}
                      />
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
