import { asc } from "drizzle-orm"
import { db } from "@/lib/db"
import * as schema from "@/lib/db/schema"
import type { Photo } from "./img"

/**
 * Everything the public site shows, read from Postgres (the admin CMS) with fallbacks.
 *
 * Lists the admin manages (wildlife, itinerary, pricing, the guide, contact details) come from
 * the database; when a table is empty the site falls back to the client's own photographs and
 * the content the site was seeded with, so no section ever renders empty.
 */

const BLOB = "https://zf6k5u6jjilzs2jr.public.blob.vercel-storage.com"

/** The client's own photographs in Vercel Blob, chosen for the page's fixed slots. */
export const PHOTOS = {
  hero: {
    src: `${BLOB}/gallery/1778537051737-IMG_7416.JPG-zKzKSnZ1802tOFuPmPI2J00etg5xB9.jpeg`,
    width: 3334, height: 3110, subject: "snow-leopard",
    alt: "Two snow leopards on a snowy ridge in the Khunjerab conservancy",
    pos: "30% 45%",
  },
  campfire: {
    src: `${BLOB}/gallery/1778592302118-snow-leopard-guests-campfire-karakoram.jpg-aJlIzpQSyCV6aiqRQdqIghhfPqkas4.jpg`,
    width: 4032, height: 3024, subject: "guests",
    alt: "Expedition guests and guides around a campfire in a Karakoram valley",
    pos: "50% 50%",
  },
  trek: {
    src: `${BLOB}/wildlife/IMG_7120-3kxYe7PKZmDAkSW7AwvrAPqM0pIIcD.webp`,
    width: 4032, height: 3024, subject: "tracking-team",
    alt: "Guides with packs walking a snow-covered valley floor",
    pos: "40% 60%",
  },
  lying: {
    src: `${BLOB}/gallery/1792322834097-Snowlepoard-sighting-01-FZhom5fcHzZlI1pbMsJm2x2lbyCWHl.jpg`,
    width: 3024, height: 4032, subject: "tracking-team",
    alt: "Two photographers lying in the snow, watching the slopes above",
    pos: "50% 80%",
  },
  yak: {
    src: `${BLOB}/gallery/1792323601081-yak-trek-snow-leopard-expedition-khunjerav-conservation-area-wakhan.jpg-10eqt9rfgIGYAx0dBvhwOJqvsRWFhQ.jpg`,
    width: 3024, height: 4032, subject: "yak-trek",
    alt: "A yak caravan carrying the expedition's kit up a mountain path",
    pos: "50% 55%",
  },
  guide: {
    src: `${BLOB}/wildlife/hussain_ali-XkdAVoLCRlM3MzfLw2qSxGyAVKJMK0.webp`,
    width: 960, height: 639, subject: "guide",
    alt: "Hussain Ali Khan",
    pos: "55% 40%",
  },
  heroPoster: {
    src: "/hero-poster.jpg",
    width: 1920, height: 1080, subject: "snow-leopard",
    alt: "A snow leopard resting on a rock ledge", pos: "50% 40%",
  },
  valley: {
    src: `${BLOB}/wildlife/IMG_6011-K7ZlAwnUbq5Oyvu4dEPdTNAm5u9VsJ.webp`,
    width: 3152, height: 2233, subject: "landscape",
    alt: "A braided river running through a wide Karakoram valley", pos: "50% 55%",
  },
  cliff: {
    src: `${BLOB}/wildlife/IMG_6017-UXtKUsoEhPBZyOzXcAzY5prZXJrjVK.webp`,
    width: 3703, height: 2435, subject: "snow-leopard",
    alt: "A snow leopard on a cliff high above a river valley", pos: "30% 60%",
  },
  cubsCave: {
    src: `${BLOB}/gallery/1778536759726-IMG_3793.JPG-l4PYdZaHFF586RCohDrPqZzOgVtKjj.jpeg`,
    width: 2104, height: 1854, subject: "snow-leopard",
    alt: "A snow leopard mother and cubs sheltering under a rock", pos: "50% 60%",
  },
  cubsRock: {
    src: `${BLOB}/gallery/1792302259896-DSCN7321-QKLLzp8MrIPIqZ3KxG3ySOMUvapCa7.JPG`,
    width: 4608, height: 3456, subject: "snow-leopard",
    alt: "Snow leopard cubs curled together on grey rock", pos: "50% 50%",
  },
  ridge: {
    src: `${BLOB}/gallery/1778541433768-WhatsApp-Image-2026-05-11-at-3.53.38-PM-HyeoRN32cdG2CmbTsyx1ZN4DWxpFj0.jpeg`,
    width: 1440, height: 1268, subject: "snow-leopard",
    alt: "Two snow leopards on a snowy ridge", pos: "45% 60%",
  },
  portraitBw: {
    src: `${BLOB}/gallery/1778540142225-WhatsApp-Image-2026-05-11-at-3.53.39-PM-%282%29-dXgOzwe6XOeTlKDFzXvzRNZV0gidPP.jpeg`,
    width: 1152, height: 864, subject: "snow-leopard",
    alt: "A black and white portrait of a snow leopard", pos: "50% 40%",
  },
  scopes: {
    src: `${BLOB}/itinerary/1777402305067-snowleopardsightingexpaditionIMG_9066-yyrdBa0xLhoAsNXbBFYjdbgp2loXPD.jpg`,
    width: 1500, height: 1125, subject: "guests",
    alt: "Guests behind telescopes and long lenses on a valley floor", pos: "40% 50%",
  },
  // the nav panel's cards (photographs not used elsewhere on the page)
  navCubs: {
    src: `${BLOB}/gallery/1792324195650-snow-leopard-family-cubs-den-khunjerav-conservation-area-wakhan.jpg-7tpZLU2nvGkMACQrINghmiU69PCNAF.jpeg`,
    width: 1873, height: 1092, subject: "snow-leopard",
    alt: "Snow leopard cubs in their den", pos: "50% 60%",
  },
  navIbex: {
    src: `${BLOB}/wildlife/DSCN9078-1-SpNAoZ6259NPjjijyMW0LdWt4Cos7o.webp`,
    width: 3431, height: 3456, subject: "ibex",
    alt: "A young ibex on a rock against a blue sky", pos: "50% 40%",
  },
  navBear: {
    src: `${BLOB}/gallery/1778536155575-brown-bear-sighting-KVO-wakhan-wild-life-9aIWMhmOG2Njgrxq4TVzJRINNjhCU9.jpeg`,
    width: 868, height: 960, subject: "brown-bear",
    alt: "A brown bear cub sitting in green grass", pos: "50% 45%",
  },
  navVulture: {
    src: `${BLOB}/wildlife/1778513273537-Himalayan-Griffon-Vulture-65zW1a1saEENTKInwXtJAKagL3dVBw.jpeg`,
    width: 1078, height: 1078, subject: "vulture",
    alt: "A vulture in flight over a mountain slope", pos: "50% 35%",
  },
} satisfies Record<string, Photo>

