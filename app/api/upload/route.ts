import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadBlob } from "@/lib/blob"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  const prefix = (formData.get("prefix") as string) || "uploads"

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const url = await uploadBlob(file, prefix)
  return NextResponse.json({ url })
}
