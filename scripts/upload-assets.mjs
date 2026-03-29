/**
 * Converts images to WebP, uploads all assets to Vercel Blob,
 * then smart-assigns URLs to DB sections.
 *
 * Usage: node scripts/upload-assets.mjs
 */
import sharp from "sharp"
import { put } from "@vercel/blob"
import { readFile, readdir, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { sql } from "@vercel/postgres"
import dotenv from "dotenv"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")

// Load env vars
dotenv.config({ path: path.join(ROOT, ".env.local") })

const ASSETS_DIR = "/Users/tanveerhussain/Downloads/wildlife-final/assests"
const TMP_DIR = "/tmp/wildlife-webp"

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

if (!BLOB_TOKEN) {
  console.error("Missing BLOB_READ_WRITE_TOKEN")
  process.exit(1)
}

// --- STEP 1: Convert images to WebP ---
const IMAGE_FILES = [
  "DSCN9078-1.JPG",
  "IMG_6011.JPG",
  "IMG_6017.JPG",
  "IMG_6577.HEIC",
  "IMG_7094.HEIC",
  "IMG_7120.HEIC",
  "IMG_7395.JPG",
  "hussain_ali.jpeg",
]

async function convertImages() {
  if (!existsSync(TMP_DIR)) await mkdir(TMP_DIR, { recursive: true })

  const results = {}
  for (const filename of IMAGE_FILES) {
    const src = path.join(ASSETS_DIR, filename)
    const base = path.basename(filename, path.extname(filename))
    const dest = path.join(TMP_DIR, `${base}.webp`)

    if (existsSync(dest)) {
      console.log(`  ✓ Already converted: ${base}.webp`)
      results[filename] = dest
      continue
    }

    console.log(`  Converting ${filename} → ${base}.webp …`)
    try {
      await sharp(src)
        .webp({ quality: 82 })
        .toFile(dest)
      results[filename] = dest
      console.log(`    ✓ Done`)
    } catch (err) {
      console.error(`    ✗ Failed: ${err.message}`)
    }
  }
  return results
}

// --- STEP 2: Upload to Vercel Blob ---
async function uploadToBlob(localPath, remoteName) {
  const buffer = await readFile(localPath)
  const contentType = localPath.endsWith(".webp")
    ? "image/webp"
    : localPath.endsWith(".MP4") || localPath.endsWith(".mp4")
    ? "video/mp4"
    : "video/quicktime"

  console.log(`  Uploading ${remoteName} …`)
  const result = await put(remoteName, buffer, {
    access: "public",
    token: BLOB_TOKEN,
    contentType,
  })
  console.log(`    ✓ ${result.url}`)
  return result.url
}

// --- STEP 3: Smart-assign to DB ---
async function updateDB(urlMap) {
  console.log("\n📊 Updating database…")

  // Hero: video
  if (urlMap["hero_video"]) {
    await sql`UPDATE hero_content SET video_url = ${urlMap["hero_video"]} WHERE id = 1`
    console.log("  ✓ hero.video_url")
  }

  // Expert: hussain_ali photo
  if (urlMap["hussain_ali"]) {
    await sql`UPDATE expert_content SET image_url = ${urlMap["hussain_ali"]} WHERE id = 1`
    console.log("  ✓ expert.image_url")
  }

  // About: a nice landscape — use IMG_6011 (mountain shot)
  if (urlMap["IMG_6011"]) {
    await sql`UPDATE about_content SET image_url = ${urlMap["IMG_6011"]} WHERE id = 1`
    console.log("  ✓ about.image_url")
  }

  // Culture: use IMG_6017
  if (urlMap["IMG_6017"]) {
    await sql`UPDATE culture_content SET image_url = ${urlMap["IMG_6017"]} WHERE id = 1`
    console.log("  ✓ culture.image_url")
  }

  // Gallery: all landscape shots
  const galleryImages = [
    { key: "DSCN9078-1", caption: "Wakhan Corridor", location: "Wakhan, Afghanistan" },
    { key: "IMG_7094",    caption: "Wilderness Landscape", location: "Wakhan" },
    { key: "IMG_7120",    caption: "Mountain Scenery", location: "Wakhan Corridor" },
    { key: "IMG_7395",    caption: "Local Wildlife Habitat", location: "Wakhan" },
    { key: "IMG_6577",    caption: "High Altitude Vista", location: "Wakhan, Afghanistan" },
  ]

  for (let i = 0; i < galleryImages.length; i++) {
    const { key, caption, location } = galleryImages[i]
    const src = urlMap[key]
    if (!src) continue
    // Check if a gallery row for this src already exists; upsert by display_order
    const order = i + 1
    await sql`
      INSERT INTO gallery (display_order, src, caption, location)
      VALUES (${order}, ${src}, ${caption}, ${location})
      ON CONFLICT (display_order) DO UPDATE
        SET src = EXCLUDED.src,
            caption = EXCLUDED.caption,
            location = EXCLUDED.location
    `
    console.log(`  ✓ gallery[${order}] = ${key}`)
  }

  // Hero poster image: use a nice landscape
  if (urlMap["IMG_7094"]) {
    await sql`UPDATE hero_content SET poster_image_url = ${urlMap["IMG_7094"]} WHERE id = 1`
    console.log("  ✓ hero.poster_image_url")
  }
}

// --- Main ---
async function main() {
  console.log("🔄 Step 1: Converting images to WebP…")
  const converted = await convertImages()

  console.log("\n☁️  Step 2: Uploading to Vercel Blob…")
  const urlMap = {}

  // Upload converted images
  for (const [original, localPath] of Object.entries(converted)) {
    const base = path.basename(original, path.extname(original))
    const remoteName = `wildlife/${base}.webp`
    try {
      const url = await uploadToBlob(localPath, remoteName)
      urlMap[base] = url
    } catch (err) {
      console.error(`  ✗ Upload failed for ${base}: ${err.message}`)
    }
  }

  // Upload hero video (as-is, no conversion needed)
  const heroVideoPath = path.join(ASSETS_DIR, "videos", "hero_video.MP4")
  if (existsSync(heroVideoPath)) {
    try {
      const url = await uploadToBlob(heroVideoPath, "wildlife/hero_video.mp4")
      urlMap["hero_video"] = url
    } catch (err) {
      console.error(`  ✗ Upload failed for hero_video: ${err.message}`)
    }
  }

  console.log("\n📋 URL map:", urlMap)

  console.log("\n📊 Step 3: Updating database…")
  try {
    await updateDB(urlMap)
  } catch (err) {
    console.error("DB update error:", err.message)
  }

  console.log("\n✅ Done!")
}

main().catch(console.error)
