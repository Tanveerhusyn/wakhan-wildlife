"use client"

import { useEffect, useState } from "react"
import { ImageUploader } from "@/components/admin/image-uploader"
import { Button } from "@/components/ui/button"
import { Copy, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface BlobItem {
  url: string
  pathname: string
  size: number
  uploadedAt: Date
}

export default function MediaPage() {
  const [blobs, setBlobs] = useState<BlobItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [uploadUrl, setUploadUrl] = useState("")
  const [error, setError] = useState("")

  async function loadBlobs() {
    try {
      const res = await fetch("/api/media", { cache: "no-store" })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Could not load the media library")
      setBlobs(await res.json())
      setError("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the media library")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadBlobs() }, [])

  async function handleDelete(blob: BlobItem) {
    const name = blob.pathname.split("/").pop()
    if (!window.confirm(`Delete ${name}? If the site still uses this file, that picture will disappear from the site. This can't be undone.`)) return
    setDeleting(blob.url)
    try {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: blob.url }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Failed to delete")
      setBlobs((prev) => prev.filter((b) => b.url !== blob.url))
      toast.success("Deleted")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete")
    } finally {
      setDeleting(null)
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    toast.success("URL copied")
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Media Library</h1>
        <p className="mt-1 text-sm text-stone-500">All uploaded photos and videos stored in Vercel Blob{blobs.length ? ` (${blobs.length})` : ""}.</p>
      </div>

      {/* Uploader */}
      <div className="bg-white rounded-lg border border-stone-200 p-5 max-w-sm">
        <p className="text-sm font-medium text-stone-700 mb-3">Upload New File</p>
        <ImageUploader
          label=""
          value={uploadUrl}
          onChange={(url) => {
            setUploadUrl(url)
            loadBlobs()
          }}
          prefix="media"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center gap-2 text-stone-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading media…</span>
        </div>
      ) : error ? (
        <p className="text-red-600 text-sm">{error}</p>
      ) : blobs.length === 0 ? (
        <p className="text-stone-400 text-sm">No files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {blobs.map((blob) => (
            <div key={blob.url} className="group relative bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
              {/\.(mp4|webm|mov)$/i.test(blob.pathname) ? (
                <video src={blob.url} muted playsInline preload="metadata" className="w-full aspect-square object-cover bg-black" />
              ) : /\.(heic|heif)$/i.test(blob.pathname) ? (
                <div className="w-full aspect-square flex items-center justify-center text-xs text-stone-500 text-center p-3">HEIC: browsers can't show this file</div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                // Thumbnails go through the image optimiser: the originals run to several MB each.
                <img
                  src={/\.gif$/i.test(blob.pathname) ? blob.url : `/_next/image?url=${encodeURIComponent(blob.url)}&w=384&q=70`}
                  alt={blob.pathname}
                  loading="lazy"
                  className="w-full aspect-square object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
                <Button size="icon" variant="secondary" className="h-7 w-7" onClick={() => copyUrl(blob.url)}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-7 w-7"
                  onClick={() => handleDelete(blob)}
                  disabled={deleting === blob.url}
                >
                  {deleting === blob.url ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <div className="px-2 py-1.5">
                <p className="text-xs text-stone-500 truncate">{blob.pathname.split("/").pop()}</p>
                <p className="text-xs text-stone-400">{blob.size > 1048576 ? `${(blob.size / 1048576).toFixed(1)} MB` : `${(blob.size / 1024).toFixed(0)} KB`}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
