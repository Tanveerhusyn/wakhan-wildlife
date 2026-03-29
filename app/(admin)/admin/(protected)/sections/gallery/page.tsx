"use client"

import { useEffect, useState } from "react"
import { SectionEditor } from "@/components/admin/section-editor"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2 } from "lucide-react"
import type { GalleryItem } from "@/lib/db/schema"

export default function GallerySectionPage() {
  const [items, setItems] = useState<Partial<GalleryItem>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sections/gallery")
      .then((r) => r.json())
      .then((d: GalleryItem[]) => { setItems(d); setLoading(false) })
  }, [])

  function update(index: number, key: keyof GalleryItem, value: string | number) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)))
  }

  async function save() {
    const res = await fetch("/api/sections/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(items.map((item, i) => ({ ...item, displayOrder: i + 1 }))),
    })
    if (!res.ok) throw new Error("Save failed")
  }

  if (loading) return <p className="text-stone-400">Loading…</p>

  return (
    <SectionEditor title="Gallery" description="Horizontal scroll gallery images." onSave={save}>
      <div className="space-y-4">
        <Accordion type="multiple" className="space-y-2">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="bg-stone-50 rounded-md border border-stone-200 px-4">
              <AccordionTrigger className="text-sm font-medium text-stone-800 hover:no-underline">
                {item.caption || `Image ${i + 1}`}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pb-4">
                  <ImageUploader label="Image" value={item.src ?? ""} onChange={(url) => update(i, "src", url)} prefix="gallery" />
                  <div className="space-y-1.5">
                    <Label className="text-xs">Caption</Label>
                    <Input value={item.caption ?? ""} onChange={(e) => update(i, "caption", e.target.value)} className="text-sm h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Location</Label>
                    <Input value={item.location ?? ""} onChange={(e) => update(i, "location", e.target.value)} className="text-sm h-8" />
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}>
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Remove
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button variant="outline" size="sm" onClick={() => setItems((p) => [...p, { displayOrder: p.length + 1, src: "", caption: "", location: "" }])}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Image
        </Button>
      </div>
    </SectionEditor>
  )
}
