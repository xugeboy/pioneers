import { HeaderClient } from './Component.client'
import { getCachedHeaderMegaNavData } from './getMegaNavData'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Header } from '@/payload-types'

export async function Header() {
  const [headerData, megaNavGroups]: [Header, Awaited<ReturnType<typeof getCachedHeaderMegaNavData>>] =
    await Promise.all([getCachedGlobal('header', 1)(), getCachedHeaderMegaNavData()])

  return <HeaderClient data={headerData} megaNavGroups={megaNavGroups} />
}
