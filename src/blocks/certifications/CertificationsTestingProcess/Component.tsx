'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { CertificationsTestingProcessBlock as CertificationsTestingProcessBlockProps } from '@/payload-types'

import { certificationsPageContent } from '@/blocks/certifications/content'
import { useScrollScene } from '@/utilities/gsap'

type FlowPoint = {
  x: number
  y: number
}

type ProcessFlow = {
  height: number
  nodes: FlowPoint[]
  path: string
  width: number
}

const emptyFlow: ProcessFlow = {
  height: 0,
  nodes: [],
  path: '',
  width: 0,
}

const buildSmoothPath = (points: FlowPoint[]) => {
  if (points.length < 2) return ''

  let path = `M ${points[0]?.x ?? 0} ${points[0]?.y ?? 0}`

  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index]
    const current = points[index]
    const next = points[index + 1]
    const afterNext = points[index + 2] ?? next

    const controlPointOneX = current.x + (next.x - previous.x) / 6
    const controlPointOneY = current.y + (next.y - previous.y) / 6
    const controlPointTwoX = next.x - (afterNext.x - current.x) / 6
    const controlPointTwoY = next.y - (afterNext.y - current.y) / 6

    path += ` C ${controlPointOneX} ${controlPointOneY}, ${controlPointTwoX} ${controlPointTwoY}, ${next.x} ${next.y}`
  }

  return path
}

export const CertificationsTestingProcessBlock: React.FC<
  CertificationsTestingProcessBlockProps & { disableInnerContainer?: boolean }
> = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const flowRef = useRef<HTMLDivElement | null>(null)
  const [processFlow, setProcessFlow] = useState<ProcessFlow>(emptyFlow)

  useEffect(() => {
    const flow = flowRef.current

    if (!flow || typeof window === 'undefined') return

    const updateFlow = () => {
      if (window.innerWidth < 1280) {
        setProcessFlow((current) => (current.path ? emptyFlow : current))
        return
      }

      const cards = Array.from(flow.querySelectorAll<HTMLElement>('[data-testing-card]'))

      if (!cards.length) {
        setProcessFlow((current) => (current.path ? emptyFlow : current))
        return
      }

      const flowBounds = flow.getBoundingClientRect()
      const nodes = cards.map((card) => {
        const cardBounds = card.getBoundingClientRect()

        return {
          x: cardBounds.left - flowBounds.left + cardBounds.width / 2,
          y: cardBounds.top - flowBounds.top + 20,
        }
      })

      const nextFlow = {
        height: flow.scrollHeight,
        nodes,
        path: buildSmoothPath(nodes),
        width: flow.clientWidth,
      }

      setProcessFlow((current) => {
        const unchanged =
          current.width === nextFlow.width &&
          current.height === nextFlow.height &&
          current.path === nextFlow.path

        return unchanged ? current : nextFlow
      })
    }

    const scheduleUpdate = () => {
      window.requestAnimationFrame(updateFlow)
    }

    scheduleUpdate()

    const resizeObserver =
      typeof window.ResizeObserver !== 'undefined' ? new window.ResizeObserver(scheduleUpdate) : null

    resizeObserver?.observe(flow)
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  useScrollScene(sectionRef, ({ gsap, reduceMotion, scope }) => {
    if (reduceMotion) return

    const cards = gsap.utils.toArray<HTMLElement>('[data-testing-card]', scope)
    const progressPath = scope.querySelector<SVGPathElement>('[data-testing-progress]')
    const progressNodes = gsap.utils.toArray<SVGCircleElement>('[data-testing-node-progress]', scope)

    if (!progressPath) {
      cards.forEach((card, index) => {
        gsap.from(card, {
          delay: index * 0.04,
          duration: 0.7,
          ease: 'power2.out',
          opacity: 0,
          scrollTrigger: {
            start: 'top 82%',
            toggleActions: 'play none none reverse',
            trigger: card,
          },
          y: 24,
        })
      })

      return
    }

    const totalLength = progressPath.getTotalLength()

    gsap.set(cards, {
      opacity: 0,
      y: 28,
    })
    gsap.set(progressPath, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength,
    })
    gsap.set(progressNodes, {
      opacity: 0,
      scale: 0.5,
      transformOrigin: 'center center',
    })

    gsap
      .timeline({
        scrollTrigger: {
          end: 'bottom 62%',
          scrub: 0.9,
          start: 'top 72%',
          trigger: scope,
        },
      })
      .to(
        progressPath,
        {
          duration: 3.8,
          ease: 'none',
          strokeDashoffset: 0,
        },
        0,
      )
      .to(
        cards,
        {
          duration: 0.45,
          ease: 'power2.out',
          opacity: 1,
          stagger: 0.5,
          y: 0,
        },
        0.12,
      )
      .to(
        progressNodes,
        {
          duration: 0.22,
          ease: 'power2.out',
          opacity: 1,
          scale: 1,
          stagger: 0.5,
        },
        0.16,
      )
  }, [processFlow.path])

  return (
    <section className="bg-[#10203a] text-white" data-theme="dark" ref={sectionRef}>
      <div className="container py-16 md:py-20">
        <div className="max-w-3xl">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[#9bd8af]">
            Testing and validation process
          </p>
          <h2 className="mt-4 font-industrial text-4xl uppercase leading-[0.92] tracking-[-0.04em] text-white md:text-6xl">
            A visible review path from incoming inputs to shipment release.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            The process section is intentionally technical. It shows how inspection and validation
            checkpoints connect instead of appearing as disconnected promises.
          </p>
        </div>

        <div className="relative mt-10 xl:mt-14" ref={flowRef}>
          {processFlow.path ? (
            <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
              <svg
                className="h-full w-full overflow-visible"
                preserveAspectRatio="none"
                viewBox={`0 0 ${processFlow.width} ${processFlow.height}`}
              >
                <defs>
                  <marker
                    id="certifications-arrowhead"
                    markerHeight="10"
                    markerUnits="strokeWidth"
                    markerWidth="10"
                    orient="auto"
                    refX="7"
                    refY="5"
                  >
                    <path d="M0,0 L10,5 L0,10 z" fill="#90ebb1" />
                  </marker>
                </defs>

                <path
                  d={processFlow.path}
                  fill="none"
                  stroke="rgba(255,255,255,0.16)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
                <path
                  d={processFlow.path}
                  data-testing-progress
                  fill="none"
                  markerEnd="url(#certifications-arrowhead)"
                  stroke="#90ebb1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />

                {processFlow.nodes.map((node) => (
                  <g key={`${node.x}-${node.y}`}>
                    <circle cx={node.x} cy={node.y} fill="rgba(255,255,255,0.12)" r="11" />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      data-testing-node-progress
                      fill="#90ebb1"
                      r="7"
                    />
                  </g>
                ))}
              </svg>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 xl:gap-5">
            {certificationsPageContent.testingStages.map((stage, index) => (
              <article
                className="relative border border-white/12 bg-white/6 p-5 shadow-[0_18px_44px_rgba(2,6,23,0.24)] backdrop-blur-sm"
                data-testing-card
                key={stage.title}
              >
                <div className="flex items-center gap-3">
                  <p className="font-industrial text-3xl uppercase leading-none tracking-[0.04em] text-white">
                    0{index + 1}
                  </p>
                  <div className="h-px flex-1 bg-white/14" />
                </div>
                <h3 className="mt-4 text-2xl font-semibold uppercase tracking-[-0.03em] text-white">
                  {stage.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-slate-300">{stage.summary}</p>

                <div className="mt-5 space-y-4 border-t border-white/10 pt-4 text-sm">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#90ebb1]">
                      Focus
                    </p>
                    <p className="mt-2 leading-6 text-slate-200">{stage.focus}</p>
                  </div>
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#90ebb1]">
                      Outcome
                    </p>
                    <p className="mt-2 leading-6 text-slate-300">{stage.outcome}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

