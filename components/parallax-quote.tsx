"use client"

import { useRef, useEffect, useState } from "react"
import { useInView } from "@/hooks/use-in-view"

interface ParallaxQuoteProps {
  quote: string
  attribution?: string
  backgroundImage?: string
}

export function ParallaxQuote({ quote, attribution, backgroundImage }: ParallaxQuoteProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.3 })
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
        setScrollY(progress)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={ref} className="relative py-40 md:py-56 bg-black overflow-hidden">
      {backgroundImage && (
        <div className="absolute inset-0">
          <div className="absolute inset-0 scale-110" style={{ transform: `translateY(${(scrollY - 0.5) * 50}px)` }}>
            <img src={backgroundImage || "/placeholder.svg"} alt="" className="w-full h-full object-cover opacity-20" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black" />
        </div>
      )}

      {/* Animated gradient orbs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          transform: `translate(-50%, -50%) scale(${0.8 + scrollY * 0.4})`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center">
        <div
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex justify-center mb-8">
            <div className={`h-px bg-white/30 transition-all duration-1000 delay-300 ${isInView ? "w-16" : "w-0"}`} />
          </div>

          <blockquote className="text-lg md:text-2xl lg:text-3xl font-light text-white/80 leading-relaxed tracking-wide">
            {quote}
          </blockquote>

          {attribution && (
            <cite className="block mt-10 text-[10px] uppercase tracking-[0.4em] text-white/40 not-italic">
              — {attribution}
            </cite>
          )}

          <div className="flex justify-center mt-8">
            <div className={`h-px bg-white/30 transition-all duration-1000 delay-500 ${isInView ? "w-16" : "w-0"}`} />
          </div>
        </div>
      </div>
    </section>
  )
}
