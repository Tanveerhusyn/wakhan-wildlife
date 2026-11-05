import { html, type Html } from "./html"

/**
 * Responsive images through Next's own optimizer (/_next/image), so the client's 2–4 MB camera
 * files from Vercel Blob ship as resized WebP/AVIF. Widths must be in next.config's deviceSizes
 * (the Next 16 defaults); quality 75 is the only one Next 16 allows by default.
 */
const WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]

export function optimised(src: string, w: number): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`
}

export type Photo = {
  src: string
  /** the file's own pixel width, so the srcset never upscales */
  width: number
  height: number
  alt: string
  /** what the photograph shows, for data-subject */
  subject: string
  /** CSS object-position, the subject's place in the frame */
  pos?: string
}

type ImgOpts = {
  sizes: string
  className?: string
  eager?: boolean
  style?: string
  /** shown width x height, for the width/height attributes (layout stability) */
  box?: [number, number]
  extra?: Html
}

export function img(p: Photo, o: ImgOpts): Html {
  const widths = WIDTHS.filter((w) => w <= p.width)
  if (widths.length === 0 || widths[widths.length - 1] < p.width) {
    // include the nearest allowed width at or above the file's own, so the largest file is served
    const next = WIDTHS.find((w) => w >= p.width)
    if (next) widths.push(next)
  }
  const srcset = widths.map((w) => `${optimised(p.src, w)} ${Math.min(w, p.width)}w`).join(", ")
  const fallback = optimised(p.src, widths.find((w) => w >= 1080) ?? widths[widths.length - 1])
  const [bw, bh] = o.box ?? [p.width, p.height]
  const style = [p.pos ? `object-position:${p.pos}` : "", o.style ?? ""].filter(Boolean).join(";")
  return html`<img${o.className ? html` class="${o.className}"` : ""} src="${fallback}" srcset="${srcset}" sizes="${o.sizes}" width="${bw}" height="${bh}" alt="${p.alt}" data-source="client" data-subject="${p.subject}"${style ? html` style="${style}"` : ""}${o.eager ? html` fetchpriority="high"` : html` loading="lazy" decoding="async"`}${o.extra ?? ""}>`
}
