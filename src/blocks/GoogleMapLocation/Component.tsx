import React from 'react'

import type { GoogleMapLocationBlock as GoogleMapLocationBlockProps } from '@/payload-types'

import { cn } from '@/utilities/ui'

const defaultPlaceName = 'Kinedyne - Prattville'
const defaultAddress = '1104 Washington Ferry Rd, Prattville, AL 36067, USA'

const heightClasses: Record<NonNullable<GoogleMapLocationBlockProps['height']>, string> = {
  compact: 'h-[320px] md:h-[400px]',
  standard: 'h-[420px] md:h-[520px]',
  tall: 'h-[520px] md:h-[640px]',
}

const buildLocationQuery = (placeName?: string | null, address?: string | null) =>
  [placeName?.trim(), address?.trim()].filter(Boolean).join(', ') || `${defaultPlaceName}, ${defaultAddress}`

const buildEmbedUrl = (embedUrl?: string | null, query?: string) => {
  if (embedUrl?.trim()) return embedUrl.trim()

  return `https://www.google.com/maps?q=${encodeURIComponent(query || `${defaultPlaceName}, ${defaultAddress}`)}&z=11&output=embed`
}

export const GoogleMapLocationBlock: React.FC<
  GoogleMapLocationBlockProps & { disableInnerContainer?: boolean }
> = ({
  address,
  embedUrl,
  height,
  placeName,
}) => {
  const locationQuery = buildLocationQuery(placeName, address)
  const resolvedPlaceName = placeName?.trim() || defaultPlaceName
  const resolvedEmbedUrl = buildEmbedUrl(embedUrl, locationQuery)

  return (
    <section aria-label={`${resolvedPlaceName} map`} className="relative w-full overflow-hidden">
      <div
        className={cn(
          'relative isolate w-full overflow-hidden bg-[#dcecf4]',
          heightClasses[height || 'standard'],
        )}
      >
        <iframe
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={resolvedEmbedUrl}
          title={`${resolvedPlaceName} Google Map`}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_18%,rgba(15,23,42,0.06)_100%)]" />
      </div>
    </section>
  )
}
