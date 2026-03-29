"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { AnimatedCounter } from "@/components/animated-counter"

export function StatisticsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.3 })

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 mb-4">By The Numbers</p>
          <h2 className="text-xl md:text-2xl font-light text-white/80">A Decade of Expeditions</h2>
        </div>

        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 transition-all duration-1000 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <AnimatedCounter end={10} suffix="+" label="Years Active" sublabel="Since 2014" />
          <AnimatedCounter end={89} suffix="%" label="Sighting Rate" sublabel="Success probability" />
          <AnimatedCounter end={4500} suffix="m" label="Peak Altitude" sublabel="Khunjerab Pass" />
          <AnimatedCounter end={50} suffix="+" label="Expeditions" sublabel="Completed safely" />
        </div>
      </div>
    </section>
  )
}
