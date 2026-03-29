"use client"

import { useEffect, useState } from "react"
import { SectionEditor } from "@/components/admin/section-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Statistic } from "@/lib/db/schema"

export default function StatisticsSectionPage() {
  const [stats, setStats] = useState<Partial<Statistic>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sections/statistics")
      .then((r) => r.json())
      .then((d: Statistic[]) => {
        // Ensure 4 positions
        const filled = [1, 2, 3, 4].map(
          (pos) => d.find((s) => s.position === pos) ?? { position: pos, endValue: 0, label: "", suffix: "", sublabel: "" }
        )
        setStats(filled)
        setLoading(false)
      })
  }, [])

  function updateStat(index: number, key: keyof Statistic, value: string | number) {
    setStats((prev) => prev.map((s, i) => (i === index ? { ...s, [key]: value } : s)))
  }

  async function save() {
    const res = await fetch("/api/sections/statistics", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stats),
    })
    if (!res.ok) throw new Error("Save failed")
  }

  if (loading) return <p className="text-stone-400">Loading…</p>

  return (
    <SectionEditor title="Statistics" description="The 4 animated counter values." onSave={save}>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-4 bg-stone-50 rounded-md border border-stone-200 space-y-3">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">
              Counter {stat.position}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Value</Label>
                <Input
                  type="number"
                  value={stat.endValue ?? ""}
                  onChange={(e) => updateStat(i, "endValue", parseInt(e.target.value) || 0)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Suffix</Label>
                <Input
                  value={stat.suffix ?? ""}
                  onChange={(e) => updateStat(i, "suffix", e.target.value)}
                  placeholder="+  or  %  or  m"
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Label</Label>
              <Input
                value={stat.label ?? ""}
                onChange={(e) => updateStat(i, "label", e.target.value)}
                placeholder="Years Active"
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sub-label</Label>
              <Input
                value={stat.sublabel ?? ""}
                onChange={(e) => updateStat(i, "sublabel", e.target.value)}
                placeholder="Since 2014"
                className="h-8 text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </SectionEditor>
  )
}
