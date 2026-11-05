"use client"

import { useState, useRef } from "react"
import { Upload, X, Loader2, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { uploadToBlob } from "@/lib/upload-client"
import { UPLOAD_RULES } from "@/lib/upload-rules"

interface VideoUploaderProps {
  label?: string
  value: string
  onChange: (url: string) => void
  prefix?: string
}

export function VideoUploader({
  label = "Video",
  value,
  onChange,
  prefix = "videos",
}: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    setUploading(true)
    try {
      const url = await uploadToBlob(file, prefix, "video")
      onChange(url)
      toast.success("Uploaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      {/* URL input */}
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or /hero-video.mp4"
          className="flex-1 font-mono text-xs"
        />
        {value && (
          <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Drop zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg transition-colors cursor-pointer",
          dragging ? "border-stone-500 bg-stone-50" : "border-stone-200 hover:border-stone-300"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {value && !uploading ? (
          <div className="relative rounded-md overflow-hidden bg-black">
            <video
              src={value}
              className="w-full max-h-40 object-contain"
              muted
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center" />
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center gap-2 text-stone-400">
            {uploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <p className="text-sm">Uploading video…</p>
              </>
            ) : (
              <>
                <Video className="h-6 w-6" />
                <p className="text-sm">Drop video or click to upload</p>
                <p className="text-xs text-stone-400">{UPLOAD_RULES.video.label}</p>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={UPLOAD_RULES.video.types.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) uploadFile(file)
        }}
      />
    </div>
  )
}
