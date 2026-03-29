"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { KenBurnsImage } from "@/components/ken-burns-image"
import { Check, X } from "lucide-react"

const pricing = [
  { persons: "Solo", price: "$7,000", note: "per expedition" },
  { persons: "Two", price: "$3,700", note: "per person" },
  { persons: "Group 3+", price: "$3,300", note: "per person" },
]

const included = [
  "All ground transport from Skardu",
  "Daily trips to Khunjerab National Park",
  "Accommodation throughout expedition",
  "Expert guides, porters & snow leopard expert",
  "High-quality binoculars & spotting scopes",
  "Trap cameras for monitoring",
  "National park permit documentation",
]

const notIncluded = [
  "International & domestic flights",
  "Personal travel insurance",
  "Tips for guides and porters",
  "Personal expenses",
]

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.2 })

  return (
    <section id="pricing" ref={ref} className="relative min-h-screen w-full overflow-hidden">
      <KenBurnsImage src="/golden-sunrise-over-snow-covered-karakoram-mountai.jpg" alt="Karakoram mountains" direction="up" />

      {/* Glass Overlay */}
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/30" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 py-24">
        <div
          className={`max-w-5xl mx-auto transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/50 mb-6 text-center">Investment</p>
          <h2 className="text-3xl md:text-4xl font-light text-white/95 mb-4 text-center">Expedition Pricing</h2>
          <p className="text-sm text-white/50 text-center mb-12 max-w-lg mx-auto">
            Competitive pricing with group discounts. A portion of proceeds supports local conservation initiatives.
          </p>

          <div className="grid md:grid-cols-3 gap-px bg-white/10 mb-16 rounded-xl overflow-hidden">
            {pricing.map((item, i) => (
              <div
                key={item.persons}
                className={`bg-zinc-900/70 backdrop-blur-sm p-8 md:p-12 text-center transition-all duration-700 hover:bg-zinc-800/70 ${isInView ? "opacity-100" : "opacity-0"
                  }`}
                style={{ transitionDelay: `${i * 150 + 300}ms` }}
              >
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/50 mb-4">{item.persons}</p>
                <p className="text-3xl md:text-4xl font-light text-white/95 mb-2">{item.price}</p>
                <p className="text-[11px] text-white/40">{item.note}</p>
              </div>
            ))}
          </div>

          {/* Included/Not Included - side by side */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            <div
              className={`transition-all duration-700 delay-500 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-6">Included in Package</p>
              <ul className="space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-emerald-400/70 mt-0.5 shrink-0" />
                    <span className="text-sm text-white/60">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={`transition-all duration-700 delay-600 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-6">Not Included</p>
              <ul className="space-y-3">
                {notIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <X className="w-4 h-4 text-white/30 mt-0.5 shrink-0" />
                    <span className="text-sm text-white/40">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA to contact */}
          <div
            className={`mt-16 text-center transition-all duration-700 delay-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-lg text-sm uppercase tracking-wider text-white/90 transition-all duration-300"
            >
              Book Your Expedition
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
