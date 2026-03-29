"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { ChevronDown, Mountain, Camera, Users } from "lucide-react"
import { useTypewriter } from "@/hooks/use-typewriter"

export function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const heroRef = useRef<HTMLDivElement>(null)

  // Typewriter hooks
  const { displayedText: line1, isComplete: line1Complete } = useTypewriter("Journey into the Realm", {
    speed: 50,
    startDelay: 500,
    start: loaded,
  })

  const { displayedText: line2Part1, isComplete: line2Part1Complete } = useTypewriter("of the ", {
    speed: 50,
    start: line1Complete,
  })

  const { displayedText: line2Part2 } = useTypewriter("Mountain Ghost", {
    speed: 60,
    start: line2Part1Complete,
  })

  useEffect(() => {
    setLoaded(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  return (
    <section ref={heroRef} onMouseMove={handleMouseMove} className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="absolute inset-[-10%] animate-slow-zoom"
          style={{
            transform: `translate(${(mousePosition.x - 0.5) * -30}px, ${(mousePosition.y - 0.5) * -30}px)`,
            transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-contain"
            poster="/majestic-snow-leopard-sitting-on-rocky-mountain-le.jpg"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
        {/* Lighter gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/30 via-transparent to-zinc-950/30" />

        {/* Cinematic Scrim for Navigation Visibility */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-20" />

        {/* Animated light rays effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,200,100,0.08)_0%,transparent_60%)] animate-pulse-slow" />
      </div>

      {/* Animated vertical lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent animate-line-drift" />
        <div className="absolute left-[90%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent animate-line-drift-reverse" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-32 px-6 md:px-12 lg:px-24">
        <div
          className={`transition-all duration-1000 delay-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
        >
          <div className={`h-px bg-white/30 mb-6 transition-all duration-1000 delay-700 ${loaded ? "w-24" : "w-0"}`} />

          <p className="text-[10px] uppercase tracking-[0.5em] text-white/50 mb-4">Gilgit-Baltistan, Pakistan</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white/95 max-w-4xl leading-[1.05] min-h-[2.2em]">
            <span className="block">
              {line1}
              <span className="animate-pulse ml-1 opacity-50">|</span>
            </span>
            <span className="block">
              {line2Part1}
              <em className="font-normal italic text-white/70">{line2Part2}</em>
            </span>
          </h1>
          <p className="mt-8 text-sm md:text-base text-white/50 max-w-xl leading-relaxed font-light">
            Exclusive Snow Leopard Photo Expeditions in the Heart of the Karakoram
          </p>

          <div className="mt-12 flex flex-wrap gap-8">
            {[
              { icon: Mountain, label: "Since 2014" },
              { icon: Camera, label: "Photo Expeditions" },
              { icon: Users, label: "Indigenous Guides" },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 text-white/50 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                style={{ transitionDelay: `${900 + i * 100}ms` }}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-1200 ${loaded ? "opacity-100" : "opacity-0"
            }`}
        >
          <span className="text-[8px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
          <ChevronDown className="w-4 h-4 text-white/30 animate-bounce" />
        </div>
      </div>
    </section>
  )
}
