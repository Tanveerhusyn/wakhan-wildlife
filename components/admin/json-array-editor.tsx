"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface FieldDef {
  key: string
  label: string
  placeholder?: string
}

interface JsonArrayEditorProps {
  label?: string
  value: Record<string, string>[]
  onChange: (value: Record<string, string>[]) => void
  fields: FieldDef[]
  addLabel?: string
}

export function JsonArrayEditor({
  label,
  value,
  onChange,
  fields,
  addLabel = "Add Item",
}: JsonArrayEditorProps) {
  function updateItem(index: number, key: string, val: string) {
    const next = value.map((item, i) =>
      i === index ? { ...item, [key]: val } : item
    )
    onChange(next)
  }

  function removeItem(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function addItem() {
    const empty = Object.fromEntries(fields.map((f) => [f.key, ""]))
    onChange([...value, empty])
  }

  return (
    <div className="space-y-3">
      {label && (
        <Label className="text-sm font-medium text-stone-700">{label}</Label>
      )}

      <div className="space-y-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="flex gap-2 items-start p-3 bg-stone-50 rounded-md border border-stone-200"
          >
            <GripVertical className="h-4 w-4 text-stone-300 mt-2 shrink-0" />
            <div className="flex-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${fields.length}, 1fr)` }}>
              {fields.map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label className="text-xs text-stone-500">{field.label}</Label>
                  <Input
                    value={item[field.key] ?? ""}
                    onChange={(e) => updateItem(index, field.key, e.target.value)}
                    placeholder={field.placeholder ?? field.label}
                    className="text-sm h-8"
                  />
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-stone-400 hover:text-red-500 h-8 w-8"
              onClick={() => removeItem(index)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addItem}
        className="text-stone-600"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        {addLabel}
      </Button>
    </div>
  )
}
