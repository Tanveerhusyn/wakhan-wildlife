import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { asc, eq } from "drizzle-orm"

type SectionKey =
  | "hero"
  | "about"
  | "statistics"
  | "wildlife"
  | "gallery"
  | "expert"
  | "itinerary"
  | "pricing"
  | "culture"
  | "site-settings"
  | "navigation"

async function getSection(section: SectionKey) {
  switch (section) {
    case "hero":
      return db.select().from(schema.heroContent).limit(1).then((r) => r[0] ?? null)
    case "about":
      return db.select().from(schema.aboutContent).limit(1).then((r) => r[0] ?? null)
    case "statistics":
      return db.select().from(schema.statistics).orderBy(asc(schema.statistics.position))
    case "wildlife":
      return db.select().from(schema.wildlife).orderBy(asc(schema.wildlife.displayOrder))
    case "gallery":
      return db.select().from(schema.gallery).orderBy(asc(schema.gallery.displayOrder))
    case "expert":
      return db.select().from(schema.expertContent).limit(1).then((r) => r[0] ?? null)
    case "itinerary":
      return db.select().from(schema.itineraryDays).orderBy(asc(schema.itineraryDays.displayOrder))
    case "pricing":
      return {
        tiers: await db.select().from(schema.pricingTiers).orderBy(asc(schema.pricingTiers.displayOrder)),
        items: await db.select().from(schema.pricingItems).orderBy(asc(schema.pricingItems.displayOrder)),
      }
    case "culture":
      return db.select().from(schema.cultureContent).limit(1).then((r) => r[0] ?? null)
    case "site-settings":
      return db.select().from(schema.siteSettings)
    case "navigation":
      return db.select().from(schema.navigationItems).orderBy(asc(schema.navigationItems.displayOrder))
    default:
      return null
  }
}

/**
 * The editors send back the rows exactly as GET returned them, so every row carries id and
 * updatedAt (as an ISO string, which the timestamp column rejects). Those are the database's
 * to manage: drop them and let the database assign ids and defaults.
 */
const SERVER_FIELDS = ["id", "createdAt", "updatedAt", "submittedAt"]

function clean<T>(row: unknown): T {
  if (!row || typeof row !== "object" || Array.isArray(row)) throw new BadRequest("Expected an object")
  const out = { ...(row as Record<string, unknown>) }
  for (const k of SERVER_FIELDS) delete out[k]
  return out as T
}

function cleanList<T>(rows: unknown): T[] {
  if (!Array.isArray(rows)) throw new BadRequest("Expected a list")
  return rows.map((r) => clean<T>(r))
}

class BadRequest extends Error {}

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

// Every save runs in one transaction: a list is replaced by deleting the old rows and
// inserting the new ones, and if anything fails the delete is rolled back with it.
async function putSection(tx: Tx, section: SectionKey, body: unknown) {
  switch (section) {
    case "hero": {
      const data = clean<typeof schema.heroContent.$inferInsert>(body)
      const existing = await tx.select().from(schema.heroContent).limit(1)
      if (existing.length > 0) {
        await tx.update(schema.heroContent).set({ ...data, updatedAt: new Date() }).where(eq(schema.heroContent.id, existing[0].id))
      } else {
        await tx.insert(schema.heroContent).values(data)
      }
      break
    }
    case "about": {
      const data = clean<typeof schema.aboutContent.$inferInsert>(body)
      const existing = await tx.select().from(schema.aboutContent).limit(1)
      if (existing.length > 0) {
        await tx.update(schema.aboutContent).set({ ...data, updatedAt: new Date() }).where(eq(schema.aboutContent.id, existing[0].id))
      } else {
        await tx.insert(schema.aboutContent).values(data)
      }
      break
    }
    case "statistics": {
      const rows = cleanList<typeof schema.statistics.$inferInsert>(body)
      for (const row of rows) {
        const existing = await tx.select().from(schema.statistics).where(eq(schema.statistics.position, row.position!))
        if (existing.length > 0) {
          await tx.update(schema.statistics).set({ ...row, updatedAt: new Date() }).where(eq(schema.statistics.id, existing[0].id))
        } else {
          await tx.insert(schema.statistics).values(row)
        }
      }
      break
    }
    case "wildlife": {
      const rows = cleanList<typeof schema.wildlife.$inferInsert>(body)
      await tx.delete(schema.wildlife)
      if (rows.length > 0) await tx.insert(schema.wildlife).values(rows)
      break
    }
    case "gallery": {
      const rows = cleanList<typeof schema.gallery.$inferInsert>(body)
      await tx.delete(schema.gallery)
      if (rows.length > 0) await tx.insert(schema.gallery).values(rows)
      break
    }
    case "expert": {
      const data = clean<typeof schema.expertContent.$inferInsert>(body)
      const existing = await tx.select().from(schema.expertContent).limit(1)
      if (existing.length > 0) {
        await tx.update(schema.expertContent).set({ ...data, updatedAt: new Date() }).where(eq(schema.expertContent.id, existing[0].id))
      } else {
        await tx.insert(schema.expertContent).values(data)
      }
      break
    }
    case "itinerary": {
      const rows = cleanList<typeof schema.itineraryDays.$inferInsert>(body)
      await tx.delete(schema.itineraryDays)
      if (rows.length > 0) await tx.insert(schema.itineraryDays).values(rows)
      break
    }
    case "pricing": {
      if (!body || typeof body !== "object") throw new BadRequest("Expected tiers and items")
      const { tiers, items } = body as { tiers: unknown; items: unknown }
      const tierRows = cleanList<typeof schema.pricingTiers.$inferInsert>(tiers)
      const itemRows = cleanList<typeof schema.pricingItems.$inferInsert>(items)
      await tx.delete(schema.pricingTiers)
      await tx.delete(schema.pricingItems)
      if (tierRows.length > 0) await tx.insert(schema.pricingTiers).values(tierRows)
      if (itemRows.length > 0) await tx.insert(schema.pricingItems).values(itemRows)
      break
    }
    case "culture": {
      const data = clean<typeof schema.cultureContent.$inferInsert>(body)
      const existing = await tx.select().from(schema.cultureContent).limit(1)
      if (existing.length > 0) {
        await tx.update(schema.cultureContent).set({ ...data, updatedAt: new Date() }).where(eq(schema.cultureContent.id, existing[0].id))
      } else {
        await tx.insert(schema.cultureContent).values(data)
      }
      break
    }
    case "site-settings": {
      const settings = cleanList<{ key: string; value: string }>(body)
      for (const s of settings) {
        await tx
          .insert(schema.siteSettings)
          .values({ key: s.key, value: s.value })
          .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value: s.value, updatedAt: new Date() } })
      }
      break
    }
    case "navigation": {
      const rows = cleanList<typeof schema.navigationItems.$inferInsert>(body)
      await tx.delete(schema.navigationItems)
      if (rows.length > 0) await tx.insert(schema.navigationItems).values(rows)
      break
    }
    default:
      throw new BadRequest("Unknown section")
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params
  const data = await getSection(section as SectionKey)
  if (data === null) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 })
  }
  return NextResponse.json(data)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { section } = await params
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  try {
    await db.transaction((tx) => putSection(tx, section as SectionKey, body))
  } catch (err) {
    if (err instanceof BadRequest) return NextResponse.json({ error: err.message }, { status: 400 })
    console.error(`[sections] saving "${section}" failed, nothing was changed`, err)
    return NextResponse.json({ error: "Save failed, nothing was changed" }, { status: 500 })
  }

  revalidatePath("/")
  revalidatePath("/privacy")

  return NextResponse.json({ success: true })
}
