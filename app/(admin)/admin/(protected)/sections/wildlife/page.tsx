"use client"

import { useEffect, useState } from "react"
import { SectionEditor } from "@/components/admin/section-editor"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Plus, Trash2 } from "lucide-react"
import type { Wildlife } from "@/lib/db/schema"

export default function WildlifeSectionPage() {
  const [animals, setAnimals] = useState<Partial<Wildlife>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/sections/wildlife")
      .then((r) => r.json())
      .then((d: Wildlife[]) => { setAnimals(d); setLoading(false) })
  }, [])

  function updateAnimal(index: number, key: keyof Wildlife, value: string | number) {
    setAnimals((prev) => prev.map((a, i) => (i === index ? { ...a, [key]: value } : a)))
  }

  function addAnimal() {
    setAnimals((prev) => [
      ...prev,
      { displayOrder: prev.length + 1, name: "New Animal", scientific: "", description: "", imageUrl: "", statValue: "", statLabel: "" },
    ])
  }

  function removeAnimal(index: number) {
    setAnimals((prev) =>
      prev.filter((_, i) => i !== index).map((a, i) => ({ ...a, displayOrder: i + 1 }))
    )
  }

  async function save() {
    const res = await fetch("/api/sections/wildlife", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(animals.map((a, i) => ({ ...a, displayOrder: i + 1 }))),
    })
    if (!res.ok) throw new Error("Save failed")
  }

  if (loading) return <p className="text-stone-400">Loading…</p>

  return (
    <SectionEditor title="Wildlife Section" description="Animals featured in the wildlife grid." onSave={save}>
      <div className="space-y-4">
        <Accordion type="multiple" className="space-y-2">
          {animals.map((animal, i) => (
            <AccordionItem
              key={i}
              value={`animal-${i}`}
              className="bg-stone-50 rounded-md border border-stone-200 px-4"
            >
              <AccordionTrigger className="text-sm font-medium text-stone-800 hover:no-underline">
                {animal.name || "Unnamed Animal"}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Common Name</Label>
                      <Input value={animal.name ?? ""} onChange={(e) => updateAnimal(i, "name", e.target.value)} className="text-sm h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Scientific Name</Label>
                      <Input value={animal.scientific ?? ""} onChange={(e) => updateAnimal(i, "scientific", e.target.value)} className="text-sm h-8 italic" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Description</Label>
                    <Textarea value={animal.description ?? ""} onChange={(e) => updateAnimal(i, "description", e.target.value)} rows={3} className="text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Stat Value</Label>
                      <Input value={animal.statValue ?? ""} onChange={(e) => updateAnimal(i, "statValue", e.target.value)} placeholder="4,000m+" className="text-sm h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Stat Label</Label>
                      <Input value={animal.statLabel ?? ""} onChange={(e) => updateAnimal(i, "statLabel", e.target.value)} placeholder="Altitude Range" className="text-sm h-8" />
                    </div>
                  </div>
                  <ImageUploader
                    label="Image"
                    value={animal.imageUrl ?? ""}
                    onChange={(url) => updateAnimal(i, "imageUrl", url)}
                    prefix="wildlife"
                  />
                  <Button variant="destructive" size="sm" onClick={() => removeAnimal(i)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Remove Animal
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <Button variant="outline" size="sm" onClick={addAnimal}>
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Animal
        </Button>
      </div>
    </SectionEditor>
  )
}
