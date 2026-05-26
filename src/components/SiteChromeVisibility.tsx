'use client'

import React from 'react'
import { usePathname } from 'next/navigation'

type SiteChromeVisibilityProps = {
  children: React.ReactNode
}

const chromeHiddenPaths = new Set(['/oem-tie-downs'])

export const SiteChromeVisibility: React.FC<SiteChromeVisibilityProps> = ({ children }) => {
  const pathname = usePathname()
  const hideChrome = chromeHiddenPaths.has(pathname)

  if (hideChrome) return null

  return <>{children}</>
}
