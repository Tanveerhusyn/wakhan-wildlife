"use client"

import { useEffect, useState } from "react"
import { SectionEditor } from "@/components/admin/section-editor"
import { ImageUploader } from "@/components/admin/image-uploader"
import { JsonArrayEditor } from "@/components/admin/json-array-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ExpertContent } from "@/lib/db/schema"

export default function ExpertSectionPage() {
  const [data, setData] = useState<Partial<ExpertContent>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sections/expert")
      .then((r) => r.json())
      .then((d) => { setData(d ?? {}); setLoading(false) })
  }, [])

  function set(key: keyof ExpertContent, value: unknown) {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  async function save() {
    const res = await fetch("/api/sections/expert", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Save failed")
  }

  if (loading) return <p className="text-stone-400">Loading…</p>

  return (
    <SectionEditor title="Expert Guide Section" description="Guide bio, credentials, and quote." onSave={save}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={(data.name as string) ?? ""} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={(data.title as string) ?? ""} onChange={(e) => set("title", e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Biography Paragraph 1</Label>
          <Textarea value={(data.bioParagraph1 as string) ?? ""} onChange={(e) => set("bioParagraph1", e.target.value)} rows={4} />
        </div>
        <div className="space-y-1.5">
          <Label>Biography Paragraph 2</Label>
          <Textarea value={(data.bioParagraph2 as string) ?? ""} onChange={(e) => set("bioParagraph2", e.target.value)} rows={4} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Quote</Label>
            <Textarea value={(data.quote as string) ?? ""} onChange={(e) => set("quote", e.target.value)} rows={3} />
          </div>
          <div className="space-y-1.5">
            <Label>Quote Attribution</Label>
            <Input value={(data.quoteAttribution as string) ?? ""} onChange={(e) => set("quoteAttribution", e.target.value)} />
          </div>
        </div>
        <JsonArrayEditor
          label="Credentials"
          value={(data.credentials as Record<string, string>[]) ?? []}
          onChange={(v) => set("credentials", v)}
          fields={[
            { key: "icon", label: "Icon", placeholder: "Award" },
            { key: "label", label: "Label", placeholder: "Wildlife Conservation Society" },
            { key: "value", label: "Value", placeholder: "7+ Years" },
            { key: "desc", label: "Description", placeholder: "Afghanistan field work" },
          ]}
          addLabel="Add Credential"
        />
        <ImageUploader label="Photo" value={(data.imageUrl as string) ?? ""} onChange={(url) => set("imageUrl", url)} prefix="expert" />
      </div>
    </SectionEditor>
  )
}
