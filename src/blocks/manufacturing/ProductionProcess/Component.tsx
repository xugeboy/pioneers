'use client'
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useRef, useState } from 'react'

import type { ProductionProcessBlock as ProductionProcessBlockProps } from '@/payload-types'

import { manufacturingProcessContent } from '@/blocks/manufacturing/content'
import { useScrollScene } from '@/utilities/gsap'

const desktopOrders = ['xl:order-1', 'xl:order-2', 'xl:order-3', 'xl:order-6', 'xl:order-5', 'xl:order-4']

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

export const ProductionProcessBlock: React.FC<
  ProductionProcessBlockProps & { disableInnerContainer?: boolean }
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

      const cards = Array.from(flow.querySelectorAll<HTMLElement>('[data-process-card]'))

      if (!cards.length) {
        setProcessFlow((current) => (current.path ? emptyFlow : current))
        return
      }

      const flowBounds = flow.getBoundingClientRect()
      const nodes = cards.map((card) => {
        const cardBounds = card.getBoundingClientRect()

        return {
          x: cardBounds.left - flowBounds.left + cardBounds.width / 2,
          y: cardBounds.top - flowBounds.top + 24,
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

    const cards = gsap.utils.toArray<HTMLElement>('[data-process-card]', scope)
    const progressPath = scope.querySelector<SVGPathElement>('[data-process-progress]')
    const progressNodes = gsap.utils.toArray<SVGCircleElement>('[data-process-node-progress]', scope)

    if (!progressPath) {
      gsap.utils.toArray<HTMLElement>('[data-process-card]', scope).forEach((card, index) => {
        gsap.from(card, {
          delay: index * 0.03,
          duration: 0.7,
          ease: 'power2.out',
          opacity: 0,
          scrollTrigger: {
            start: 'top 84%',
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
      y: 30,
    })
    gsap.set(progressPath, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength,
    })
    gsap.set(progressNodes, {
      opacity: 0,
      scale: 0.45,
      transformOrigin: 'center center',
    })

    gsap.timeline({
      scrollTrigger: {
        end: 'bottom 64%',
        scrub: 0.9,
        start: 'top 74%',
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
          duration: 0.48,
          ease: 'power2.out',
          opacity: 1,
          stagger: 0.58,
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
          stagger: 0.58,
        },
        0.18,
      )
  }, [processFlow.path])

  return (
    <section className="bg-[#f1efe6]" ref={sectionRef}>
      <div className="container py-16 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4f6b3d]">
            {manufacturingProcessContent.eyebrow}
          </p>
          <h2 className="mt-4 font-industrial text-4xl uppercase leading-[0.92] tracking-[-0.04em] text-[#17231d] md:text-6xl">
            {manufacturingProcessContent.title}
          </h2>
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
                    id="process-arrowhead"
                    markerHeight="10"
                    markerUnits="strokeWidth"
                    markerWidth="10"
                    orient="auto"
                    refX="7"
                    refY="5"
                  >
                    <path d="M0,0 L10,5 L0,10 z" fill="#4f6b3d" />
                  </marker>
                </defs>

                <path
                  d={processFlow.path}
                  fill="none"
                  stroke="#d3d8cd"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                />
                <path
                  d={processFlow.path}
                  data-process-progress
                  fill="none"
                  markerEnd="url(#process-arrowhead)"
                  stroke="#4f6b3d"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />

                {processFlow.nodes.map((node) => (
                  <g key={`${node.x}-${node.y}`}>
                    <circle cx={node.x} cy={node.y} fill="#e3e6dd" r="11" />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      data-process-node-progress
                      fill="#4f6b3d"
                      r="7"
                    />
                  </g>
                ))}
              </svg>
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-5 xl:gap-y-16">
            {manufacturingProcessContent.steps.map((step, index) => (
              <article
                className={`relative border border-[#d6d3c7] bg-[#fbfaf6] p-4 shadow-[0_16px_36px_rgba(23,35,29,0.06)] md:p-5 xl:min-h-[25rem] ${desktopOrders[index] ?? ''}`}
                data-process-card
                key={step.title}
              >
                <div className="flex items-center gap-3">
                  <p className="text-sm font-semibold uppercase leading-none tracking-[0.22em] text-[#17231d]">
                    0{index + 1}
                  </p>
                  <div className="h-px flex-1 bg-[#d9d6ca]" />
                </div>

                <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[#17231d] md:text-[1.35rem]">
                  {step.title}
                </h3>

                <div className="relative mt-4 overflow-hidden bg-[#e7e4d8]">
                  <div className="aspect-[5/4] overflow-hidden">
                    <img
                      alt={step.visual.alt}
                      className="h-full w-full object-cover transition-transform duration-500"
                      loading="lazy"
                      src={step.visual.url}
                      style={{ objectPosition: step.visual.position }}
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-3 text-sm leading-6 text-[#526157]">
                  <p>{step.input}</p>
                  <p className="border-t border-[#ddd8ca] pt-3 text-[#69756d]">{step.output}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