export type Animal = { name: string; scientific: string; photo: Photo; description?: string; stat?: string }

const FALLBACK_ANIMALS: Animal[] = [
  { name: "Snow leopard", scientific: "Panthera uncia", photo: { src: `${BLOB}/gallery/1792303578131-1000199111-BROyCFFkC1PCN2CjiRmCh667M7AxOk.jpg`, width: 1268, height: 1171, subject: "snow-leopard", alt: "A snow leopard on a snowy rock", pos: "45% 50%" } },
  { name: "Himalayan ibex", scientific: "Capra sibirica", photo: { src: `${BLOB}/wildlife/1778513799942-Himalyan-Ibex-hKjv0M6GbOrMPLkYA4zz3cdopYY2T3.jpeg`, width: 1920, height: 1280, subject: "ibex", alt: "A Himalayan ibex and its young in dry grass", pos: "40% 50%" } },
  { name: "Marco Polo sheep", scientific: "Ovis ammon polii", photo: { src: `${BLOB}/wildlife/1778502771202-marco-polo-sheep-KVO-Coservency-2qap4v8jubg6rhg55x4pog-Iwmb4UICrWGUuQ2JXwQzCWaiOLENXB.jpg`, width: 1024, height: 743, subject: "marco-polo-sheep", alt: "Marco Polo sheep with curled horns on snow", pos: "45% 50%" } },
  { name: "Himalayan brown bear", scientific: "Ursus arctos isabellinus", photo: { src: `${BLOB}/wildlife/1778512603446-brown-bear-with-cubs-sighting-KVO-wakhan-wild-life-3JgYc1gR9s6yRfLx5Mhd5BZ6BUleNx.jpeg`, width: 960, height: 591, subject: "brown-bear", alt: "A brown bear with two cubs on a green slope", pos: "62% 50%" } },
  { name: "Grey wolf", scientific: "Canis lupus", photo: { src: `${BLOB}/wildlife/1778512753165-wolf-sighting-capture-in-KVO-884RZiKeBXkr6Kudi14XfWc83wyrVa.jpeg`, width: 1039, height: 1038, subject: "wolf", alt: "A grey wolf on snowy scree", pos: "45% 40%" } },
  { name: "Red fox", scientific: "Vulpes vulpes", photo: { src: `${BLOB}/wildlife/1778512374893-FB_IMG_1778511453506.jpg-WufvyOTgCFREA6pop2lVQPAD6F5PLp.jpeg`, width: 1484, height: 992, subject: "fox", alt: "A red fox on a rock in the snow", pos: "52% 50%" } },
  { name: "Himalayan marmot", scientific: "Marmota himalayana", photo: { src: `${BLOB}/wildlife/1778512966680-Himalayan-Marmot-34nn9NjLcY6FVKI051rbxfEuZDt9ws.jpeg`, width: 1387, height: 1058, subject: "marmot", alt: "A Himalayan marmot standing on a rock", pos: "45% 50%" } },
  { name: "Golden eagle", scientific: "Aquila chrysaetos", photo: { src: `${BLOB}/wildlife/1778513160027-Golden-eagle-sighting-in-KVO-WFPjGKYSsU8CEQ1xMHa1hDUQaFd7Xj.jpeg`, width: 1138, height: 1192, subject: "eagle", alt: "A golden eagle perched on a cliff ledge", pos: "40% 55%" } },
]

