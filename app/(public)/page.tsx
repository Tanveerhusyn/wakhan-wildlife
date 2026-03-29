import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import { asc } from "drizzle-orm"

import { SiteNavigation } from "@/components/site/navigation"
import { HeroSection } from "@/components/site/hero-section"
import { AboutSection } from "@/components/site/about-section"
import { StatisticsSection } from "@/components/site/statistics-section"
import { WildlifeSection } from "@/components/site/wildlife-section"
import { HorizontalGallery } from "@/components/site/horizontal-gallery"
import { CultureSection } from "@/components/site/culture-section"
import { ExpertSection } from "@/components/site/expert-section"
import { ItinerarySection } from "@/components/site/itinerary-section"
import { PricingSection } from "@/components/site/pricing-section"
import { ContactSection } from "@/components/site/contact-section"
import { SnowParticles } from "@/components/site/snow-particles"

export const revalidate = 60

async function fetchAllData() {
  try {
    return await Promise.all([
      db.select().from(schema.heroContent).limit(1).then((r) => r[0] ?? null),
      db.select().from(schema.aboutContent).limit(1).then((r) => r[0] ?? null),
      db.select().from(schema.statistics).orderBy(asc(schema.statistics.position)),
      db.select().from(schema.wildlife).orderBy(asc(schema.wildlife.displayOrder)),
      db.select().from(schema.gallery).orderBy(asc(schema.gallery.displayOrder)),
      db.select().from(schema.expertContent).limit(1).then((r) => r[0] ?? null),
      db.select().from(schema.itineraryDays).orderBy(asc(schema.itineraryDays.displayOrder)),
      db.select().from(schema.pricingTiers).orderBy(asc(schema.pricingTiers.displayOrder)),
      db.select().from(schema.pricingItems).orderBy(asc(schema.pricingItems.displayOrder)),
      db.select().from(schema.cultureContent).limit(1).then((r) => r[0] ?? null),
      db.select().from(schema.navigationItems).orderBy(asc(schema.navigationItems.displayOrder)),
      db.select().from(schema.siteSettings),
    ])
  } catch {
    // DB not yet configured — return empty data (run migrations + seed to populate)
    return [null, null, [], [], [], null, [], [], [], null, [], []] as const
  }
}

export default async function HomePage() {
  const [
    hero,
    about,
    stats,
    wildlifeItems,
    galleryItems,
    expert,
    itinerary,
    pricingTiers,
    pricingItems,
    culture,
    navItems,
    siteSettings,
  ] = await fetchAllData()

  const settings = Object.fromEntries((siteSettings as { key: string; value: string }[]).map((s) => [s.key, s.value]))

  return (
    <>
      <SnowParticles />
      <SiteNavigation items={navItems} />
      <main>
        <HeroSection data={hero} />
        <AboutSection data={about} />
        <StatisticsSection stats={stats} />
        <WildlifeSection animals={wildlifeItems} />
        <HorizontalGallery images={galleryItems} />
        <CultureSection data={culture} />
        <ExpertSection data={expert} />
        <ItinerarySection days={itinerary} />
        <PricingSection tiers={pricingTiers} items={pricingItems} />
        <ContactSection settings={settings} />
      </main>
    </>
  )
}
