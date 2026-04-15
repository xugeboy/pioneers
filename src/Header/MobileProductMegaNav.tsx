'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

import type { HeaderMegaNavGroup } from '@/Header/getMegaNavData'

import { cn } from '@/utilities/ui'

type MobileProductMegaNavProps = {
  groups: HeaderMegaNavGroup[]
  onClose: () => void
}

export const MobileProductMegaNav: React.FC<MobileProductMegaNavProps> = ({ groups, onClose }) => {
  const [openGroupID, setOpenGroupID] = useState<number | null>(groups[0]?.id ?? null)

  if (groups.length === 0) {
    return null
  }

  return (
    <section className="mb-8">
      <div className="space-y-2">
        {groups.map((group) => {
          const isGroupOpen = openGroupID === group.id

          return (
            <div key={group.id}>
              <button
                className="flex w-full items-center justify-between py-3 text-left"
                onClick={() => {
                  setOpenGroupID(isGroupOpen ? null : group.id)
                }}
                type="button"
              >
                <span className="text-base font-medium text-slate-900">{group.label}</span>
                <ChevronDown
                  className={cn(
                    'size-4 text-slate-500 transition-transform duration-200',
                    isGroupOpen && 'rotate-180',
                  )}
                />
              </button>

              <div
                className={cn(
                  'grid transition-[grid-template-rows] duration-200 ease-out',
                  isGroupOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="overflow-hidden">
                  <div className="space-y-1 pb-2 pl-4">
                    {group.items.map((item) => {
                      const href = item.href

                      return (
                        <Link
                          className="block py-2 text-sm text-slate-600 transition-colors hover:text-slate-950"
                          href={href}
                          key={item.id}
                          onClick={onClose}
                        >
                          {item.label}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
