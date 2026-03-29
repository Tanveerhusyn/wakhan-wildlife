"use client"

import { useEffect, useState } from "react"
import { SectionEditor } from "@/components/admin/section-editor"
import { ImageUploader } from "@/components/admin/image-uploader"
import { VideoUploader } from "@/components/admin/video-uploader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { HeroContent } from "@/lib/db/schema"

export default function HeroSectionPage() {
  const [data, setData] = useState<Partial<HeroContent>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sections/hero")
      .then((r) => r.json())
      .then((d) => { setData(d ?? {}); setLoading(false) })
  }, [])

  function field(key: keyof HeroContent) {
    return {
      value: (data[key] as string) ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setData((prev) => ({ ...prev, [key]: e.target.value })),
    }
  }

  async function save() {
    const res = await fetch("/api/sections/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Save failed")
  }

  if (loading) return <p className="text-stone-400">Loading…</p>

  return (
    <SectionEditor title="Hero Section" description="The full-screen opening section with video background." onSave={save}>
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Heading Line 1</Label>
            <Input {...field("headingLine1")} />
          </div>
          <div className="space-y-1.5">
            <Label>Heading Line 2</Label>
            <Input {...field("headingLine2")} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Subheading (location)</Label>
          <Input {...field("subheading")} />
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea {...field("description")} rows={2} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {([1, 2, 3] as const).map((n) => (
            <div key={n} className="space-y-2 p-3 bg-stone-50 rounded-md border border-stone-100">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Badge {n}</p>
              <div className="space-y-1.5">
                <Label className="text-xs">Icon name</Label>
                <Input
                  value={(data[`badge${n}Icon` as keyof HeroContent] as string) ?? ""}
                  onChange={(e) => setData((p) => ({ ...p, [`badge${n}Icon`]: e.target.value }))}
                  placeholder="Mountain"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Label</Label>
                <Input
                  value={(data[`badge${n}Label` as keyof HeroContent] as string) ?? ""}
                  onChange={(e) => setData((p) => ({ ...p, [`badge${n}Label`]: e.target.value }))}
                  placeholder="Since 2014"
                  className="h-8 text-sm"
                />
              </div>
            </div>
          ))}
        </div>
        <VideoUploader
          label="Background Video"
          value={(data.videoUrl as string) ?? ""}
          onChange={(url) => setData((p) => ({ ...p, videoUrl: url }))}
          prefix="hero"
        />
        <ImageUploader
          label="Poster Image"
          value={(data.posterImageUrl as string) ?? ""}
          onChange={(url) => setData((p) => ({ ...p, posterImageUrl: url }))}
          prefix="hero"
        />
      </div>
    </SectionEditor>
  )
}
