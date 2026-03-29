"use client"

import { useEffect, useState } from "react"
import { SectionEditor } from "@/components/admin/section-editor"
import { ImageUploader } from "@/components/admin/image-uploader"
import { JsonArrayEditor } from "@/components/admin/json-array-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { AboutContent } from "@/lib/db/schema"

type FeatureCard = { icon: string; label: string }

export default function AboutSectionPage() {
  const [data, setData] = useState<Partial<AboutContent>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sections/about")
      .then((r) => r.json())
      .then((d) => { setData(d ?? {}); setLoading(false) })
  }, [])

  function set(key: keyof AboutContent, value: unknown) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  async function save() {
    const res = await fetch("/api/sections/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Save failed")
  }

  if (loading) return <p className="text-stone-400">Loading…</p>

  const featureCards = ((data.featureCards as FeatureCard[]) ?? []) as Record<string, string>[]

  return (
    <SectionEditor title="About Section" description="The 'Beyond a single sighting' section." onSave={save}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Eyebrow text</Label>
            <Input value={(data.eyebrow as string) ?? ""} onChange={(e) => set("eyebrow", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={(data.title as string) ?? ""} onChange={(e) => set("title", e.target.value)} />
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
          label="Feature Cards"
          value={featureCards}
          onChange={(v) => set("featureCards", v)}
          fields={[
            { key: "icon", label: "Icon", placeholder: "Binoculars" },
            { key: "label", label: "Label", placeholder: "Expert Spotters" },
          ]}
          addLabel="Add Feature"
        />
        <ImageUploader
          label="Background Image"
          value={(data.imageUrl as string) ?? ""}
          onChange={(url) => set("imageUrl", url)}
          prefix="about"
        />
      </div>
    </SectionEditor>
  )
}
