"use client"

import { useRef } from "react"
import { useInView } from "@/hooks/use-in-view"
import { Award, Map, Radio, Users } from "lucide-react"

const credentials = [
  { icon: Award, label: "Wildlife Conservation Society", value: "7+ Years", desc: "Afghanistan field work" },
  { icon: Radio, label: "National Geographic Wild", value: "3 Projects", desc: "GPS collaring expeditions" },
  { icon: Map, label: "Territory Knowledge", value: "Indigenous", desc: "Generational expertise" },
  { icon: Users, label: "Network", value: "40+ Scouts", desc: "Valley monitoring team" },
]

export function ExpertSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.2 })

  return (
    <section id="expedition" ref={ref} className="relative min-h-screen w-full overflow-hidden">
      {/* Background Glass */}
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm z-0" />

      {/* Split layout */}
      <div className="grid lg:grid-cols-2 min-h-screen relative z-10">
        {/* Left - Image */}
        <div className="relative h-[50vh] lg:h-auto overflow-hidden">
          <div
            className={`absolute inset-0 transition-transform duration-[2s] ease-out ${isInView ? "scale-100" : "scale-110"
              }`}
          >
            <img
              src="/wildlife-expert-guide-with-binoculars-silhouette-a.jpg"
              alt="Expert guide surveying the landscape"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/80 lg:via-black/40 lg:to-black/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden" />

          {/* Floating quote on image */}
          <div
            className={`absolute bottom-8 left-8 right-8 lg:bottom-16 lg:left-16 transition-all duration-1000 delay-500 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            <blockquote className="text-sm md:text-base text-white/70 font-light italic leading-relaxed max-w-sm">
              "The snow leopard doesn't reveal itself to those who search. It appears to those who understand."
            </blockquote>
            <p className="text-[10px] uppercase tracking-wider text-white/40 mt-4">— Wakhi Proverb</p>
          </div>
        </div>

        {/* Right - Content */}
        <div className="relative flex items-center py-16 lg:py-24">
          <div className="px-8 md:px-12 lg:px-16 xl:px-24 max-w-xl">
            <div
              className={`transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
            >
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 mb-6">The Local Advantage</p>

              <h2 className="text-3xl md:text-4xl font-light text-white/90 leading-tight mb-2">Hussain Ali Khan</h2>
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/40 mb-8">Lead Snow Leopard Expert</p>

              <div className="h-px w-16 bg-white/20 mb-8" />

              <p className="text-sm text-white/50 leading-relaxed font-light mb-6">
                With over seven years of experience working with the Wildlife Conservation Society in Afghanistan and
                contributing expertise to National Geographic Wild teams for snow leopard GPS collaring projects, Mr.
                Khan brings unparalleled, first-hand knowledge to your expedition.
              </p>

              <p className="text-sm text-white/50 leading-relaxed font-light mb-12">
                Our guides are indigenous to these valleys—possessing intimate, generational knowledge of the terrain,
                animal behavior, and the subtle signs of the snow leopard's presence.
              </p>
            </div>

            {/* Credentials grid */}
            <div className="grid grid-cols-2 gap-4">
              {credentials.map((item, i) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className={`group p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-500 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                      }`}
                    style={{ transitionDelay: `${i * 100 + 300}ms` }}
                  >
                    <Icon className="w-4 h-4 text-white/40 mb-3 group-hover:text-white/70 transition-colors" />
                    <p className="text-lg font-light text-white/90 mb-1">{item.value}</p>
                    <p className="text-[9px] uppercase tracking-wider text-white/40">{item.label}</p>
                    <p className="text-[10px] text-white/30 mt-1">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
