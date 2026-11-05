import { NextRequest, NextResponse } from "next/server"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { auth } from "@/lib/auth"
import { UPLOAD_RULES } from "@/lib/upload-rules"

/*
 * Client uploads: the browser asks this route for a short-lived upload token, then sends the
 * file straight to Vercel Blob. The file never passes through this function, so the 4.5 MB
 * request-body limit of Vercel Functions does not apply (large photos and videos work).
 */
export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  let body: HandleUploadBody
  try {
    body = (await req.json()) as HandleUploadBody
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  // Only a signed-in admin can get an upload token. (Blob's own "upload completed" callback
  // is signed by Vercel and checked inside handleUpload.)
  if (body.type === "blob.generate-client-token") {
    const session = await auth()
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [...UPLOAD_RULES.image.types, ...UPLOAD_RULES.video.types],
        maximumSizeInBytes: UPLOAD_RULES.video.maxBytes,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {},
    })
    return NextResponse.json(result)
  } catch (err) {
    console.error("[upload] token request failed", err)
    return NextResponse.json({ error: err instanceof Error ? err.message : "Upload failed" }, { status: 400 })
  }
}
