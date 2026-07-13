'use client'

import { Check, Copy, Mail } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { emailContact } from '@/components/socialLinks'
import { cn } from '@/utilities/ui'

type EmailCopyButtonProps = {
  className?: string
  icon?: 'copy' | 'mail'
  iconClassName?: string
}

export const EmailCopyButton: React.FC<EmailCopyButtonProps> = ({
  className,
  icon = 'mail',
  iconClassName,
}) => {
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
      setShowCopied(true)
    } catch {
      // Keep the copy icon visible when clipboard access is unavailable.
    }
  }

  const Icon = showCopied ? Check : icon === 'copy' ? Copy : Mail

  return (
    <button
      aria-label={showCopied ? 'Email address copied' : `Copy ${emailContact.email}`}
      aria-live="polite"
      className={className}
      onClick={copyEmail}
      type="button"
    >
      <Icon aria-hidden="true" className={cn('size-4', iconClassName)} />
    </button>
  )
}
