"use client"

import { useEffect, useState } from "react"
import { SectionEditor } from "@/components/admin/section-editor"
import { JsonArrayEditor } from "@/components/admin/json-array-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PricingTier, PricingItem } from "@/lib/db/schema"

export default function PricingSectionPage() {
  const [tiers, setTiers] = useState<Partial<PricingTier>[]>([])
  const [included, setIncluded] = useState<{ text: string }[]>([])
  const [excluded, setExcluded] = useState<{ text: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sections/pricing")
      .then((r) => r.json())
      .then(({ tiers: t, items }: { tiers: PricingTier[]; items: PricingItem[] }) => {
        setTiers(t)
        setIncluded(items.filter((i) => i.type === "included").map((i) => ({ text: i.text })))
        setExcluded(items.filter((i) => i.type === "excluded").map((i) => ({ text: i.text })))
        setLoading(false)
      })
  }, [])

  function updateTier(index: number, key: keyof PricingTier, value: string) {
    setTiers((prev) => prev.map((t, i) => (i === index ? { ...t, [key]: value } : t)))
  }

  async function save() {
    const includedItems = included.map((item, i) => ({ type: "included", displayOrder: i + 1, text: item.text }))
    const excludedItems = excluded.map((item, i) => ({ type: "excluded", displayOrder: i + 1, text: item.text }))

    const res = await fetch("/api/sections/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tiers: tiers.map((t, i) => ({ ...t, displayOrder: i + 1 })),
        items: [...includedItems, ...excludedItems],
      }),
    })
    if (!res.ok) throw new Error("Save failed")
  }

  if (loading) return <p className="text-stone-400">Loading…</p>

  return (
    <SectionEditor title="Pricing" description="Tiers and included/excluded items." onSave={save}>
      <div className="space-y-6">
        {/* Tiers */}
        <div>
          <p className="text-sm font-semibold text-stone-700 mb-3">Pricing Tiers</p>
          <div className="grid grid-cols-3 gap-4">
            {tiers.map((tier, i) => (
              <div key={i} className="p-3 bg-stone-50 rounded-md border border-stone-200 space-y-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Persons Label</Label>
                  <Input value={tier.personsLabel ?? ""} onChange={(e) => updateTier(i, "personsLabel", e.target.value)} className="text-sm h-8" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Price</Label>
                  <Input value={tier.price ?? ""} onChange={(e) => updateTier(i, "price", e.target.value)} placeholder="$7,000" className="text-sm h-8" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Note</Label>
                  <Input value={tier.note ?? ""} onChange={(e) => updateTier(i, "note", e.target.value)} placeholder="per expedition" className="text-sm h-8" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <JsonArrayEditor
            label="What's Included"
            value={included as Record<string, string>[]}
            onChange={(v) => setIncluded(v as { text: string }[])}
            fields={[{ key: "text", label: "Item", placeholder: "All ground transport" }]}
            addLabel="Add Item"
          />
          <JsonArrayEditor
            label="Not Included"
            value={excluded as Record<string, string>[]}
            onChange={(v) => setExcluded(v as { text: string }[])}
            fields={[{ key: "text", label: "Item", placeholder: "International flights" }]}
            addLabel="Add Item"
          />
        </div>
      </div>
    </SectionEditor>
  )
}
