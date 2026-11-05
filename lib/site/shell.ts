import { html, raw, type Html } from "./html"
import type { SiteData } from "./data"

/**
 * The page shell for the public site: dark, cinematic, photograph-led.
 * Styles and the small enhancement script live in public/site/.
 */

export const NAV_WORDS = [
  { href: "#expedition", label: "Expedition" },
  { href: "#wildlife", label: "Wildlife" },
  { href: "#itinerary", label: "Itinerary" },
  { href: "#guide", label: "Your guide" },
  { href: "#prices", label: "Prices" },
] as const

export const MAIN_ACTION = { href: "#book", label: "Book an expedition" } as const

export const arrow = raw(`<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`)

/** a mountain ridge with a pawprint moon: the wordmark's small sign */
const sign = raw(`<svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M2 26l8.5-11 5 6 4-5L30 26" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="22.5" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/></svg>`)

export const icons = {
  mail: raw(`<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M3 5.5l7 5.5 7-5.5" stroke="currentColor" stroke-width="1.4"/></svg>`),
  phone: raw(`<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 2.5h2.5l1.5 4-2 1.2a9 9 0 0 0 5.3 5.3l1.2-2 4 1.5V15a2.5 2.5 0 0 1-2.5 2.5A13.5 13.5 0 0 1 2.5 5 2.5 2.5 0 0 1 5 2.5z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>`),
  pin: raw(`<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 18s6-5.3 6-10a6 6 0 0 0-12 0c0 4.7 6 10 6 10z" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="8" r="2.2" stroke="currentColor" stroke-width="1.4"/></svg>`),
}

export function nav(home = true): Html {
  const base = home ? "" : "/"
  return html`<header class="nav${home ? "" : " nav--solid"}">
  <div class="wrap nav__bar">
    <a class="nav__logo" href="${home ? "#top" : "/"}">${sign}Wakhan Wildlife</a>
    <nav class="nav__links" aria-label="Main">
      ${NAV_WORDS.map((w) => html`<a href="${base}${w.href}">${w.label}</a>`)}
    </nav>
    <a class="btn btn--gold btn--sm nav__cta" href="${base}${MAIN_ACTION.href}">${MAIN_ACTION.label}</a>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="menu" aria-label="Menu"><span></span></button>
  </div>
</header>
<div class="menu" id="menu">
  ${NAV_WORDS.map((w) => html`<a href="${base}${w.href}">${w.label}</a>`)}
  <a class="btn btn--gold" href="${base}${MAIN_ACTION.href}">${MAIN_ACTION.label}${arrow}</a>
</div>`
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`
}

export function footer(d: SiteData, home = true): Html {
  const base = home ? "" : "/"
  const year = new Date().getFullYear()
  return html`<footer class="footer" id="contact">
  <div class="wrap">
    <div class="footer__grid">
      <div>
        <a class="nav__logo" href="${home ? "#top" : "/"}">${sign}Wakhan Wildlife</a>
        <p class="footer__lede">Snow leopard expeditions into the Khunjerab conservancy, led by local guides from ${d.location.split(",")[0]}. Season ${d.season}.</p>
      </div>
      <div><h4>Expedition</h4><ul><li><a href="${base}#itinerary">Itinerary</a></li><li><a href="${base}#prices">Prices</a></li><li><a href="${base}#faq">Questions</a></li></ul></div>
      <div><h4>Explore</h4><ul><li><a href="${base}#wildlife">Wildlife</a></li><li><a href="${base}#guide">Your guide</a></li><li><a href="${base}#field">From the field</a></li></ul></div>
      <div><h4>Contact</h4><ul>${d.email ? html`<li><a href="mailto:${d.email}">${d.email}</a></li>` : ""}${d.phone ? html`<li><a href="${telHref(d.phone)}">${d.phone}</a></li>` : ""}<li><a href="${base}#book">Booking form</a></li></ul></div>
    </div>
    <div class="footer__mark" aria-hidden="true">Wakhan Wildlife</div>
    <div class="footer__legal">
      <span>&copy; ${year} Wakhan Wildlife Tourism &middot; ${d.location}</span>
      <a href="/privacy">Privacy</a>
    </div>
  </div>
</footer>`
}

type ShellOpts = {
  title: string
  description: string
  body: Html
  /** an absolute URL for og:image */
  ogImage?: string
  /** extra tags for <head>, e.g. preloads */
  head?: Html
}

export function shell(o: ShellOpts): string {
  const analytics = process.env.VERCEL ? html`<script defer src="/_vercel/insights/script.js"></script>` : ""
  return html`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0a0b0a">
<title>${o.title}</title>
<meta name="description" content="${o.description}">
<meta property="og:title" content="${o.title}">
<meta property="og:description" content="${o.description}">
<meta property="og:type" content="website">
${o.ogImage ? html`<meta property="og:image" content="${o.ogImage}">` : ""}
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/site/site.css">
${o.head ?? ""}
</head>
<body>
${o.body}
<script src="/site/site.js" defer></script>
${analytics}
</body>
</html>`.value
}
