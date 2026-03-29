import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db, bookings } from "@/lib/db"
import { eq, desc } from "drizzle-orm"
import { z } from "zod"

const bookingSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  groupSize: z.string().optional(),
  preferredDates: z.string().optional(),
  message: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = bookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  await db.insert(bookings).values({
    ...parsed.data,
    status: "new",
  })

  return NextResponse.json({ success: true })
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")

  const rows = status
    ? await db
        .select()
        .from(bookings)
        .where(eq(bookings.status, status))
        .orderBy(desc(bookings.submittedAt))
    : await db.select().from(bookings).orderBy(desc(bookings.submittedAt))

  return NextResponse.json(rows)
}
