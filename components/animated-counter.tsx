"use client"

import { useEffect, useState, useRef } from "react"
import { useInView } from "@/hooks/use-in-view"

interface AnimatedCounterProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
  label: string
  sublabel?: string
}

export function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2000,
  label,
  sublabel,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.5 })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Easing function for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3)
        setCount(Math.floor(easeOut * end))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [isInView, end, duration])

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-5xl font-light text-white/90 mb-2 tabular-nums">
        {prefix}
        {count}
        {suffix}
      </div>
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">{label}</p>
      {sublabel && <p className="text-[9px] text-white/30 mt-1">{sublabel}</p>}
    </div>
  )
}
