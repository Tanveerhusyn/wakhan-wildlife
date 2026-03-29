"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { KenBurnsImage } from "@/components/ken-burns-image"
import { Binary as Binoculars, Compass, Leaf } from "lucide-react"

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.3 })

  return (
    <section id="about" ref={ref} className="relative min-h-screen w-full flex items-center overflow-hidden">
      {/* Background image with Ken Burns */}
      <KenBurnsImage src="/dramatic-misty-mountain-valley-in-pakistan-with-sn.jpg" alt="Snow leopard habitat" />

      {/* Vignette overlays - Lightened for new theme */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/60 via-zinc-950/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-zinc-950/20" />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 lg:px-24 py-24 max-w-2xl">
        <div
          className={`transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 mb-6">Since 2014</p>
          <h2 className="text-2xl md:text-3xl font-light text-white/90 leading-snug mb-8">Beyond a single sighting</h2>
          <p className="text-xs text-white/70 leading-relaxed mb-6 font-light">
            For the discerning wildlife enthusiast and photographer, there is no greater prize than witnessing the
            elusive snow leopard in its pristine, mountainous kingdom.
          </p>
          <p className="text-xs text-white/60 leading-relaxed font-light mb-10">
            We offer an immersive experience into the entire ecosystem of the Karakoram—from the majestic Marco Polo
            sheep and the sure-footed Himalayan ibex to the rich birdlife. A comprehensive wildlife tour, enriched with
            in-depth knowledge about flora, fauna, and local Wakhi culture.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-6">
            {[
              { icon: Binoculars, label: "Expert Spotters" },
              { icon: Compass, label: "Remote Valleys" },
              { icon: Leaf, label: "Conservation" },
            ].map((item, i) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
              >
                <item.icon className="w-5 h-5 text-white/50 mb-3 group-hover:text-white/80 transition-colors" />
                <p className="text-[9px] uppercase tracking-wider text-white/50 text-center group-hover:text-white/80 transition-colors">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
