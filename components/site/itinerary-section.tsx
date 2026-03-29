"use client"

import { useRef, useState } from "react"
import { Plane, Camera, Mountain, Search, MapPin } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import type { ItineraryDay } from "@/lib/db/schema"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Plane, Camera, Mountain, Search, MapPin,
}

export function ItinerarySection({ days }: { days: ItineraryDay[] }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { threshold: 0.1 })
  const [activeDay, setActiveDay] = useState(0)

  const current = days[activeDay]

  return (
    <section id="itinerary" ref={ref} className="py-24 bg-[--color-charcoal]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className={cn("mb-12 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[--color-terracotta]" />
            <span className="text-[--color-terracotta] text-xs uppercase tracking-[0.2em]">Itinerary</span>
          </div>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] text-[--color-cream]">
            10-Day Expedition
          </h2>
        </div>

        {/* Day cards horizontal scroll */}
        <div className="flex gap-3 overflow-x-auto scrollbar-none pb-4 mb-8" style={{ scrollbarWidth: "none" }}>
          {days.map((day, i) => {
            const Icon = (day.iconName && iconMap[day.iconName]) ?? Camera
            return (
              <button
                key={day.id}
                onClick={() => setActiveDay(i)}
                className={cn(
                  "shrink-0 flex flex-col items-start p-4 rounded-sm border transition-all duration-300 min-w-[140px]",
                  activeDay === i
                    ? "bg-[--color-terracotta] border-[--color-terracotta] text-white"
                    : "bg-white/5 border-white/8 text-[--color-cream]/60 hover:bg-white/10"
                )}
              >
                <Icon className="h-4 w-4 mb-3 shrink-0" />
                <p className="font-display text-xs uppercase tracking-widest mb-0.5 opacity-60">Day {day.dayLabel}</p>
                <p className="text-sm font-medium leading-tight text-left">{day.title}</p>
              </button>
            )
          })}
        </div>

        {/* Detail panel */}
        {current && (
          <div className={cn(
            "grid md:grid-cols-2 gap-8 bg-white/4 rounded-sm border border-white/8 overflow-hidden transition-all duration-500",
            inView ? "opacity-100" : "opacity-0"
          )}>
            {/* Image */}
            <div className="relative h-56 md:h-auto min-h-[280px]">
              {current.imageUrl && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={current.imageUrl} alt={current.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[--color-charcoal]/60 hidden md:block" />
                </>
              )}
            </div>

            {/* Text */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-[--color-terracotta] uppercase tracking-widest">{current.dateLabel}</span>
                <span className="text-white/20">·</span>
                <span className="text-xs text-[--color-cream]/40 uppercase tracking-widest">{current.duration}</span>
              </div>
              <h3 className="font-display text-2xl text-[--color-cream] mb-1">{current.title}</h3>
              <p className="text-xs text-[--color-cream]/40 uppercase tracking-widest mb-4">{current.location}</p>
              <p className="font-body text-[--color-cream]/60 leading-relaxed text-sm">{current.description}</p>

              {/* Navigation */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setActiveDay(Math.max(0, activeDay - 1))}
                  disabled={activeDay === 0}
                  className="text-xs text-[--color-cream]/40 hover:text-[--color-cream] disabled:opacity-20 transition-colors"
                >
                  ← Previous
                </button>
                <span className="text-white/20">|</span>
                <button
                  onClick={() => setActiveDay(Math.min(days.length - 1, activeDay + 1))}
                  disabled={activeDay === days.length - 1}
                  className="text-xs text-[--color-cream]/40 hover:text-[--color-cream] disabled:opacity-20 transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
