import React from 'react'

import { CertificateCarousel } from '@/components/CertificateCarousel'

const certificateImages = [
  {
    alt: 'zero spin ratchet strap desgin patent CN - ZL2025302655172',
    src: 'https://cdn.pioneersgears.com/images/zero spin ratchet strap desgin patent CN - ZL2025302655172_Preview.webp',
  },
  {
    alt: 'swivel carabiner hook design patent CN - ZL2025303092998',
    src: 'https://cdn.pioneersgears.com/images/swivel carabiner hook design patent CN - ZL2025303092998_Preview.webp',
  },
  {
    alt: 'retractable ratchet strap design patent CN - ZL2025302655153',
    src: 'https://cdn.pioneersgears.com/images/retractable ratchet strap design patent CN - ZL2025302655153_Preview.webp',
  },
  {
    alt: 'retractable ratchet strap design patent CN - ZL 2024302184409',
    src: 'https://cdn.pioneersgears.com/images/retractable ratchet strap design patent CN - ZL 2024302184409_Preview.webp',
  },
  {
    alt: 'retractable ratchet strap design patent US - D1111741',
    src: 'https://cdn.pioneersgears.com/images/retractable ratchet strap design patent US - D1111741_Preview.webp',
  },
  {
    alt: 'retractable ratchet strap design patent UK - 6442745',
    src: 'https://cdn.pioneersgears.com/images/retractable ratchet strap design patent UK - 6442745_Preview.webp',
  },
  {
    alt: 'Ratchet Strap EN12195-2 TUV GS Certification EN',
    src: 'https://cdn.pioneersgears.com/images/Ratchet Strap EN12195-2 TUV GS Certification EN_Preview.webp',
  },
  {
    alt: 'Cam Buckle Strap EN12195-2 TUV GS Certification EN',
    src: 'https://cdn.pioneersgears.com/images/Cam Buckle Strap EN12195-2 TUV GS Certification EN_Preview.webp',
  },
  {
    alt: 'retractable ratchet strap design patent UK - 6442745',
    src: 'https://cdn.pioneersgears.com/images/retractable ratchet strap design patent UK - 6442745_Preview.webp',
  },
  {
    alt: 'retractable ratchet strap design patent CA - 240688',
    src: 'https://cdn.pioneersgears.com/images/retractable ratchet strap design patent CA - 240688_Preview.webp',
  },
] as const

export const CertificateOfHonorSection: React.FC = () => {
  return (
    <section className="overflow-hidden bg-white py-14 md:py-20">
      <div className="container">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold leading-tight text-[#123d63] md:text-4xl">
            Certificate Of Honor
          </h2>
          <div className="mx-auto mt-6 h-1 w-[clamp(4rem,28%,12rem)] rounded-full bg-[#00A650]" />
        </div>

        <CertificateCarousel certificates={certificateImages} />
      </div>
    </section>
  )
}
