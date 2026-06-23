'use client'
/* eslint-disable @next/next/no-img-element */

import { Mail, Phone, Plus, X } from 'lucide-react'
import React, { useEffect, useId, useMemo, useRef, useState } from 'react'

import { aboutTeamContent, type TeamMember } from '@/blocks/aboutus/team'
import { cn } from '@/utilities/ui'

const hasImage = (member: TeamMember) => Boolean(member.imageUrl && member.imageUrl.trim())

const TeamPortrait: React.FC<{
  className?: string
  member: TeamMember
  rounded?: boolean
}> = ({ className = '', member, rounded = false }) => {
  if (hasImage(member)) {
    return (
      <img
        alt={member.imageAlt || `${member.name} portrait`}
        className={`${rounded ? 'rounded-full' : ''} ${className}`}
        loading="lazy"
        src={member.imageUrl}
      />
    )
  }

  return (
    <div
      aria-label={`${member.name} portrait placeholder`}
      className={`flex items-center justify-center bg-[linear-gradient(135deg,#f4f6f0,#c9d3c0)] font-industrial font-bold text-[#202833] ${rounded ? 'rounded-full' : ''} ${className}`}
      role="img"
    >
      <span className="text-5xl tracking-wide md:text-6xl">{member.initials}</span>
    </div>
  )
}

export const AboutTeamSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)
  const titleId = useId()
  const activeMember = useMemo(
    () => (activeIndex === null ? null : aboutTeamContent.members[activeIndex]),
    [activeIndex],
  )
  const activeContact = activeMember?.contact ?? aboutTeamContent.contact

  useEffect(() => {
    if (!activeMember) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveIndex(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeMember])

  return (
    <section className="bg-white py-16 text-[#202833] md:py-20">
      <div className="container">
        <h2 className="text-center font-industrial text-3xl font-bold uppercase tracking-wide text-[#202833] md:text-4xl">
          {aboutTeamContent.title}
        </h2>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-6">
          {aboutTeamContent.members.map((member, index) => (
            <article
              key={`${member.name}-${member.role}`}
              className={cn(
                'group lg:col-span-2',
                aboutTeamContent.members.length % 3 === 2 &&
                  index === aboutTeamContent.members.length - 2 &&
                  'lg:col-start-2',
              )}
            >
              <div className="relative aspect-[1.02] overflow-hidden border border-[#e5e7eb] bg-[#f4f5f0]">
                <TeamPortrait
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
                  member={member}
                />
                <button
                  aria-label={`Open ${member.name} profile`}
                  className="absolute bottom-3 right-3 flex h-10 w-14 cursor-pointer items-center justify-center rounded-full bg-[#8cc63f] text-black shadow-sm transition-colors duration-200 hover:bg-[#a4dc51] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#202833]"
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  <Plus aria-hidden="true" className="h-5 w-5 stroke-[3]" />
                </button>
              </div>

              <h3 className="mt-4 text-xs font-bold leading-5 text-[#202833] sm:mt-5 sm:text-sm">
                {member.name} - {member.role}
              </h3>
              <p className="mt-3 max-w-sm text-xs leading-5 text-[#5f6670] sm:mt-4 sm:text-sm sm:leading-6">
                {member.bio}
              </p>
            </article>
          ))}
        </div>
      </div>

      {activeMember ? (
        <div
          aria-labelledby={titleId}
          aria-modal="true"
          className="fixed inset-0 z-[80] overflow-y-auto bg-black/72 px-4 text-black"
          role="dialog"
        >
          <div
            className="flex min-h-full items-center justify-center py-6 md:py-8"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setActiveIndex(null)
              }
            }}
          >
            <div className="relative w-full max-w-3xl overflow-hidden rounded-[1.125rem] bg-white shadow-2xl">
              <button
                aria-label="Close team profile"
                className="absolute right-5 top-5 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#6b7280] transition-colors duration-200 hover:bg-black/5 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8cc63f]"
                onClick={() => setActiveIndex(null)}
                ref={closeButtonRef}
                type="button"
              >
                <X aria-hidden="true" className="h-5 w-5 stroke-[2.5]" />
              </button>

              <div className="px-6 pb-10 pt-12 text-center md:px-16 md:pb-12 md:pt-14">
                <TeamPortrait
                  className="mx-auto h-28 w-28 object-cover object-center"
                  member={activeMember}
                  rounded
                />

                <h3
                  className="mt-6 font-industrial text-4xl font-bold uppercase leading-none tracking-wide text-black md:text-5xl"
                  id={titleId}
                >
                  {activeMember.name}
                </h3>
                <p className="mt-2 text-xl leading-6 text-black">{activeMember.role}</p>

                <div className="mx-auto mt-10 max-w-2xl space-y-9">
                  {activeMember.questions.map((item) => (
                    <div key={item.question}>
                      <h4 className="text-lg font-bold leading-6 text-black">{item.question}</h4>
                      <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-black">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>

              {activeContact ? (
                <div className="mt-10">
                    {activeContact.heading ? (
                      <h4 className="text-lg font-bold leading-6 text-black">
                        {activeContact.heading}
                      </h4>
                    ) : null}
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-black">
                      {activeContact.phone ? (
                        <a
                          className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-[#008641] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8cc63f]"
                          href={`tel:${activeContact.phone.replaceAll(' ', '')}`}
                        >
                          <Phone aria-hidden="true" className="h-5 w-5" />
                          <span>{activeContact.phone}</span>
                        </a>
                      ) : null}
                      {activeContact.email ? (
                        <a
                          className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-[#008641] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8cc63f]"
                          href={`mailto:${activeContact.email}`}
                        >
                          <Mail aria-hidden="true" className="h-5 w-5" />
                          <span>{activeContact.email}</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