export type Tier = { label: string; price: string; note: string }
const FALLBACK_TIERS: Tier[] = [
  { label: "Solo", price: "$7,000", note: "per expedition" },
  { label: "Two", price: "$3,700", note: "per person" },
  { label: "Group 3+", price: "$3,300", note: "per person" },
]
const FALLBACK_INCLUDED = [
  "All ground transport from Skardu",
  "Daily trips to Khunjerab National Park",
  "Full board accommodation (guesthouse & camping)",
  "Lead guide Hussain Ali Khan",
  "Scout network access (40+ monitors)",
  "Photography equipment support",
  "National Park entry permits",
]
const FALLBACK_EXCLUDED = [
  "International & domestic flights",
  "Personal travel insurance",
  "Guide & porter gratuities",
  "Personal expenses & souvenirs",
]

export type Stage = { day: string; title: string; meta: string; description: string; photo: Photo | null }

export type Credential = { label: string; value: string; desc: string }

export type Stat = { value: string; label: string; sub: string }

export type SiteData = {
  hero: {
    eyebrow: string
    line1: string
    line2: string
    lead: string
    badges: string[]
    video: string
    /** shown while the video loads; null = the built-in still for the built-in film */
    poster: string | null
  }
  intro: { eyebrow: string; title: string; paragraphs: string[]; features: string[]; band: Photo }
  stats: Stat[]
  culture: { eyebrow: string; line1: string; line2: string; paragraphs: string[]; photo: Photo; points: { label: string; value: string }[] } | null
  /** the admin's gallery; empty = the built-in expedition photographs */
  gallery: Photo[]
  name: string
  email: string | null
  phone: string | null
  location: string
  season: string
  groupSizes: string
  sightingRate: string | null
  yearsActive: string | null
  animals: Animal[]
  stages: Stage[]
  tiers: Tier[]
  included: string[]
  excluded: string[]
  guide: {
    name: string
    title: string
    bio: string
    bio2: string
    quote: string
    quoteBy: string
    photo: Photo
    credentials: Credential[]
  }
}

/** The film shipped with the site: its compressed loop and still live in /public. */
const BUILT_IN_FILM = "/hero-video.mp4"

