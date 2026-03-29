"use client"

import { ReactNode, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Save, RotateCcw, Loader2 } from "lucide-react"

interface SectionEditorProps {
  title: string
  description?: string
  onSave: () => Promise<void>
  onReset?: () => void
  children: ReactNode
}

export function SectionEditor({
  title,
  description,
  onSave,
  onReset,
  children,
}: SectionEditorProps) {
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      await onSave()
      toast.success("Section saved successfully")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save section")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-stone-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-stone-500">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onReset && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              disabled={saving}
            >
              <RotateCcw className="h-4 w-4 mr-1.5" />
              Reset
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-1.5" />
            )}
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-stone-200 p-6">
        {children}
      </div>
    </div>
  )
}
