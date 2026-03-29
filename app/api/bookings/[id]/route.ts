import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db, bookings } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const { status } = await req.json()

  if (!["new", "read", "archived"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  await db
    .update(bookings)
    .set({ status, updatedAt: new Date() })
    .where(eq(bookings.id, parseInt(id)))

  return NextResponse.json({ success: true })
}
