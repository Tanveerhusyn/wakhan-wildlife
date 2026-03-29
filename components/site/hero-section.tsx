"use client"

import { useEffect, useRef, useState } from "react"
import { Mountain, Camera, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { HeroContent } from "@/lib/db/schema"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mountain, Camera, Users,
}

export function HeroSection({ data }: { data: HeroContent | null }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 })
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  const badges = [
    { icon: data?.badge1Icon, label: data?.badge1Label },
    { icon: data?.badge2Icon, label: data?.badge2Label },
    { icon: data?.badge3Icon, label: data?.badge3Label },
  ].filter((b) => b.label)

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background video */}
      <div
        className="absolute inset-0"
        style={{ transform: `translate(${mouse.x * 0.3}px, ${mouse.y * 0.3}px) scale(1.05)` }}
      >
        {data?.videoUrl && (
          <video
            className="w-full h-full object-cover"
            src={data.videoUrl}
            poster={data.posterImageUrl ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}
        {/* Warm overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[--color-charcoal]/60 via-[--color-charcoal]/30 to-[--color-charcoal]/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[--color-charcoal]/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div
          className={cn(
            "transition-all duration-1000",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-[--color-terracotta]" />
            <span className="text-[--color-terracotta] text-xs uppercase tracking-[0.2em] font-body">
              {data?.subheading ?? "Gilgit-Baltistan, Pakistan"}
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-[clamp(2.8rem,7vw,6rem)] leading-[1.05] text-[--color-cream] mb-6 max-w-3xl">
            {data?.headingLine1 ?? "Journey into the Realm"}
            <br />
            <em className="text-[--color-sand]">{data?.headingLine2 ?? "of the Mountain Ghost"}</em>
          </h1>

          {/* Description */}
          <p className="font-body text-[--color-cream]/60 text-lg max-w-xl mb-10 leading-relaxed">
            {data?.description ?? "Exclusive Snow Leopard Photo Expeditions in the Heart of the Karakoram"}
          </p>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {badges.map((badge, i) => {
                const Icon = badge.icon ? iconMap[badge.icon] : Mountain
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-4 py-2 bg-white/8 backdrop-blur-sm border border-white/10 rounded-sm"
                    style={{ transitionDelay: `${i * 100 + 400}ms` }}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5 text-[--color-terracotta]" />}
                    <span className="text-xs text-[--color-cream]/70 uppercase tracking-widest">{badge.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 opacity-50">
        <div className="w-px h-10 bg-[--color-cream]/30 animate-[pulse_2s_ease-in-out_infinite]" />
        <span className="text-[10px] text-[--color-cream]/40 uppercase tracking-widest">Scroll</span>
      </div>
    </section>
  )
}
