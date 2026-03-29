"use client"

import { useRef } from "react"
import { Binoculars, Compass, Leaf } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import type { AboutContent } from "@/lib/db/schema"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Binoculars, Compass, Leaf,
}

export function AboutSection({ data }: { data: AboutContent | null }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { threshold: 0.15 })

  const featureCards = (data?.featureCards as { icon: string; label: string }[]) ?? []

  return (
    <section id="about" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Warm background */}
      <div className="absolute inset-0 bg-[--color-charcoal]">
        {data?.imageUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.imageUrl} alt="" className="w-full h-full object-cover opacity-20 animate-ken-burns-right" />
            <div className="absolute inset-0 bg-gradient-to-r from-[--color-charcoal] via-[--color-charcoal]/80 to-[--color-charcoal]/60" />
          </>
        )}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Text column */}
        <div className={cn("transition-all duration-700", inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8")}>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-[--color-terracotta]" />
            <span className="text-[--color-terracotta] text-xs uppercase tracking-[0.2em]">
              {data?.eyebrow ?? "Since 2014"}
            </span>
          </div>

          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-tight text-[--color-cream] mb-6">
            {data?.title ?? "Beyond a single sighting"}
          </h2>

          <div className="space-y-4 text-[--color-cream]/60 font-body leading-relaxed">
            {data?.paragraph1 && <p>{data.paragraph1}</p>}
            {data?.paragraph2 && <p>{data.paragraph2}</p>}
          </div>

          {featureCards.length > 0 && (
            <div className="mt-10 space-y-4">
              {featureCards.map((card, i) => {
                const Icon = iconMap[card.icon] ?? Leaf
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-4 transition-all duration-500",
                      inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    )}
                    style={{ transitionDelay: `${i * 100 + 300}ms` }}
                  >
                    <div className="w-px h-6 bg-[--color-terracotta]" />
                    <Icon className="h-4 w-4 text-[--color-terracotta] shrink-0" />
                    <span className="text-sm text-[--color-sand] uppercase tracking-wider">{card.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Image column (decorative) */}
        <div
          className={cn(
            "hidden md:block relative h-[460px] rounded-sm overflow-hidden transition-all duration-700 delay-200",
            inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          )}
        >
          {data?.imageUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.imageUrl} alt={data.title ?? ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[--color-charcoal]/60 to-transparent" />
            </>
          )}
          {/* Decorative frame */}
          <div className="absolute inset-3 border border-white/10 rounded-sm pointer-events-none" />
        </div>
      </div>
    </section>
  )
}
