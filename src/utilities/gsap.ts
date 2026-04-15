'use client'

import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let isRegistered = false

export const ensureGSAP = () => {
  if (!isRegistered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
    isRegistered = true
  }

  return { gsap, ScrollTrigger }
}

type UseScrollSceneArgs = {
  ScrollTrigger: typeof ScrollTrigger
  gsap: typeof gsap
  isDesktop: boolean
  reduceMotion: boolean
  scope: HTMLElement
}

export const useScrollScene = (
  scopeRef: RefObject<HTMLElement | null>,
  setup: (args: UseScrollSceneArgs) => void,
  deps: unknown[] = [],
) => {
  const setupRef = useRef(setup)

  useEffect(() => {
    setupRef.current = setup
  }, [setup])

  useEffect(() => {
    const scope = scopeRef.current

    if (!scope || typeof window === 'undefined') return

    const { gsap, ScrollTrigger } = ensureGSAP()
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches

    const context = gsap.context(() => {
      setupRef.current({
        ScrollTrigger,
        gsap,
        isDesktop,
        reduceMotion,
        scope,
      })
    }, scope)

    return () => {
      context.revert()
    }
  }, [scopeRef, ...deps])
}
