"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import type { Statistic } from "@/lib/db/schema"

function AnimatedStat({ stat, inView }: { stat: Statistic; inView: boolean }) {
  return (
    <div className="text-center px-6 md:px-10">
      <div className="font-display text-[clamp(3rem,6vw,5rem)] leading-none text-[--color-charcoal] font-light">
        <span>{inView ? stat.endValue : 0}</span>
        {stat.suffix && <span className="text-[--color-terracotta]">{stat.suffix}</span>}
      </div>
      <p className="mt-2 text-sm font-body font-semibold text-[--color-charcoal] uppercase tracking-widest">
        {stat.label}
      </p>
      {stat.sublabel && (
        <p className="mt-1 text-xs text-[--color-charcoal]/50 font-body">{stat.sublabel}</p>
      )}
    </div>
  )
}

export function StatisticsSection({ stats }: { stats: Statistic[] }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { threshold: 0.2 })

  return (
    <section ref={ref} className="py-20 bg-[--color-cream]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-[--color-charcoal]/10">
          {stats.map((stat, i) => (
            <div
              key={stat.id}
              className={cn(
                "w-full transition-all duration-700 py-8 sm:py-0",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <AnimatedStat stat={stat} inView={inView} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
