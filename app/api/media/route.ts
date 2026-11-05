import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { deleteBlob, isStoreUrl, listBlobs } from "@/lib/blob"

export const dynamic = "force-dynamic"

/** The Media Library's file list. */
export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const blobs = await listBlobs()
    return NextResponse.json(
      blobs.map((b) => ({ url: b.url, pathname: b.pathname, size: b.size, uploadedAt: b.uploadedAt })),
    )
  } catch (err) {
    console.error("[media] listing failed", err)
    return NextResponse.json({ error: "Could not load the media library" }, { status: 500 })
  }
}

/** Deletes one file: body { url }. */
export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { url } = (await req.json().catch(() => ({}))) as { url?: string }
  if (!url || !isStoreUrl(url)) return NextResponse.json({ error: "Not a file in this media library" }, { status: 400 })
  try {
    await deleteBlob(url)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[media] delete failed", err)
    return NextResponse.json({ error: "Could not delete the file" }, { status: 500 })
  }
}
