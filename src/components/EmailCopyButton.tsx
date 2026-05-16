'use client'

import { Mail } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { emailContact } from '@/components/socialLinks'
import { cn } from '@/utilities/ui'

type EmailCopyButtonProps = {
  className?: string
  iconClassName?: string
}

export const EmailCopyButton: React.FC<EmailCopyButtonProps> = ({ className, iconClassName }) => {
  const [showCopied, setShowCopied] = useState(false)

  useEffect(() => {
    if (!showCopied) return

    const timeout = window.setTimeout(() => {
      setShowCopied(false)
    }, 1800)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [showCopied])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailContact.email)
    } finally {
      setShowCopied(true)
    }
  }

  return (
    <>
      <button
        aria-label={emailContact.label}
        className={className}
        onClick={copyEmail}
        type="button"
      >
        <Mail aria-hidden="true" className={cn('size-4', iconClassName)} />
      </button>

      {showCopied ? (
        <span className="pointer-events-none fixed right-4 top-4 z-[100] whitespace-nowrap rounded-full bg-[#00A650] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(0,166,80,0.28)] md:right-6 md:top-6">
          Email address copied
        </span>
      ) : null}
    </>
  )
}
