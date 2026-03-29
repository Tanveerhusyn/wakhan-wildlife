import { put, del, list } from "@vercel/blob"

export async function uploadBlob(
  file: File,
  prefix: string
): Promise<string> {
  const filename = `${prefix}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`
  const blob = await put(filename, file, { access: "public" })
  return blob.url
}

export async function deleteBlob(url: string): Promise<void> {
  await del(url)
}

export async function listBlobs(prefix?: string) {
  const result = await list({ prefix })
  return result.blobs
}