/** A Blob photo the site already knows keeps its real size and framing. */
function knownPhoto(url: string, alt: string, subject: string, w = 1920, h = 1280): Photo {
  const known = (Object.values(PHOTOS) as Photo[]).find((p) => p.src === url)
  return known ? { ...known, alt: alt || known.alt } : { src: url, width: w, height: h, alt, subject }
}

/** "Arrival at Skardu Airport — Gateway to…" → "Arrival at Skardu Airport"; strips stray punctuation. */
function shortTitle(t: string): string {
  return t.replace(/^[\s:–—-]+/, "").split(/\s[—–]\s/)[0].trim()
}

function clean(s: string | null | undefined): string {
  return (s ?? "").replace(/\s+/g, " ").trim()
}

/** Blob uploads the browser cannot show (HEIC) are skipped. */
function showable(url: string | null | undefined): url is string {
  return !!url && !/\.heic(\?|$)/i.test(url)
}

function photoFrom(url: string, alt: string, subject: string, w = 1920, h = 1280): Photo {
  return { src: url, width: w, height: h, alt, subject }
}

export async function loadSite(): Promise<SiteData> {
  const empty = [[], [], [], [], [], null, null, [], null, null, []] as const
  const [settingsRows, stats, wildlifeRows, itineraryRows, tierRows, expertRow, heroRow, itemRows, aboutRow, cultureRow, galleryRows] = await Promise.all([
    db.select().from(schema.siteSettings),
    db.select().from(schema.statistics).orderBy(asc(schema.statistics.position)),
    db.select().from(schema.wildlife).orderBy(asc(schema.wildlife.displayOrder)),
    db.select().from(schema.itineraryDays).orderBy(asc(schema.itineraryDays.displayOrder)),
    db.select().from(schema.pricingTiers).orderBy(asc(schema.pricingTiers.displayOrder)),
    db.select().from(schema.expertContent).limit(1).then((r) => r[0] ?? null),
    db.select().from(schema.heroContent).limit(1).then((r) => r[0] ?? null),
    db.select().from(schema.pricingItems).orderBy(asc(schema.pricingItems.displayOrder)),
    db.select().from(schema.aboutContent).limit(1).then((r) => r[0] ?? null),
    db.select().from(schema.cultureContent).limit(1).then((r) => r[0] ?? null),
    db.select().from(schema.gallery).orderBy(asc(schema.gallery.displayOrder)),
  ]).catch((err) => {
    console.error("[site] database unavailable, rendering fallbacks", err)
    return empty
  })

  const settings = Object.fromEntries(settingsRows.map((s) => [s.key, clean(s.value)]))
  const stat = (label: string) => {
    const s = stats.find((x) => x.label.toLowerCase().includes(label))
    return s ? `${s.endValue}${s.suffix ?? ""}` : null
  }

  const animals: Animal[] = wildlifeRows.filter((w) => showable(w.imageUrl)).length
    ? wildlifeRows
        .filter((w) => showable(w.imageUrl))
        .map((w) => ({
          name: clean(w.name),
          scientific: clean(w.scientific),
          photo: knownPhoto(w.imageUrl, clean(w.name), "wildlife"),
          description: clean(w.description),
          stat: [clean(w.statValue), clean(w.statLabel)].filter(Boolean).join(" "),
        }))
    : FALLBACK_ANIMALS

  const stages: Stage[] = itineraryRows.map((d) => ({
    day: clean(d.dayLabel).replace(/-/g, "–"),
    title: shortTitle(clean(d.title)),
    meta: [clean(d.location).replace(/-/g, " to "), clean(d.duration)].filter(Boolean).join(", "),
    description: clean(d.description),
    photo: showable(d.imageUrl) ? photoFrom(d.imageUrl, shortTitle(clean(d.title)), "itinerary", 1500, 1125) : null,
  }))

  const tiers: Tier[] = tierRows.length
    ? tierRows.map((t) => ({ label: clean(t.personsLabel), price: clean(t.price), note: clean(t.note) }))
    : FALLBACK_TIERS
  const included = itemRows.filter((i) => i.type === "included").map((i) => clean(i.text))
  const excluded = itemRows.filter((i) => i.type === "excluded").map((i) => clean(i.text))

  const paras = (...ps: (string | null | undefined)[]) => ps.map(clean).filter(Boolean)
  const heroVideo = clean(heroRow?.videoUrl) || BUILT_IN_FILM
  const heroPoster = clean(heroRow?.posterImageUrl)

  return {
    hero: {
      eyebrow: clean(heroRow?.locationLabel) || clean(heroRow?.subheading) || "Gilgit-Baltistan, Pakistan",
      line1: clean(heroRow?.headingLine1) || "Track the snow leopard",
      line2: clean(heroRow?.headingLine2) || "in the high Karakoram",
      lead: clean(heroRow?.description) || "Ten-day photo expeditions from Sost into the Khunjerab conservancy, with local guides and spotters.",
      badges: [heroRow?.badge1Label, heroRow?.badge2Label, heroRow?.badge3Label].map(clean).filter(Boolean),
      // the built-in film plays as its compressed loop with its own still; an uploaded film plays as-is
      video: heroVideo === BUILT_IN_FILM ? "/hero-loop.mp4" : heroVideo,
      poster: heroVideo === BUILT_IN_FILM ? null : heroPoster && showable(heroPoster) ? heroPoster : null,
    },
    intro: {
      eyebrow: clean(aboutRow?.eyebrow) || "The expedition",
      title: clean(aboutRow?.title) || "Ten days in the valleys where the snow leopard hunts",
      paragraphs: paras(aboutRow?.paragraph1, aboutRow?.paragraph2),
      features: (aboutRow?.featureCards ?? []).map((f) => clean(f.label)).filter(Boolean),
      band: aboutRow?.imageUrl && showable(aboutRow.imageUrl) ? knownPhoto(aboutRow.imageUrl, "A valley in the Karakoram", "landscape", 3152, 2233) : PHOTOS.valley,
    },
    stats: stats
      .map((x) => ({ value: `${x.endValue}${clean(x.suffix)}`, label: clean(x.label), sub: clean(x.sublabel) }))
      .filter((x) => x.label),
    culture: cultureRow
      ? {
          eyebrow: clean(cultureRow.eyebrow),
          line1: clean(cultureRow.titleLine1),
          line2: clean(cultureRow.titleLine2),
          paragraphs: paras(cultureRow.paragraph1, cultureRow.paragraph2),
          photo: cultureRow.imageUrl && showable(cultureRow.imageUrl) ? knownPhoto(cultureRow.imageUrl, [clean(cultureRow.titleLine1), clean(cultureRow.titleLine2)].join(" "), "landscape") : PHOTOS.cliff,
          points: (cultureRow.culturePoints ?? []).map((c) => ({ label: clean(c.label), value: clean(c.value) })).filter((c) => c.label),
        }
      : null,
    gallery: galleryRows
      .filter((g) => showable(g.src))
      .map((g) => knownPhoto(g.src, [clean(g.caption), clean(g.location)].filter(Boolean).join(", "), "gallery", 1500, 1125)),
    name: "Wakhan Wildlife",
    email: settings.contact_email || null,
    phone: settings.contact_phone || null,
    location: settings.contact_location || "Sost, Gilgit-Baltistan, Pakistan",
    season: settings.best_season || "15 January to 15 March",
    groupSizes: settings.group_sizes || "Solo, pairs, or small groups (3–6)",
    sightingRate: stat("sighting"),
    yearsActive: stat("years"),
    animals,
    stages,
    tiers,
    included: included.length ? included : FALLBACK_INCLUDED,
    excluded: excluded.length ? excluded : FALLBACK_EXCLUDED,
    guide: {
      name: clean(expertRow?.name) || "Hussain Ali Khan",
      title: clean(expertRow?.title) || "Lead snow leopard expert",
      bio: clean(expertRow?.bioParagraph1),
      bio2: clean(expertRow?.bioParagraph2),
      quote: clean(expertRow?.quote),
      quoteBy: clean(expertRow?.quoteAttribution),
      photo: expertRow?.imageUrl && showable(expertRow.imageUrl)
        ? { ...PHOTOS.guide, src: expertRow.imageUrl }
        : PHOTOS.guide,
      credentials: (expertRow?.credentials ?? []).map((c) => ({ label: clean(c.label), value: clean(c.value), desc: clean(c.desc) })),
    },
  }
}
