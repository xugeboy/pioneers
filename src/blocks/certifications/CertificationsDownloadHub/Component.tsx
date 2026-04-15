'use client'

import React, { useRef } from 'react'

import type { CertificationsDownloadHubBlock as CertificationsDownloadHubBlockProps } from '@/payload-types'

import { certificationsPageContent } from '@/blocks/certifications/content'
import { useScrollScene } from '@/utilities/gsap'
import { Download, FolderDown } from 'lucide-react'

export const CertificationsDownloadHubBlock: React.FC<
  CertificationsDownloadHubBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    gsap.from(scope.querySelectorAll('[data-download-row]'), {
      duration: 0.62,
      ease: 'power2.out',
      opacity: 0,
      stagger: 0.05,
      scrollTrigger: {
        start: 'top 78%',
        toggleActions: 'play none none reverse',
        trigger: scope,
      },
      x: -16,
    })
  })

  return (
    <section className="bg-[#0d1a30] text-white" data-theme="dark" id="downloads" ref={sectionRef}>
      <div className="container py-16 md:py-20">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#90ebb1]">
            Download hub
          </p>
          <h2 className="mt-4 font-industrial text-4xl uppercase leading-[0.92] tracking-[-0.04em] text-white md:text-6xl">
            Proof documents organized for faster buyer review.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            These are concise summary documents intended to help a technical or sourcing team
            identify which topics are already documented before requesting deeper project files.
          </p>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {certificationsPageContent.downloadGroups
            .filter((group) => group.items.length > 0)
            .map((group) => (
              <section
                className="border border-white/12 bg-white/5 p-5 shadow-[0_18px_42px_rgba(2,6,23,0.24)]"
                key={group.title}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center border border-white/10 bg-white/6 text-[#90ebb1]">
                    <FolderDown className="size-5" />
                  </span>
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#90ebb1]">
                      Group
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{group.title}</h3>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {group.items.map((asset) => (
                    <a
                      className="group flex items-start justify-between gap-4 border border-white/10 bg-black/12 p-4 transition-[border-color,background-color] duration-200 hover:border-[#90ebb1]/40 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#90ebb1]/30"
                      data-download-row
                      download
                      href={asset.href}
                      key={asset.title}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="border border-[#90ebb1]/35 bg-[#90ebb1]/10 px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#b6f2c6]">
                            {asset.fileType}
                          </span>
                          {asset.fileSize ? (
                            <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                              {asset.fileSize}
                            </span>
                          ) : null}
                        </div>
                        <h4 className="mt-3 text-lg font-semibold text-white">{asset.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{asset.description}</p>
                      </div>

                      <span className="mt-1 inline-flex size-10 shrink-0 items-center justify-center border border-white/12 bg-white/6 text-white transition-transform duration-200 group-hover:translate-x-0.5">
                        <Download className="size-4" />
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </div>
    </section>
  )
}

