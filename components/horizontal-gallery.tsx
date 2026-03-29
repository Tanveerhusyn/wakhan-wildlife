"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { useInView } from "@/hooks/use-in-view"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"

const galleryImages = [
  {
    src: "/snow-leopard-stalking-on-rocky-mountain-cliff-at-g.jpg",
    caption: "A snow leopard surveys its territory at dusk",
    location: "Khunjerab National Park",
  },
  {
    src: "/marco-polo-sheep-herd-with-large-curved-horns-on-m.jpg",
    caption: "Marco Polo sheep on high-altitude pastures",
    location: "Wakhan Corridor",
  },
  {
    src: "/local-mountain-guide-with-binoculars-scanning-snow.jpg",
    caption: "Expert guides scanning for wildlife",
    location: "Sost Valley",
  },
  {
    src: "/turquoise-glacial-lake-reflecting-snow-capped-kara.jpg",
    caption: "Glacial lake reflecting the Karakoram peaks",
    location: "Hunza Valley",
  },
  {
    src: "/golden-eagle-soaring-through-dramatic-mountain-mis.jpg",
    caption: "Golden eagle in pursuit through mountain mist",
    location: "Upper Hunza",
  },
  {
    src: "/himalayan-ibex-standing-on-steep-rocky-cliff-with-.jpg",
    caption: "Himalayan ibex navigating treacherous terrain",
    location: "Khunjerab Pass",
  },
]

export function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { threshold: 0.1 })
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return
    const itemWidth = scrollRef.current.querySelector("div")?.clientWidth || 0
    const gap = 24
    scrollRef.current.scrollTo({
      left: index * (itemWidth + gap),
      behavior: "smooth",
    })
  }

  const handleScroll = () => {
    if (!scrollRef.current) return
    const scrollPosition = scrollRef.current.scrollLeft
    const itemWidth = scrollRef.current.querySelector("div")?.clientWidth || 0
    const gap = 24
    const newIndex = Math.round(scrollPosition / (itemWidth + gap))
    setActiveIndex(Math.min(Math.max(newIndex, 0), galleryImages.length - 1))
  }

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp)
    return () => window.removeEventListener("mouseup", handleMouseUp)
  }, [])

  return (
    <section ref={containerRef} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-zinc-900/30 backdrop-blur-md" />

      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.03)_0%,transparent_50%)]" />

      {/* Header */}
      <div
        className={`px-6 md:px-12 lg:px-24 mb-12 transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 max-w-7xl mx-auto">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/50 mb-4">Gallery</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light text-white/95">
              Moments From
              <br />
              <span className="text-white/60">The Field</span>
            </h2>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40 font-mono">
              {String(activeIndex + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className="p-3 border border-white/20 rounded-lg hover:bg-white/5 hover:border-white/40 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/20 transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4 text-white/70" />
              </button>
              <button
                onClick={() => scrollToIndex(Math.min(galleryImages.length - 1, activeIndex + 1))}
                disabled={activeIndex === galleryImages.length - 1}
                className="p-3 border border-white/20 rounded-lg hover:bg-white/5 hover:border-white/40 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/20 transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        className={`flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 px-6 md:px-12 lg:px-24 cursor-grab transition-all duration-1000 delay-200 ${isInView ? "opacity-100" : "opacity-0"
          } ${isDragging ? "cursor-grabbing" : ""}`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {galleryImages.map((image, i) => (
          <div key={i} className="flex-shrink-0 w-[85vw] md:w-[70vw] lg:w-[55vw] snap-center group">
            <div className="relative aspect-[3/2] overflow-hidden bg-zinc-800 rounded-xl">
              {/* Image */}
              <img
                src={image.src || "/placeholder.svg"}
                alt={image.caption}
                className={`w-full h-full object-cover transition-all duration-700 ${i === activeIndex ? "scale-100 brightness-100" : "scale-[1.02] brightness-75"
                  } group-hover:scale-105`}
                draggable={false}
              />

              {/* Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

              {/* Expand button */}
              <button className="absolute top-4 right-4 p-2.5 bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-white/70" />
              </button>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div
                  className={`transition-all duration-500 ${i === activeIndex ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                >
                  <p className="text-sm md:text-base text-white/95 mb-2 font-light">{image.caption}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-px bg-white/40" />
                    <p className="text-[10px] uppercase tracking-wider text-white/50">{image.location}</p>
                  </div>
                </div>
              </div>

              {/* Index indicator */}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-mono text-white/40 bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="px-6 md:px-12 lg:px-24 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-px bg-white/10 relative rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-white/50 transition-all duration-300"
              style={{ width: `${((activeIndex + 1) / galleryImages.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Thumbnail indicators */}
      <div className="flex justify-center gap-3 mt-8">
        {galleryImages.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`transition-all duration-300 rounded-full ${i === activeIndex ? "w-8 h-1.5 bg-white/70" : "w-1.5 h-1.5 bg-white/25 hover:bg-white/50"
              }`}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
