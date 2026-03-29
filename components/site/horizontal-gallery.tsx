"use client"

import { useRef, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { GalleryItem } from "@/lib/db/schema"

export function HorizontalGallery({ images }: { images: GalleryItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartX = useRef(0)
  const scrollStartX = useRef(0)

  const scrollTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, images.length - 1))
    setActiveIdx(clamped)
    const el = scrollRef.current
    if (!el) return
    const imageWidth = el.clientWidth * 0.7
    el.scrollTo({ left: clamped * imageWidth, behavior: "smooth" })
  }, [images.length])

  function onMouseDown(e: React.MouseEvent) {
    setIsDragging(true)
    dragStartX.current = e.clientX
    scrollStartX.current = scrollRef.current?.scrollLeft ?? 0
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging || !scrollRef.current) return
    scrollRef.current.scrollLeft = scrollStartX.current - (e.clientX - dragStartX.current)
  }

  function onMouseUp() { setIsDragging(false) }

  return (
    <section className="py-20 bg-[--color-charcoal] overflow-hidden">
      <div className="mb-8 max-w-6xl mx-auto px-6 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-[--color-terracotta]" />
            <span className="text-[--color-terracotta] text-xs uppercase tracking-[0.2em]">Gallery</span>
          </div>
          <h2 className="font-display text-[clamp(1.8rem,3vw,2.6rem)] text-[--color-cream]">Through the Lens</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollTo(activeIdx - 1)}
            disabled={activeIdx === 0}
            className="p-2 border border-white/10 rounded-sm text-[--color-cream]/40 hover:text-[--color-cream] hover:border-white/30 disabled:opacity-20 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scrollTo(activeIdx + 1)}
            disabled={activeIdx === images.length - 1}
            className="p-2 border border-white/10 rounded-sm text-[--color-cream]/40 hover:text-[--color-cream] hover:border-white/30 disabled:opacity-20 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        className={cn(
          "flex gap-3 pl-6 overflow-x-auto scrollbar-none select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{ scrollbarWidth: "none" }}
      >
        {images.map((img, i) => (
          <div
            key={img.id}
            onClick={() => setActiveIdx(i)}
            className={cn(
              "relative shrink-0 rounded-sm overflow-hidden transition-all duration-500",
              "w-[85vw] sm:w-[65vw] md:w-[55vw] aspect-[4/3]",
              i !== activeIdx && "brightness-50"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={img.caption} className="w-full h-full object-cover" draggable={false} />
            {i === activeIdx && (
              <div className="absolute inset-0 bg-gradient-to-t from-[--color-charcoal]/70 to-transparent flex flex-col justify-end p-5">
                <p className="text-[--color-cream] font-body text-sm leading-snug">{img.caption}</p>
                <p className="text-[--color-terracotta] text-xs uppercase tracking-widest mt-1">{img.location}</p>
              </div>
            )}
          </div>
        ))}
        <div className="shrink-0 w-4" />
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              i === activeIdx ? "w-6 bg-[--color-terracotta]" : "w-1.5 bg-white/20"
            )}
          />
        ))}
      </div>
    </section>
  )
}
