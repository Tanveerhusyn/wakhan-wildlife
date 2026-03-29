"use client"

import { useRef, useState } from "react"
import { useInView } from "@/hooks/use-in-view"

const wildlife = [
  {
    name: "Marco Polo Sheep",
    scientific: "Ovis ammon polii",
    desc: "Named after the legendary explorer, these magnificent sheep with their spiraling horns roam the high-altitude pastures.",
    image: "/marco-polo-sheep-with-large-curved-horns-on-mounta.jpg",
    stat: "4,000m+",
    statLabel: "Altitude Range",
  },
  {
    name: "Himalayan Ibex",
    scientific: "Capra sibirica hemalayanus",
    desc: "Sure-footed masters of the cliffs, ibex navigate impossible terrain with grace, often seen along the drive to base camp.",
    image: "/himalayan-ibex-standing-on-rocky-cliff-edge--mount.jpg",
    stat: "85kg",
    statLabel: "Average Weight",
  },
  {
    name: "Golden Eagle",
    scientific: "Aquila chrysaetos",
    desc: "Soaring above the peaks, these apex predators command the skies of the Karakoram with wingspans reaching over 2 meters.",
    image: "/golden-eagle-soaring-over-snow-capped-mountains--d.jpg",
    stat: "2.3m",
    statLabel: "Wingspan",
  },
]

export function WildlifeSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.2 })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="wildlife" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-zinc-900/30 backdrop-blur-md" />

      {/* Mist Effect */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Subtle background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.02)_0%,transparent_60%)]" />

      <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div
          className={`transition-all duration-1000 mb-16 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 mb-4">The Ecosystem</p>
          <h2 className="text-2xl md:text-3xl font-light text-white/90 mb-4">Wildlife of the Karakoram</h2>
          <p className="text-xs text-white/40 max-w-lg">
            Beyond the snow leopard, these mountains harbor an extraordinary diversity of life adapted to extreme
            altitudes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-1">
          {wildlife.map((animal, i) => (
            <div
              key={animal.name}
              className={`group relative overflow-hidden cursor-pointer transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${hoveredIndex !== null && hoveredIndex !== i ? "opacity-50" : ""}`}
              style={{ transitionDelay: `${i * 150 + 200}ms` }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Image with zoom on hover */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={animal.image || "/placeholder.svg"}
                  alt={animal.name}
                  className="w-full h-full object-cover transition-all duration-[1.5s] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                <div className="absolute top-6 right-6 text-right opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <p className="text-2xl font-light text-white/90">{animal.stat}</p>
                  <p className="text-[8px] uppercase tracking-wider text-white/50">{animal.statLabel}</p>
                </div>
              </div>

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="text-[8px] uppercase tracking-[0.3em] text-white/40 mb-2 italic">{animal.scientific}</p>
                <h3 className="text-lg md:text-xl font-light text-white/90 mb-3 group-hover:translate-x-2 transition-transform duration-500">
                  {animal.name}
                </h3>
                <p className="text-[11px] text-white/50 leading-relaxed max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-500">
                  {animal.desc}
                </p>

                <div className="h-px bg-white/30 mt-4 w-0 group-hover:w-full transition-all duration-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
