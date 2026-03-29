"use client"

import { useEffect, useState } from "react"
import { SectionEditor } from "@/components/admin/section-editor"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2 } from "lucide-react"
import type { ItineraryDay } from "@/lib/db/schema"

const blankDay: Partial<ItineraryDay> = {
  dayLabel: "",
  dateLabel: "",
  title: "",
  location: "",
  duration: "",
  description: "",
  imageUrl: "",
  iconName: "Camera",
  isHighlight: false,
}

export default function ItinerarySectionPage() {
  const [days, setDays] = useState<Partial<ItineraryDay>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sections/itinerary")
      .then((r) => r.json())
      .then((d: ItineraryDay[]) => { setDays(d); setLoading(false) })
  }, [])

  function update(index: number, key: keyof ItineraryDay, value: unknown) {
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, [key]: value } : d)))
  }

  async function save() {
    const res = await fetch("/api/sections/itinerary", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(days.map((d, i) => ({ ...d, displayOrder: i + 1 }))),
    })
    if (!res.ok) throw new Error("Save failed")
  }

  if (loading) return <p className="text-stone-400">Loading…</p>

  return (
    <SectionEditor title="Itinerary" description="10-day expedition schedule." onSave={save}>
      <div className="space-y-4">
        <Accordion type="multiple" className="space-y-2">
          {days.map((day, i) => (
            <AccordionItem key={i} value={`day-${i}`} className="bg-stone-50 rounded-md border border-stone-200 px-4">
              <AccordionTrigger className="text-sm font-medium text-stone-800 hover:no-underline">
                Day {day.dayLabel || i + 1}: {day.title || "Untitled"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pb-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Day Label</Label>
                      <Input value={day.dayLabel ?? ""} onChange={(e) => update(i, "dayLabel", e.target.value)} placeholder="01" className="text-sm h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Date Label</Label>
                      <Input value={day.dateLabel ?? ""} onChange={(e) => update(i, "dateLabel", e.target.value)} placeholder="17 March" className="text-sm h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Duration</Label>
                      <Input value={day.duration ?? ""} onChange={(e) => update(i, "duration", e.target.value)} placeholder="7 hours" className="text-sm h-8" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Title</Label>
                      <Input value={day.title ?? ""} onChange={(e) => update(i, "title", e.target.value)} className="text-sm h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Location</Label>
                      <Input value={day.location ?? ""} onChange={(e) => update(i, "location", e.target.value)} className="text-sm h-8" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Icon Name (Lucide)</Label>
                      <Input value={day.iconName ?? ""} onChange={(e) => update(i, "iconName", e.target.value)} placeholder="Camera" className="text-sm h-8" />
                    </div>
                    <div className="flex items-center gap-2 mt-5">
                      <Checkbox
                        id={`highlight-${i}`}
                        checked={day.isHighlight ?? false}
                        onCheckedChange={(v) => update(i, "isHighlight", v)}
                      />
                      <Label htmlFor={`highlight-${i}`} className="text-xs">Mark as highlight day</Label>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Description</Label>
                    <Textarea value={day.description ?? ""} onChange={(e) => update(i, "description", e.target.value)} rows={4} className="text-sm" />
                  </div>
                  <ImageUploader label="Image" value={day.imageUrl ?? ""} onChange={(url) => update(i, "imageUrl", url)} prefix="itinerary" />
                  <Button variant="destructive" size="sm" onClick={() => setDays((p) => p.filter((_, idx) => idx !== i))}>
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Remove Day
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button variant="outline" size="sm" onClick={() => setDays((p) => [...p, { ...blankDay, displayOrder: p.length + 1 }])}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Day
        </Button>
      </div>
    </SectionEditor>
  )
}
