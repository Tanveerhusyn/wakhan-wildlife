"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import type { CultureContent } from "@/lib/db/schema"

export function CultureSection({ data }: { data: CultureContent | null }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { threshold: 0.15 })

  const culturePoints = (data?.culturePoints as { label: string; value: string }[]) ?? []

  return (
    <section id="culture" ref={ref} className="relative py-24 md:py-32 overflow-hidden bg-[--color-charcoal]">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <div
          className={cn(
            "relative h-[400px] md:h-[520px] rounded-sm overflow-hidden transition-all duration-700",
            inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
          )}
        >
          {data?.imageUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.imageUrl} alt={data.titleLine1 ?? ""} className="w-full h-full object-cover animate-ken-burns-left" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[--color-charcoal]/40" />
            </>
          )}
          {/* Decorative large text */}
          <div className="absolute bottom-4 right-4 font-display text-[5rem] leading-none text-white/5 select-none pointer-events-none">
            Wakhi
          </div>
        </div>

        {/* Text */}
        <div className={cn("transition-all duration-700 delay-200", inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8")}>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-[--color-terracotta]" />
            <span className="text-[--color-terracotta] text-xs uppercase tracking-[0.2em]">
              {data?.eyebrow ?? "The Wakhi People"}
            </span>
          </div>

          <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] leading-tight text-[--color-cream] mb-6">
            {data?.titleLine1 ?? "Guardians of"}
            <br />
            <em>{data?.titleLine2 ?? "the Mountains"}</em>
          </h2>

          <div className="space-y-4 text-[--color-cream]/60 font-body leading-relaxed mb-10">
            {data?.paragraph1 && <p>{data.paragraph1}</p>}
            {data?.paragraph2 && <p>{data.paragraph2}</p>}
          </div>

          {/* Culture points — editorial table */}
          {culturePoints.length > 0 && (
            <div className="divide-y divide-white/8">
              {culturePoints.map((point, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between py-3 transition-all duration-500",
                    inView ? "opacity-100" : "opacity-0"
                  )}
                  style={{ transitionDelay: `${i * 80 + 400}ms` }}
                >
                  <span className="text-xs text-[--color-cream]/40 uppercase tracking-widest">{point.label}</span>
                  <span className="text-sm text-[--color-sand]">{point.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
