'use client'

import { Mail } from 'lucide-react'
import React, { useState } from 'react'

import { EmailCopyButton } from '@/components/EmailCopyButton'
import { emailContact, whatsappContact } from '@/components/socialLinks'
import { cn } from '@/utilities/ui'

const actionClasses =
  'group relative flex size-12 cursor-pointer items-center justify-center rounded-2xl text-white shadow-[0_12px_32px_rgba(13,28,18,0.2)] transition-[background-color,box-shadow] duration-200 hover:shadow-[0_16px_38px_rgba(13,28,18,0.28)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/90 md:size-14'

const tooltipClasses =
  'pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg bg-[#162019] px-3 py-2 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 group-focus-within:opacity-100 md:block'

export const FloatingContactActions: React.FC = () => {
  const [isEmailOpen, setIsEmailOpen] = useState(false)

  return (
    <aside
      aria-label="Contact PioneersGears"
      className="fixed right-3 top-1/2 z-[35] flex -translate-y-1/2 flex-col gap-2 md:right-5"
    >
      <a
        aria-label={whatsappContact.label}
        className={`${actionClasses} bg-[#25D366] hover:bg-[#1fbd5a]`}
        href={whatsappContact.href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <svg aria-hidden="true" className="size-5 fill-current md:size-6" viewBox="0 0 24 24">
          <path d={whatsappContact.path} />
        </svg>
        <span className={tooltipClasses}>Chat on WhatsApp</span>
      </a>

      <div className="group relative">
        <button
          aria-expanded={isEmailOpen}
          aria-label="Show email address"
          className={`${actionClasses} bg-[#2563eb] hover:bg-[#1d4ed8]`}
          onClick={() => {
            setIsEmailOpen((current) => !current)
          }}
          type="button"
        >
          <Mail aria-hidden="true" className="size-5 md:size-6" />
        </button>

        <div
          className={cn(
            'absolute right-full top-1/2 z-10 flex -translate-y-1/2 items-center pr-3 opacity-0 transition-opacity duration-200 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100',
            isEmailOpen
              ? 'visible pointer-events-auto opacity-100'
              : 'pointer-events-none invisible',
          )}
        >
          <div className="flex items-center gap-3 whitespace-nowrap rounded-xl border border-slate-200 bg-white p-2 pl-4 text-sm font-semibold text-slate-800 shadow-[0_14px_36px_rgba(15,23,42,0.18)]">
            <span>{emailContact.email}</span>
            <EmailCopyButton
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg bg-[#2563eb] text-white transition-colors duration-200 hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              icon="copy"
              iconClassName="size-4"
            />
          </div>
        </div>
      </div>
    </aside>
  )
}
