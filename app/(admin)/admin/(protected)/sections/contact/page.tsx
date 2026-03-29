"use client"

import { useEffect, useState } from "react"
import { SectionEditor } from "@/components/admin/section-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const CONTACT_KEYS = ["contact_email", "contact_phone", "contact_location", "best_season", "group_sizes"]

export default function ContactSectionPage() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sections/site-settings")
      .then((r) => r.json())
      .then((rows: { key: string; value: string }[]) => {
        const map: Record<string, string> = {}
        rows.forEach((r) => { map[r.key] = r.value })
        setValues(map)
        setLoading(false)
      })
  }, [])

  async function save() {
    const payload = CONTACT_KEYS.map((key) => ({ key, value: values[key] ?? "" }))
    const res = await fetch("/api/sections/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error("Save failed")
  }

  if (loading) return <p className="text-stone-400">Loading…</p>

  return (
    <SectionEditor title="Contact Information" description="Displayed in the contact section on the website." onSave={save}>
      <div className="space-y-4 max-w-md">
        <div className="space-y-1.5">
          <Label>Email Address</Label>
          <Input value={values.contact_email ?? ""} onChange={(e) => setValues((p) => ({ ...p, contact_email: e.target.value }))} type="email" />
        </div>
        <div className="space-y-1.5">
          <Label>Phone / WhatsApp</Label>
          <Input value={values.contact_phone ?? ""} onChange={(e) => setValues((p) => ({ ...p, contact_phone: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Location</Label>
          <Input value={values.contact_location ?? ""} onChange={(e) => setValues((p) => ({ ...p, contact_location: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>Best Season</Label>
          <Input value={values.best_season ?? ""} onChange={(e) => setValues((p) => ({ ...p, best_season: e.target.value }))} placeholder="March – April, November – December" />
        </div>
        <div className="space-y-1.5">
          <Label>Group Sizes Info</Label>
          <Input value={values.group_sizes ?? ""} onChange={(e) => setValues((p) => ({ ...p, group_sizes: e.target.value }))} placeholder="Solo, pairs, or small groups (3–6)" />
        </div>
      </div>
    </SectionEditor>
  )
}
