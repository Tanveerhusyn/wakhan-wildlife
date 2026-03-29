"use client"

import { useState, useEffect } from "react"
import { Menu, X, Mountain } from "lucide-react"
import { cn } from "@/lib/utils"
import type { NavigationItem } from "@/lib/db/schema"

export function SiteNavigation({ items }: { items: NavigationItem[] }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[--color-charcoal]/90 backdrop-blur-md border-b border-white/5 py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <Mountain className="h-5 w-5 text-[--color-terracotta]" />
          <span className="font-display italic text-[--color-cream] text-lg tracking-tight group-hover:text-white transition-colors">
            Wakhan Wildlife
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="text-xs uppercase tracking-[0.12em] text-[--color-cream]/60 hover:text-[--color-cream] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-[--color-cream]/70 hover:text-[--color-cream]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[--color-charcoal]/95 backdrop-blur-md border-t border-white/5 px-6 py-4 space-y-3">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block text-sm text-[--color-cream]/70 hover:text-[--color-cream] uppercase tracking-widest py-1"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
