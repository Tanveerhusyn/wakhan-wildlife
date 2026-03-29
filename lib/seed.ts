/**
 * Seed script — run once to populate the DB with current hardcoded content.
 * Usage: npx tsx lib/seed.ts
 */
import { drizzle } from "drizzle-orm/vercel-postgres"
import { sql } from "@vercel/postgres"
import * as schema from "./db/schema"

const db = drizzle(sql, { schema })

async function seed() {
  console.log("🌱 Seeding database...")

  // ─── Site Settings ───────────────────────────────────────────────────────
  await db
    .insert(schema.siteSettings)
    .values([
      { key: "site_name", value: "Wakhan Wildlife Tourism" },
      { key: "site_tagline", value: "Snow Leopard Expeditions" },
      {
        key: "meta_title",
        value: "Wakhan Wildlife Tourism | Snow Leopard Expeditions",
      },
      {
        key: "meta_description",
        value:
          "Exclusive Snow Leopard Photo Expeditions in the Heart of the Karakoram. Expert guides, 89% sighting rate, 10-day expeditions from Sost, Gilgit-Baltistan.",
      },
      { key: "contact_email", value: "info@wakhanwildlife.com" },
      { key: "contact_phone", value: "+92 300 123 4567" },
      { key: "contact_location", value: "Sost, Gilgit-Baltistan, Pakistan" },
      { key: "best_season", value: "March – April, November – December" },
      { key: "group_sizes", value: "Solo, pairs, or small groups (3–6)" },
    ])
    .onConflictDoNothing()
  console.log("✓ Site settings")

  // ─── Navigation ──────────────────────────────────────────────────────────
  await db
    .insert(schema.navigationItems)
    .values([
      { label: "About", href: "#about", displayOrder: 1 },
      { label: "Wildlife", href: "#wildlife", displayOrder: 2 },
      { label: "Culture", href: "#culture", displayOrder: 3 },
      { label: "Expedition", href: "#expedition", displayOrder: 4 },
      { label: "Itinerary", href: "#itinerary", displayOrder: 5 },
      { label: "Pricing", href: "#pricing", displayOrder: 6 },
      { label: "Contact", href: "#contact", displayOrder: 7 },
    ])
    .onConflictDoNothing()
  console.log("✓ Navigation")

  // ─── Hero ─────────────────────────────────────────────────────────────────
  const existingHero = await db.select().from(schema.heroContent).limit(1)
  if (existingHero.length === 0) {
    await db.insert(schema.heroContent).values({
      headingLine1: "Journey into the Realm",
      headingLine2: "of the Mountain Ghost",
      subheading: "Gilgit-Baltistan, Pakistan",
      description:
        "Exclusive Snow Leopard Photo Expeditions in the Heart of the Karakoram",
      locationLabel: "Gilgit-Baltistan, Pakistan",
      badge1Icon: "Mountain",
      badge1Label: "Since 2014",
      badge2Icon: "Camera",
      badge2Label: "Photo Expeditions",
      badge3Icon: "Users",
      badge3Label: "Indigenous Guides",
      videoUrl: "/hero-video.mp4",
      posterImageUrl: "/majestic-snow-leopard-sitting-on-rocky-mountain-le.jpg",
    })
  }
  console.log("✓ Hero")

  // ─── About ────────────────────────────────────────────────────────────────
  const existingAbout = await db.select().from(schema.aboutContent).limit(1)
  if (existingAbout.length === 0) {
    await db.insert(schema.aboutContent).values({
      eyebrow: "Since 2014",
      title: "Beyond a single sighting",
      paragraph1:
        "The Wakhan Corridor and surrounding Karakoram mountains form one of the last great wilderness frontiers. Here, above 4,000 metres, the snow leopard reigns — elusive, powerful, and rarely glimpsed by outsiders. We offer more than a wildlife tour. We offer immersion into a world few ever witness.",
      paragraph2:
        "Our expeditions are led by indigenous Wakhi guides with generational knowledge of these valleys. We follow the rhythms of the land, camp beneath star-filled skies, and wait with patience for the mountain ghost to reveal itself.",
      featureCards: [
        { icon: "Binoculars", label: "Expert Spotters" },
        { icon: "Compass", label: "Remote Valleys" },
        { icon: "Leaf", label: "Conservation" },
      ],
      imageUrl: "/dramatic-misty-mountain-valley-in-pakistan-with-sn.jpg",
    })
  }
  console.log("✓ About")

  // ─── Statistics ───────────────────────────────────────────────────────────
  await db
    .insert(schema.statistics)
    .values([
      { position: 1, endValue: 10, suffix: "+", label: "Years Active", sublabel: "Since 2014" },
      { position: 2, endValue: 89, suffix: "%", label: "Sighting Rate", sublabel: "Success probability" },
      { position: 3, endValue: 4500, suffix: "m", label: "Peak Altitude", sublabel: "Khunjerab Pass" },
      { position: 4, endValue: 50, suffix: "+", label: "Expeditions", sublabel: "Completed safely" },
    ])
    .onConflictDoNothing()
  console.log("✓ Statistics")

  // ─── Wildlife ─────────────────────────────────────────────────────────────
  const existingWildlife = await db.select().from(schema.wildlife).limit(1)
  if (existingWildlife.length === 0) {
    await db.insert(schema.wildlife).values([
      {
        displayOrder: 1,
        name: "Marco Polo Sheep",
        scientific: "Ovis ammon polii",
        description:
          "Named after the legendary explorer, these magnificent sheep roam the high plateaus in vast herds. Their enormous spiralling horns — among the largest of any sheep in the world — make them one of the most photogenic animals in the Karakoram.",
        imageUrl: "/marco-polo-sheep-with-large-curved-horns-on-mounta.jpg",
        statValue: "4,000m+",
        statLabel: "Altitude Range",
      },
      {
        displayOrder: 2,
        name: "Himalayan Ibex",
        scientific: "Capra sibirica hemalayanus",
        description:
          "Sure-footed masters of the cliffs, the Himalayan Ibex navigate near-vertical rock faces with astonishing ease. Males carry long, ridged horns that curve gracefully backward — a sight that never fails to draw gasps from first-time visitors.",
        imageUrl: "/himalayan-ibex-standing-on-rocky-cliff-edge--mount.jpg",
        statValue: "85kg",
        statLabel: "Average Weight",
      },
      {
        displayOrder: 3,
        name: "Golden Eagle",
        scientific: "Aquila chrysaetos",
        description:
          "Soaring above the peaks on wings that span over two metres, the Golden Eagle commands the thermals above our expedition zones. Watching one stoop at speed toward its prey is among the most electrifying wildlife moments possible.",
        imageUrl: "/golden-eagle-soaring-over-snow-capped-mountains--d.jpg",
        statValue: "2.3m",
        statLabel: "Wingspan",
      },
    ])
  }
  console.log("✓ Wildlife")

  // ─── Gallery ──────────────────────────────────────────────────────────────
  const existingGallery = await db.select().from(schema.gallery).limit(1)
  if (existingGallery.length === 0) {
    await db.insert(schema.gallery).values([
      {
        displayOrder: 1,
        src: "/snow-leopard-stalking-on-rocky-mountain-cliff-at-g.jpg",
        caption: "A snow leopard surveys its territory at dusk",
        location: "Khunjerab National Park",
      },
      {
        displayOrder: 2,
        src: "/marco-polo-sheep-herd-with-large-curved-horns-on-m.jpg",
        caption: "Marco Polo Sheep herd on the high plateau",
        location: "Wakhan Corridor, 4,200m",
      },
      {
        displayOrder: 3,
        src: "/local-mountain-guide-with-binoculars-scanning-snow.jpg",
        caption: "Hussain scanning the valley at first light",
        location: "Shimshal Valley",
      },
      {
        displayOrder: 4,
        src: "/turquoise-glacial-lake-reflecting-snow-capped-kara.jpg",
        caption: "Glacial lake reflecting the Karakoram peaks",
        location: "Near Khunjerab Pass",
      },
      {
        displayOrder: 5,
        src: "/golden-eagle-soaring-through-dramatic-mountain-mis.jpg",
        caption: "Golden Eagle soaring through the mist",
        location: "Above Shimshal, 3,800m",
      },
      {
        displayOrder: 6,
        src: "/himalayan-ibex-standing-on-steep-rocky-cliff-with-.jpg",
        caption: "Himalayan Ibex on the cliff edge",
        location: "Khunjerab Valley",
      },
    ])
  }
  console.log("✓ Gallery")

  // ─── Expert ───────────────────────────────────────────────────────────────
  const existingExpert = await db.select().from(schema.expertContent).limit(1)
  if (existingExpert.length === 0) {
    await db.insert(schema.expertContent).values({
      name: "Hussain Ali Khan",
      title: "Lead Snow Leopard Expert",
      bioParagraph1:
        "Born and raised in the Wakhan Corridor, Hussain has spent over a decade studying snow leopard movement patterns across the Karakoram and Hindu Kush ranges. His work with the Wildlife Conservation Society in Afghanistan gave him unparalleled insight into the behaviour and habitat of Panthera uncia.",
      bioParagraph2:
        "His network of over 40 local scouts across the valleys means that our expeditions benefit from real-time intelligence about snow leopard and prey animal sightings — giving us the highest verified sighting rate of any operator in the region.",
      imageUrl: "/wildlife-expert-guide-with-binoculars-silhouette-a.jpg",
      quote:
        "The snow leopard doesn't reveal itself to those who search. It appears to those who understand.",
      quoteAttribution: "Wakhi Proverb",
      credentials: [
        {
          icon: "Award",
          label: "Wildlife Conservation Society",
          value: "7+ Years",
          desc: "Afghanistan field work",
        },
        {
          icon: "Radio",
          label: "National Geographic Wild",
          value: "3 Projects",
          desc: "GPS collaring expeditions",
        },
        {
          icon: "Map",
          label: "Territory Knowledge",
          value: "Indigenous",
          desc: "Generational expertise",
        },
        {
          icon: "Users",
          label: "Network",
          value: "40+ Scouts",
          desc: "Valley monitoring team",
        },
      ],
    })
  }
  console.log("✓ Expert")

  // ─── Itinerary ────────────────────────────────────────────────────────────
  const existingItinerary = await db.select().from(schema.itineraryDays).limit(1)
  if (existingItinerary.length === 0) {
    await db.insert(schema.itineraryDays).values([
      {
        displayOrder: 1,
        dayLabel: "01",
        dateLabel: "17 March",
        title: "Arrival & Scenic Drive",
        location: "Skardu to Sost",
        duration: "7 hours",
        description:
          "Your adventure begins as we pick you up from Skardu Airport and drive north along the Karakoram Highway. The journey itself is spectacular — the Indus River carves through towering canyon walls before the landscape opens into the broad Hunza Valley. We stop for lunch in Karimabad with views of Rakaposhi, then continue to our base in Sost.",
        imageUrl: "/scenic-mountain-road-winding-through-karakoram-hig.jpg",
        iconName: "Plane",
        isHighlight: false,
      },
      {
        displayOrder: 2,
        dayLabel: "02",
        dateLabel: "18 March",
        title: "Acclimatisation & Briefing",
        location: "Sost & Environs",
        duration: "Full day",
        description:
          "A gentle day to acclimatise to altitude (2,750m) and absorb the rhythms of the Wakhi village. Morning wildlife briefing with Hussain: snow leopard behaviour, territory markers, prey species. Afternoon walk along the Khunjerab River, looking for Golden Eagle, Himalayan Griffon and early signs of prey animal activity.",
        imageUrl: "/traditional-wakhi-village-stone-houses-mountains-p.jpg",
        iconName: "Mountain",
        isHighlight: false,
      },
      {
        displayOrder: 3,
        dayLabel: "03–07",
        dateLabel: "19–23 March",
        title: "Snow Leopard Search",
        location: "Khunjerab National Park",
        duration: "5 days",
        description:
          "The heart of the expedition. Each day we depart before dawn for different vantage points selected by Hussain and his scout network based on the previous day's intelligence. We use spotting scopes and telephoto lenses to scan cliff faces and ridge lines. The leopards are most active at dawn and dusk — we are always in position for the light.",
        imageUrl: "/wildlife-photographers-with-telephoto-lenses-scann.jpg",
        iconName: "Camera",
        isHighlight: true,
      },
      {
        displayOrder: 4,
        dayLabel: "08",
        dateLabel: "24 March",
        title: "Final Search Day",
        location: "Shimshal Valley",
        duration: "Full day",
        description:
          "A final intensive search day in the Shimshal Valley, one of the most reliably productive areas for snow leopard sightings in late March. We position at multiple vantage points and make use of the full scout network.",
        imageUrl: "/snow-leopard-habitat-rocky-cliffs-snow-patches-daw.jpg",
        iconName: "Search",
        isHighlight: false,
      },
      {
        displayOrder: 5,
        dayLabel: "09",
        dateLabel: "25 March",
        title: "Return Drive",
        location: "Sost to Gilgit",
        duration: "6 hours",
        description:
          "We depart Sost for the drive south to Gilgit, with a final stop at the Attabad Lake — a turquoise expanse formed by the 2010 landslide, now one of the most photographed landscapes in Pakistan. Evening in Gilgit with a group debrief dinner.",
        imageUrl: "/mountain-valley-road-sunset-karakoram-range-panora.jpg",
        iconName: "MapPin",
        isHighlight: false,
      },
      {
        displayOrder: 6,
        dayLabel: "10",
        dateLabel: "26 March",
        title: "Departure",
        location: "Gilgit Airport",
        duration: "Half day",
        description:
          "Transfer to Gilgit Airport for your onward flights. Our team will assist with luggage and ensure you reach the airport in time for your connection to Islamabad.",
        imageUrl: "/small-aircraft-on-mountain-airstrip-sunrise-dramat.jpg",
        iconName: "Plane",
        isHighlight: false,
      },
    ])
  }
  console.log("✓ Itinerary")

  // ─── Pricing ──────────────────────────────────────────────────────────────
  const existingPricing = await db.select().from(schema.pricingTiers).limit(1)
  if (existingPricing.length === 0) {
    await db.insert(schema.pricingTiers).values([
      { displayOrder: 1, personsLabel: "Solo", price: "$7,000", note: "per expedition" },
      { displayOrder: 2, personsLabel: "Two", price: "$3,700", note: "per person" },
      { displayOrder: 3, personsLabel: "Group 3+", price: "$3,300", note: "per person" },
    ])
    await db.insert(schema.pricingItems).values([
      { type: "included", displayOrder: 1, text: "All ground transport from Skardu" },
      { type: "included", displayOrder: 2, text: "Daily trips to Khunjerab National Park" },
      { type: "included", displayOrder: 3, text: "Full board accommodation (guesthouse & camping)" },
      { type: "included", displayOrder: 4, text: "Lead guide Hussain Ali Khan" },
      { type: "included", displayOrder: 5, text: "Scout network access (40+ monitors)" },
      { type: "included", displayOrder: 6, text: "Photography equipment support" },
      { type: "included", displayOrder: 7, text: "National Park entry permits" },
      { type: "excluded", displayOrder: 1, text: "International & domestic flights" },
      { type: "excluded", displayOrder: 2, text: "Personal travel insurance" },
      { type: "excluded", displayOrder: 3, text: "Guide & porter gratuities" },
      { type: "excluded", displayOrder: 4, text: "Personal expenses & souvenirs" },
    ])
  }
  console.log("✓ Pricing")

  // ─── Culture ──────────────────────────────────────────────────────────────
  const existingCulture = await db.select().from(schema.cultureContent).limit(1)
  if (existingCulture.length === 0) {
    await db.insert(schema.cultureContent).values({
      eyebrow: "The Wakhi People",
      titleLine1: "Guardians of",
      titleLine2: "the Mountains",
      paragraph1:
        "The Wakhi people have inhabited the high valleys of the Karakoram and Hindu Kush for centuries. Descended from ancient Silk Road traders and mountain herders, they have developed a culture uniquely adapted to life above 3,000 metres — one that prizes endurance, hospitality, and deep ecological knowledge.",
      paragraph2:
        "Our expeditions are built on genuine partnership with Wakhi families in Sost and Shimshal. Staying in family guesthouses, sharing meals prepared from local ingredients, and learning from guides who grew up tracking these mountains is not an add-on to the expedition — it is the expedition.",
      imageUrl: "/wakhi-people-in-traditional-clothing-in-mountain-v.jpg",
      culturePoints: [
        { label: "Language", value: "Wakhi (Khik)" },
        { label: "Heritage", value: "Silk Road lineage" },
        { label: "Philosophy", value: "Stewardship of land" },
        { label: "Hospitality", value: "Central to identity" },
      ],
    })
  }
  console.log("✓ Culture")

  console.log("\n✅ Seeding complete.")
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
