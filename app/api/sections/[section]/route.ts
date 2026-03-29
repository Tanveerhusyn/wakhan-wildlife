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

async function putSection(section: SectionKey, body: unknown) {
  switch (section) {
    case "hero": {
      const data = body as typeof schema.heroContent.$inferInsert
      const existing = await db.select().from(schema.heroContent).limit(1)
      if (existing.length > 0) {
        await db.update(schema.heroContent).set({ ...data, updatedAt: new Date() }).where(eq(schema.heroContent.id, existing[0].id))
      } else {
        await db.insert(schema.heroContent).values(data)
      }
      break
    }
    case "about": {
      const data = body as typeof schema.aboutContent.$inferInsert
      const existing = await db.select().from(schema.aboutContent).limit(1)
      if (existing.length > 0) {
        await db.update(schema.aboutContent).set({ ...data, updatedAt: new Date() }).where(eq(schema.aboutContent.id, existing[0].id))
      } else {
        await db.insert(schema.aboutContent).values(data)
      }
      break
    }
    case "statistics": {
      const rows = body as (typeof schema.statistics.$inferInsert)[]
      for (const row of rows) {
        const existing = await db.select().from(schema.statistics).where(eq(schema.statistics.position, row.position!))
        if (existing.length > 0) {
          await db.update(schema.statistics).set({ ...row, updatedAt: new Date() }).where(eq(schema.statistics.id, existing[0].id))
        } else {
          await db.insert(schema.statistics).values(row)
        }
      }
      break
    }
    case "wildlife": {
      const rows = body as (typeof schema.wildlife.$inferInsert)[]
      await db.delete(schema.wildlife)
      if (rows.length > 0) await db.insert(schema.wildlife).values(rows)
      break
    }
    case "gallery": {
      const rows = body as (typeof schema.gallery.$inferInsert)[]
      await db.delete(schema.gallery)
      if (rows.length > 0) await db.insert(schema.gallery).values(rows)
      break
    }
    case "expert": {
      const data = body as typeof schema.expertContent.$inferInsert
      const existing = await db.select().from(schema.expertContent).limit(1)
      if (existing.length > 0) {
        await db.update(schema.expertContent).set({ ...data, updatedAt: new Date() }).where(eq(schema.expertContent.id, existing[0].id))
      } else {
        await db.insert(schema.expertContent).values(data)
      }
      break
    }
    case "itinerary": {
      const rows = body as (typeof schema.itineraryDays.$inferInsert)[]
      await db.delete(schema.itineraryDays)
      if (rows.length > 0) await db.insert(schema.itineraryDays).values(rows)
      break
    }
    case "pricing": {
      const { tiers, items } = body as {
        tiers: (typeof schema.pricingTiers.$inferInsert)[]
        items: (typeof schema.pricingItems.$inferInsert)[]
      }
      await db.delete(schema.pricingTiers)
      await db.delete(schema.pricingItems)
      if (tiers.length > 0) await db.insert(schema.pricingTiers).values(tiers)
      if (items.length > 0) await db.insert(schema.pricingItems).values(items)
      break
    }
    case "culture": {
      const data = body as typeof schema.cultureContent.$inferInsert
      const existing = await db.select().from(schema.cultureContent).limit(1)
      if (existing.length > 0) {
        await db.update(schema.cultureContent).set({ ...data, updatedAt: new Date() }).where(eq(schema.cultureContent.id, existing[0].id))
      } else {
        await db.insert(schema.cultureContent).values(data)
      }
      break
    }
    case "site-settings": {
      const settings = body as { key: string; value: string }[]
      for (const s of settings) {
        await db
          .insert(schema.siteSettings)
          .values(s)
          .onConflictDoUpdate({ target: schema.siteSettings.key, set: { value: s.value, updatedAt: new Date() } })
      }
      break
    }
    case "navigation": {
      const rows = body as (typeof schema.navigationItems.$inferInsert)[]
      await db.delete(schema.navigationItems)
      if (rows.length > 0) await db.insert(schema.navigationItems).values(rows)
      break
    }
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
  const body = await req.json()

  await putSection(section as SectionKey, body)
  revalidatePath("/")

  return NextResponse.json({ success: true })
}
