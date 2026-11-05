// Server-only: these use BLOB_READ_WRITE_TOKEN, which never reaches the browser.
// The admin's Media Library calls them through /api/media; uploads go through /api/upload.
import { del, list } from "@vercel/blob"

/** Only files in this project's own Blob store may be deleted. */
export function isStoreUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === "https:" && u.hostname.endsWith(".public.blob.vercel-storage.com")
  } catch {
    return false
  }
}

export async function deleteBlob(url: string): Promise<void> {
  await del(url)
}

/** Every file in the store, newest first (list() returns at most 1000 per page). */
export async function listBlobs(prefix?: string) {
  const blobs = []
  let cursor: string | undefined
  do {
    const page = await list({ prefix, cursor, limit: 1000 })
    blobs.push(...page.blobs)
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)
  return blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))
}
