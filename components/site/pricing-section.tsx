"use client"

import { useRef } from "react"
import { Check, X } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"
import type { PricingTier, PricingItem } from "@/lib/db/schema"

export function PricingSection({
  tiers,
  items,
}: {
  tiers: PricingTier[]
  items: PricingItem[]
}) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { threshold: 0.15 })

  const included = items.filter((i) => i.type === "included")
  const excluded = items.filter((i) => i.type === "excluded")

  return (
    <section id="pricing" ref={ref} className="py-24 bg-[--color-cream]">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className={cn("mb-12 transition-all duration-700", inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[--color-terracotta]" />
            <span className="text-[--color-terracotta] text-xs uppercase tracking-[0.2em]">Investment</span>
          </div>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] text-[--color-charcoal]">
            Expedition Pricing
          </h2>
          <p className="mt-3 text-[--color-charcoal]/60 font-body max-w-lg">
            All prices are per expedition. We keep groups small by design — maximum 6 participants.
          </p>
        </div>

        {/* Tiers */}
        <div className={cn(
          "grid md:grid-cols-3 gap-0.5 mb-14 transition-all duration-700 delay-100",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          {tiers.map((tier) => (
            <div key={tier.id} className="bg-[--color-charcoal] p-8 text-center">
              <p className="text-xs text-[--color-terracotta] uppercase tracking-[0.2em] mb-3">{tier.personsLabel}</p>
              <p className="font-display text-5xl text-[--color-cream] font-light">{tier.price}</p>
              <p className="text-xs text-[--color-cream]/40 mt-2 uppercase tracking-widest">{tier.note}</p>
            </div>
          ))}
        </div>

        {/* Included / not included */}
        <div className={cn(
          "grid md:grid-cols-2 gap-10 transition-all duration-700 delay-200",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <div>
            <h3 className="font-display text-lg text-[--color-charcoal] mb-4">What&apos;s Included</h3>
            <div className="divide-y divide-[--color-charcoal]/8">
              {included.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2.5">
                  <Check className="h-4 w-4 text-[--color-olive] shrink-0" />
                  <span className="text-sm text-[--color-charcoal]/70 font-body">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg text-[--color-charcoal] mb-4">Not Included</h3>
            <div className="divide-y divide-[--color-charcoal]/8">
              {excluded.map((item) => (
                <div key={item.id} className="flex items-center gap-3 py-2.5">
                  <X className="h-4 w-4 text-[--color-terracotta] shrink-0" />
                  <span className="text-sm text-[--color-charcoal]/70 font-body">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-block px-8 py-3.5 bg-[--color-charcoal] text-[--color-cream] font-body text-sm uppercase tracking-widest hover:bg-[--color-olive] transition-colors duration-300"
          >
            Enquire About Availability
          </a>
        </div>
      </div>
    </section>
  )
}
