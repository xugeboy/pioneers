import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Barlow_Condensed } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { JsonLd } from '@/components/JsonLd'
import { MarketingBodyScripts, MarketingHeadScripts } from '@/components/MarketingScripts'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { getGlobalJsonLd } from '@/utilities/jsonLd'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode, headers } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  variable: '--font-barlow-condensed',
  weight: ['400', '500', '600', '700', '800'],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const requestHeaders = await headers()
  const pathname = requestHeaders.get('x-pathname')
  const hideSiteChrome = pathname === '/oem-tie-downs'

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable, barlowCondensed.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <InitTheme />
        <JsonLd data={getGlobalJsonLd()} />
        <MarketingHeadScripts />
        <MarketingBodyScripts />
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          {!hideSiteChrome ? <Header /> : null}
          {children}
          {!hideSiteChrome ? <Footer /> : null}
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  appleWebApp: {
    title: 'PioneersGears',
  },
  icons: {
    apple: [{ sizes: '180x180', url: '/apple-touch-icon.png' }],
    icon: [
      { sizes: '96x96', type: 'image/png', url: '/favicon-96x96.png' },
      { type: 'image/svg+xml', url: '/favicon.svg' },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
