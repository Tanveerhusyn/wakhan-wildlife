"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { KenBurnsImage } from "@/components/ken-burns-image"

const culturePoints = [
  { label: "Language", value: "Wakhi, a distinct Eastern Iranian language" },
  { label: "Heritage", value: "Ancient pastoral traditions, still practiced today" },
  { label: "Philosophy", value: "Living in harmony with nature, not against it" },
  { label: "Hospitality", value: "Welcoming travelers for over a millennium" },
]

export function CultureSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.3 })

  return (
    <section id="culture" ref={ref} className="relative min-h-screen w-full overflow-hidden">
      {/* Split layout */}
      <div className="min-h-screen grid md:grid-cols-2">
        {/* Left - Image with overlay text */}
        <div className="relative h-[60vh] md:h-auto overflow-hidden">
          <KenBurnsImage
            src="/wakhi-people-in-traditional-clothing-in-mountain-v.jpg"
            alt="Wakhi people"
            direction="up"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black md:bg-gradient-to-r md:from-transparent md:to-black" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          <div className="absolute bottom-12 left-6 md:left-12">
            <p className="text-6xl md:text-8xl font-light text-white/10 leading-none">Wakhi</p>
          </div>
        </div>

        {/* Right - Content */}
        <div className="relative flex items-center">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(255,255,255,0.02)_0%,transparent_60%)]" />

          <div className="relative z-10 px-6 md:px-12 lg:px-16 py-16 md:py-24">
            <div
              className={`transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
            >
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 mb-6">The Wakhi People</p>
              <h2 className="text-3xl md:text-4xl font-light text-white/90 leading-snug mb-8">
                Guardians of
                <br />
                the Mountains
              </h2>

              <div className="space-y-6 mb-12">
                <p className="text-sm text-white/50 leading-relaxed font-light">
                  Our guides and experts are indigenous to these very valleys. They possess an intimate, generational
                  knowledge of the terrain, animal behavior, and the subtle signs of the snow leopard's presence that no
                  outsider could replicate.
                </p>

                <p className="text-xs text-white/40 leading-relaxed font-light">
                  The Wakhi people have called these mountains home for millennia, developing a profound connection with
                  the land and its creatures. Their traditional knowledge of wildlife movements, weather patterns, and
                  hidden valleys is invaluable to every expedition.
                </p>
              </div>

              <div className="space-y-0 border-t border-white/10">
                {culturePoints.map((item, i) => (
                  <div
                    key={item.label}
                    className={`py-4 border-b border-white/10 flex justify-between items-baseline gap-4 transition-all duration-700 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                      }`}
                    style={{ transitionDelay: `${i * 100 + 400}ms` }}
                  >
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/30 shrink-0">{item.label}</p>
                    <p className="text-[11px] text-white/60 text-right">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
