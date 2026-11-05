"use client"

import { upload } from "@vercel/blob/client"
import { UPLOAD_RULES, type UploadKind } from "./upload-rules"

const mb = (n: number) => `${Math.round(n / 1024 / 1024)} MB`

/**
 * Uploads a file from the admin straight to Vercel Blob (see app/api/upload/route.ts) and
 * returns its public URL. Throws an Error with a message fit to show the editor.
 */
export async function uploadToBlob(file: File, prefix: string, kind: UploadKind): Promise<string> {
  const rules = UPLOAD_RULES[kind]
  if (/\.(heic|heif)$/i.test(file.name) || /image\/hei[cf]/i.test(file.type)) {
    throw new Error("HEIC photos can't be shown in most browsers. Export the photo as JPEG and upload that.")
  }
  if (!(rules.types as readonly string[]).includes(file.type)) {
    throw new Error(`That file type isn't supported. Use ${rules.label}.`)
  }
  if (file.size > rules.maxBytes) {
    throw new Error(`That file is ${mb(file.size)}. The limit is ${mb(rules.maxBytes)}.`)
  }

  const safeName = file.name.replace(/\s+/g, "-").replace(/[^\w.\-]/g, "")
  try {
    const blob = await upload(`${prefix}/${Date.now()}-${safeName}`, file, {
      access: "public",
      handleUploadUrl: "/api/upload",
      contentType: file.type,
      multipart: file.size > 20 * 1024 * 1024,
    })
    return blob.url
  } catch (err) {
    console.error("[upload]", err)
    const msg = err instanceof Error ? err.message : ""
    throw new Error(/unauthorized|401/i.test(msg) ? "Your session has expired. Sign in again and retry." : `Upload failed${msg ? `: ${msg}` : ""}`)
  }
}
