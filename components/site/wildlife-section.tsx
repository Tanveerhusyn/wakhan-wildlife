"use client"

import { useRef, useState } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import type { Wildlife } from "@/lib/db/schema"

export function WildlifeSection({ animals }: { animals: Wildlife[] }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { threshold: 0.1 })
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section id="wildlife" ref={ref} className="py-24 bg-[--color-charcoal]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className={cn("mb-12 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[--color-terracotta]" />
            <span className="text-[--color-terracotta] text-xs uppercase tracking-[0.2em]">Wildlife</span>
          </div>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] text-[--color-cream]">
            Denizens of the High Karakoram
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-0.5">
          {animals.map((animal, i) => (
            <div
              key={animal.id}
              className={cn(
                "relative overflow-hidden cursor-default transition-all duration-500 h-[480px] md:h-[560px]",
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                hovered !== null && hovered !== i ? "brightness-50 scale-[0.99]" : ""
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Image */}
              <div className={cn("absolute inset-0 transition-transform duration-700", hovered === i ? "scale-105" : "scale-100")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={animal.imageUrl} alt={animal.name} className="w-full h-full object-cover" />
              </div>

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[--color-charcoal] via-[--color-charcoal]/20 to-transparent" />

              {/* Text */}
              <div className="absolute bottom-0 inset-x-0 p-6">
                <p className="text-xs text-[--color-terracotta] uppercase tracking-widest mb-1">{animal.statValue} {animal.statLabel}</p>
                <h3 className="font-display text-2xl text-[--color-cream] mb-0.5">{animal.name}</h3>
                <p className="font-display italic text-[--color-sand]/60 text-sm mb-3">{animal.scientific}</p>
                <p
                  className={cn(
                    "text-sm text-[--color-cream]/60 font-body leading-relaxed max-w-xs overflow-hidden transition-all duration-500",
                    hovered === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  {animal.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
