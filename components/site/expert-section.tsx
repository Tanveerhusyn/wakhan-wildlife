"use client"

import { useRef } from "react"
import { Award, Radio, Map, Users } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import type { ExpertContent } from "@/lib/db/schema"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Award, Radio, Map, Users,
}

export function ExpertSection({ data }: { data: ExpertContent | null }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { threshold: 0.15 })

  const credentials = (data?.credentials as { icon: string; label: string; value: string; desc: string }[]) ?? []

  return (
    <section id="expedition" ref={ref} className="relative py-24 md:py-32 bg-[--color-charcoal]">
      {/* Subtle warm texture overlay */}
      <div className="absolute inset-0 bg-[--color-olive]/5 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
        {/* Image */}
        <div className={cn("relative h-[500px] rounded-sm overflow-hidden transition-all duration-700", inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8")}>
          {data?.imageUrl && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.imageUrl} alt={data.name ?? ""} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[--color-charcoal]/80 via-transparent to-transparent" />
            </>
          )}
          {/* Quote overlay */}
          {data?.quote && (
            <div className="absolute bottom-6 inset-x-6 p-4 bg-[--color-charcoal]/80 backdrop-blur-sm border-l-2 border-[--color-terracotta]">
              <p className="font-display italic text-[--color-cream]/90 text-sm leading-relaxed">
                &ldquo;{data.quote}&rdquo;
              </p>
              {data.quoteAttribution && (
                <p className="text-xs text-[--color-terracotta] mt-2 uppercase tracking-widest">
                  — {data.quoteAttribution}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className={cn("transition-all duration-700 delay-200", inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8")}>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-[--color-terracotta]" />
            <span className="text-[--color-terracotta] text-xs uppercase tracking-[0.2em]">Your Guide</span>
          </div>

          <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] leading-tight text-[--color-cream] mb-1">
            {data?.name ?? "Hussain Ali Khan"}
          </h2>
          <p className="font-display italic text-[--color-sand]/60 text-lg mb-6">{data?.title}</p>

          <div className="space-y-4 text-[--color-cream]/60 font-body leading-relaxed mb-10">
            {data?.bioParagraph1 && <p>{data.bioParagraph1}</p>}
            {data?.bioParagraph2 && <p>{data.bioParagraph2}</p>}
          </div>

          {/* Credentials — editorial list */}
          {credentials.length > 0 && (
            <div className="divide-y divide-white/8">
              {credentials.map((cred, i) => {
                const Icon = iconMap[cred.icon] ?? Award
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-4 py-3.5 transition-all duration-500",
                      inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                    )}
                    style={{ transitionDelay: `${i * 80 + 300}ms` }}
                  >
                    <Icon className="h-4 w-4 text-[--color-terracotta] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[--color-cream]/40 uppercase tracking-widest">{cred.label}</p>
                      <p className="text-sm text-[--color-sand]">{cred.desc}</p>
                    </div>
                    <span className="text-sm font-display italic text-[--color-terracotta] shrink-0">{cred.value}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
