"use client"

import { useEffect, useState } from "react"
import { SectionEditor } from "@/components/admin/section-editor"
import { ImageUploader } from "@/components/admin/image-uploader"
import { JsonArrayEditor } from "@/components/admin/json-array-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CultureContent } from "@/lib/db/schema"

export default function CultureSectionPage() {
  const [data, setData] = useState<Partial<CultureContent>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sections/culture")
      .then((r) => r.json())
      .then((d) => { setData(d ?? {}); setLoading(false) })
  }, [])

  function set(key: keyof CultureContent, value: unknown) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  async function save() {
    const res = await fetch("/api/sections/culture", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Save failed")
  }

  if (loading) return <p className="text-stone-400">Loading…</p>

  return (
    <SectionEditor title="Culture Section" description="The Wakhi people section." onSave={save}>
      <div className="space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>Eyebrow</Label>
            <Input value={(data.eyebrow as string) ?? ""} onChange={(e) => set("eyebrow", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Title Line 1</Label>
            <Input value={(data.titleLine1 as string) ?? ""} onChange={(e) => set("titleLine1", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Title Line 2</Label>
            <Input value={(data.titleLine2 as string) ?? ""} onChange={(e) => set("titleLine2", e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Paragraph 1</Label>
          <Textarea value={(data.paragraph1 as string) ?? ""} onChange={(e) => set("paragraph1", e.target.value)} rows={4} />
        </div>
        <div className="space-y-1.5">
          <Label>Paragraph 2</Label>
          <Textarea value={(data.paragraph2 as string) ?? ""} onChange={(e) => set("paragraph2", e.target.value)} rows={4} />
        </div>
        <JsonArrayEditor
          label="Culture Points"
          value={(data.culturePoints as Record<string, string>[]) ?? []}
          onChange={(v) => set("culturePoints", v)}
          fields={[
            { key: "label", label: "Label", placeholder: "Language" },
            { key: "value", label: "Value", placeholder: "Wakhi (Khik)" },
          ]}
          addLabel="Add Point"
        />
        <ImageUploader label="Image" value={(data.imageUrl as string) ?? ""} onChange={(url) => set("imageUrl", url)} prefix="culture" />
      </div>
    </SectionEditor>
  )
}
