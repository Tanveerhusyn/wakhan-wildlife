import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  jsonb,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core"

// ─── Site-wide ───────────────────────────────────────────────────────────────

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).unique().notNull(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const navigationItems = pgTable("navigation_items", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  href: text("href").notNull(),
  displayOrder: integer("display_order").notNull(),
})

// ─── Sections ─────────────────────────────────────────────────────────────────

export const heroContent = pgTable("hero_content", {
  id: serial("id").primaryKey(),
  headingLine1: text("heading_line1").notNull(),
  headingLine2: text("heading_line2").notNull(),
  subheading: text("subheading").notNull(),
  description: text("description").notNull(),
  locationLabel: text("location_label").notNull(),
  badge1Icon: varchar("badge_1_icon", { length: 50 }),
  badge1Label: text("badge_1_label"),
  badge2Icon: varchar("badge_2_icon", { length: 50 }),
  badge2Label: text("badge_2_label"),
  badge3Icon: varchar("badge_3_icon", { length: 50 }),
  badge3Label: text("badge_3_label"),
  videoUrl: text("video_url"),
  posterImageUrl: text("poster_image_url"),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const aboutContent = pgTable("about_content", {
  id: serial("id").primaryKey(),
  eyebrow: text("eyebrow").notNull(),
  title: text("title").notNull(),
  paragraph1: text("paragraph_1").notNull(),
  paragraph2: text("paragraph_2").notNull(),
  // [{icon: string, label: string}]
  featureCards: jsonb("feature_cards").notNull().$type<
    { icon: string; label: string }[]
  >(),
  imageUrl: text("image_url"),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const statistics = pgTable("statistics", {
  id: serial("id").primaryKey(),
  position: integer("position").unique().notNull(),
  endValue: integer("end_value").notNull(),
  suffix: varchar("suffix", { length: 20 }),
  label: text("label").notNull(),
  sublabel: text("sublabel"),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const wildlife = pgTable("wildlife", {
  id: serial("id").primaryKey(),
  displayOrder: integer("display_order").notNull(),
  name: text("name").notNull(),
  scientific: text("scientific").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  statValue: text("stat_value").notNull(),
  statLabel: text("stat_label").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  displayOrder: integer("display_order").notNull(),
  src: text("src").notNull(),
  caption: text("caption").notNull(),
  location: text("location").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const expertContent = pgTable("expert_content", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bioParagraph1: text("bio_paragraph_1").notNull(),
  bioParagraph2: text("bio_paragraph_2").notNull(),
  imageUrl: text("image_url"),
  quote: text("quote"),
  quoteAttribution: text("quote_attribution"),
  // [{icon: string, label: string, value: string, desc: string}]
  credentials: jsonb("credentials").notNull().$type<
    { icon: string; label: string; value: string; desc: string }[]
  >(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const itineraryDays = pgTable("itinerary_days", {
  id: serial("id").primaryKey(),
  dayLabel: varchar("day_label", { length: 20 }).notNull(),
  dateLabel: text("date_label").notNull(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  duration: text("duration").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  iconName: varchar("icon_name", { length: 50 }),
  isHighlight: boolean("is_highlight").default(false),
  displayOrder: integer("display_order").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const pricingTiers = pgTable("pricing_tiers", {
  id: serial("id").primaryKey(),
  displayOrder: integer("display_order").notNull(),
  personsLabel: text("persons_label").notNull(),
  price: text("price").notNull(),
  note: text("note").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const pricingItems = pgTable("pricing_items", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 20 }).notNull(), // 'included' | 'excluded'
  displayOrder: integer("display_order").notNull(),
  text: text("text").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const cultureContent = pgTable("culture_content", {
  id: serial("id").primaryKey(),
  eyebrow: text("eyebrow").notNull(),
  titleLine1: text("title_line1").notNull(),
  titleLine2: text("title_line2").notNull(),
  paragraph1: text("paragraph_1").notNull(),
  paragraph2: text("paragraph_2").notNull(),
  imageUrl: text("image_url"),
  // [{label: string, value: string}]
  culturePoints: jsonb("culture_points").notNull().$type<
    { label: string; value: string }[]
  >(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  groupSize: text("group_size"),
  preferredDates: text("preferred_dates"),
  message: text("message"),
  status: varchar("status", { length: 20 }).notNull().default("new"), // 'new' | 'read' | 'archived'
  submittedAt: timestamp("submitted_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type SiteSetting = typeof siteSettings.$inferSelect
export type HeroContent = typeof heroContent.$inferSelect
export type AboutContent = typeof aboutContent.$inferSelect
export type Statistic = typeof statistics.$inferSelect
export type Wildlife = typeof wildlife.$inferSelect
export type GalleryItem = typeof gallery.$inferSelect
export type ExpertContent = typeof expertContent.$inferSelect
export type ItineraryDay = typeof itineraryDays.$inferSelect
export type PricingTier = typeof pricingTiers.$inferSelect
export type PricingItem = typeof pricingItems.$inferSelect
export type CultureContent = typeof cultureContent.$inferSelect
export type Booking = typeof bookings.$inferSelect
export type NavigationItem = typeof navigationItems.$inferSelect
