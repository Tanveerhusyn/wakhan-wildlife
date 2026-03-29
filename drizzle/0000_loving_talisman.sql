CREATE TABLE "about_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"eyebrow" text NOT NULL,
	"title" text NOT NULL,
	"paragraph_1" text NOT NULL,
	"paragraph_2" text NOT NULL,
	"feature_cards" jsonb NOT NULL,
	"image_url" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"group_size" text,
	"preferred_dates" text,
	"message" text,
	"status" varchar(20) DEFAULT 'new' NOT NULL,
	"submitted_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "culture_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"eyebrow" text NOT NULL,
	"title_line1" text NOT NULL,
	"title_line2" text NOT NULL,
	"paragraph_1" text NOT NULL,
	"paragraph_2" text NOT NULL,
	"image_url" text,
	"culture_points" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "expert_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"title" text NOT NULL,
	"bio_paragraph_1" text NOT NULL,
	"bio_paragraph_2" text NOT NULL,
	"image_url" text,
	"quote" text,
	"quote_attribution" text,
	"credentials" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_order" integer NOT NULL,
	"src" text NOT NULL,
	"caption" text NOT NULL,
	"location" text NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "hero_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"heading_line1" text NOT NULL,
	"heading_line2" text NOT NULL,
	"subheading" text NOT NULL,
	"description" text NOT NULL,
	"location_label" text NOT NULL,
	"badge_1_icon" varchar(50),
	"badge_1_label" text,
	"badge_2_icon" varchar(50),
	"badge_2_label" text,
	"badge_3_icon" varchar(50),
	"badge_3_label" text,
	"video_url" text,
	"poster_image_url" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "itinerary_days" (
	"id" serial PRIMARY KEY NOT NULL,
	"day_label" varchar(20) NOT NULL,
	"date_label" text NOT NULL,
	"title" text NOT NULL,
	"location" text NOT NULL,
	"duration" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"icon_name" varchar(50),
	"is_highlight" boolean DEFAULT false,
	"display_order" integer NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "navigation_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"href" text NOT NULL,
	"display_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(20) NOT NULL,
	"display_order" integer NOT NULL,
	"text" text NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pricing_tiers" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_order" integer NOT NULL,
	"persons_label" text NOT NULL,
	"price" text NOT NULL,
	"note" text NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "site_settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "statistics" (
	"id" serial PRIMARY KEY NOT NULL,
	"position" integer NOT NULL,
	"end_value" integer NOT NULL,
	"suffix" varchar(20),
	"label" text NOT NULL,
	"sublabel" text,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "statistics_position_unique" UNIQUE("position")
);
--> statement-breakpoint
CREATE TABLE "wildlife" (
	"id" serial PRIMARY KEY NOT NULL,
	"display_order" integer NOT NULL,
	"name" text NOT NULL,
	"scientific" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"stat_value" text NOT NULL,
	"stat_label" text NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
