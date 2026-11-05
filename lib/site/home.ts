import { html, raw, type Html } from "./html"
import { img, optimised, type Photo } from "./img"
import { PHOTOS, type SiteData, type Animal, type Stage } from "./data"
import { arrow, footer, icons, MAIN_ACTION, nav, shell, telHref } from "./shell"

/*
 * The home page, dark and cinematic:
 *  hero       the client's drone film of a snow leopard, full screen, muted loop
 *  expedition a large statement, the trip in four numbers
 *  band       the Khunjerab valley, full bleed
 *  wildlife   a mosaic of the species, the snow leopard leading
 *  story      a snow leopard above the valley, the spotters and the sighting rate
 *  itinerary  the stages from the admin, one row each
 *  guide      the lead guide, half-screen portrait
 *  field      a slow strip of expedition photographs
 *  prices     three tiers, what is and is not included
 *  faq        questions, opening in place
 *  book       the booking form over the yak caravan
 */

const MONTHS: Record<string, string> = { January: "Jan", February: "Feb", March: "Mar", April: "Apr", May: "May", June: "Jun", July: "Jul", August: "Aug", September: "Sep", October: "Oct", November: "Nov", December: "Dec" }
const shortSeason = (s: string) => s.replace(/\b([A-Z][a-z]+)\b/g, (m) => MONTHS[m] ?? m).replace(/\s+to\s+/i, " – ")

/** "95%" → 95 and "%" so the unit can be set small */
function splitStat(v: string): [string, string] {
  const m = v.match(/^([\d.,]+)(.*)$/)
  return m ? [m[1], m[2].trim()] : [v, ""]
}

function hero(d: SiteData): Html {
  const h = d.hero
  const facts: [string, string][] = [
    ...(d.sightingRate ? [["Sighting rate", d.sightingRate] as [string, string]] : []),
    ["Duration", "10 days"],
    ["Season", shortSeason(d.season)],
    ["Group", "1 – 6 guests"],
  ]
  const poster = h.poster ? optimised(h.poster, 1920) : optimised(PHOTOS.heroPoster.src, 1920)
  return html`<section class="hero" aria-labelledby="hero-h">
    <div class="hero__media">
      <video autoplay muted loop playsinline preload="auto" poster="${poster}" aria-hidden="true">
        <source src="${h.video}">
      </video>
    </div>
    <div class="wrap hero__inner">
      <div class="hero__grid">
        <div>
          <span class="eyebrow reveal">${h.eyebrow}</span>
          <h1 id="hero-h" class="reveal" style="--d:.1s">${h.line1} <em>${h.line2}</em></h1>
          <p class="lead reveal" style="--d:.2s">${h.lead}</p>
          <div class="hero__actions reveal" style="--d:.3s">
            <a class="btn btn--gold" href="${MAIN_ACTION.href}">${MAIN_ACTION.label}${arrow}</a>
            <a class="btn btn--ghost" href="#itinerary">See the ten days</a>
          </div>
          ${h.badges.length ? html`<ul class="hero__badges reveal" style="--d:.38s">${h.badges.map((b) => html`<li>${b}</li>`)}</ul>` : ""}
        </div>
        <dl class="hero__facts reveal" style="--d:.45s">
          ${facts.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}
        </dl>
      </div>
    </div>
    <span class="hero__scroll" aria-hidden="true"></span>
  </section>`
}

function expedition(d: SiteData): Html {
  const i = d.intro
  const stats: { value: string; label: string; sub: string }[] = d.stats.length
    ? d.stats
    : [
        ...(d.sightingRate ? [{ value: d.sightingRate, label: "Sighting rate", sub: "across our expeditions" }] : []),
        { value: "40+", label: "Local scouts", sub: "watching the territories" },
        { value: "10", label: "Days", sub: "from Skardu Airport and back" },
      ]
  const paragraphs = i.paragraphs.length
    ? i.paragraphs
    : ["Seven tracking days in the Khunjerab conservancy, with pick-up at Skardu Airport and nights in Sost. Each morning the spotters report fresh tracks, so the day starts where the cats are."]
  return html`<section class="section" id="expedition" aria-labelledby="expedition-h">
    <div class="wrap">
      <div class="intro__grid">
        <div>
          <span class="eyebrow reveal">${i.eyebrow}</span>
          <h2 id="expedition-h" class="intro__text reveal" style="--d:.1s">${i.title}</h2>
          ${i.features.length ? html`<ul class="chips reveal" style="--d:.15s">${i.features.map((f) => html`<li>${f}</li>`)}</ul>` : ""}
        </div>
        <div class="intro__side reveal" style="--d:.2s">
          ${paragraphs.map((t, n) => html`<p class="${n === 0 ? "lead" : "muted"}">${t}</p>`)}
          <p><a class="link" href="#itinerary">See the ten days ${arrow}</a></p>
        </div>
      </div>
      <div class="stats">
        ${stats.slice(0, 4).map((x, n) => {
          const [num, unit] = splitStat(x.value)
          return html`<div class="stat reveal" style="--d:${n * 0.08}s"><div class="stat__value">${num}${unit ? html`<sup>${unit}</sup>` : ""}</div><p class="stat__label"><strong>${x.label}</strong>${x.sub ? html`<br>${x.sub}` : ""}</p></div>`
        })}
      </div>
    </div>
  </section>`
}

function band(p: Photo): Html {
  return html`<div class="band" role="img" aria-label="${p.alt}">${img(p, { sizes: "100vw", box: [1920, 1360] })}</div>`
}

function animal(a: Animal, i: number): Html {
  const big = i === 0
  return html`<article class="animal reveal" tabindex="0" style="--d:${(i % 4) * 0.06}s">
    ${img(a.photo, { sizes: big ? "(min-width: 900px) 50vw, 100vw" : "(min-width: 900px) 25vw, (min-width: 600px) 50vw, 100vw", box: big ? [700, 640] : [340, 300] })}
    <span class="animal__num">${a.stat ? a.stat : String(i + 1).padStart(2, "0")}</span>
    <div class="animal__text"><h3>${a.name}</h3>${a.scientific ? html`<p>${a.scientific}</p>` : ""}${a.description ? html`<p class="animal__desc">${a.description}</p>` : ""}</div>
  </article>`
}

function wildlife(d: SiteData): Html {
  return html`<section class="section" id="wildlife" aria-labelledby="wildlife-h">
    <div class="wrap">
      <div class="head">
        <div><span class="eyebrow reveal">Wildlife</span><h2 id="wildlife-h" class="reveal" style="--d:.1s">The cast of the <em>Karakoram</em></h2></div>
        <p class="lead reveal" style="--d:.2s">Snow leopards are why you come. Ibex, Marco Polo sheep, wolves, bears and eagles share the same valleys, and most trips meet several of them.</p>
      </div>
      <div class="mosaic">${d.animals.slice(0, 8).map(animal)}</div>
    </div>
  </section>`
}

function story(d: SiteData): Html {
  const p = PHOTOS.cliff
  return html`<section class="band band--story" aria-labelledby="story-h">
    ${img(p, { sizes: "100vw", box: [1920, 1260] })}
    <div class="band__content"><div class="wrap"><div class="band__text">
      <span class="eyebrow reveal">The spotters</span>
      <h2 id="story-h" class="reveal" style="--d:.1s">Eyes on the <em>mountain</em>, all year</h2>
      <p class="lead reveal" style="--d:.2s">Our scouts live in these valleys. They follow the cats through every season and radio fresh tracks and kills at dawn${d.sightingRate ? html`, which is how the expedition keeps a ${d.sightingRate} sighting rate` : ""}.</p>
    </div></div></div>
  </section>`
}

function culture(d: SiteData): Html {
  const c = d.culture
  if (!c || !(c.line1 || c.line2)) return story(d)
  return html`<section class="band band--story band--culture" id="culture" aria-labelledby="culture-h">
    ${img(c.photo, { sizes: "100vw", box: [1920, 1260] })}
    <div class="band__content"><div class="wrap"><div class="band__text">
      ${c.eyebrow ? html`<span class="eyebrow reveal">${c.eyebrow}</span>` : ""}
      <h2 id="culture-h" class="reveal" style="--d:.1s">${c.line1} <em>${c.line2}</em></h2>
      ${c.paragraphs.map((t, n) => html`<p class="${n === 0 ? "lead" : "band__more"} reveal" style="--d:${0.2 + n * 0.05}s">${t}</p>`)}
      ${c.points.length ? html`<dl class="points reveal" style="--d:.3s">${c.points.map((pt) => html`<div><dt>${pt.label}</dt><dd>${pt.value}</dd></div>`)}</dl>` : ""}
    </div></div></div>
  </section>`
}

function itinerary(d: SiteData): Html {
  const stages: Stage[] = d.stages.slice(0, 6)
  // The admin's day descriptions run to whole paragraphs; the homepage shows the first two sentences.
  const summary = (t: string) => {
    const sentences = t.trim().match(/[^.!?]+[.!?]+(\s|$)/g) ?? [t]
    const short = sentences.slice(0, 2).join("").trim()
    return short.length > 320 ? `${short.slice(0, 300).replace(/\s+\S*$/, "")}…` : short
  }
  if (stages.length === 0) return html``
  return html`<section class="section section--alt" id="itinerary" aria-labelledby="itinerary-h">
    <div class="wrap">
      <div class="head">
        <div><span class="eyebrow reveal">Itinerary</span><h2 id="itinerary-h" class="reveal" style="--d:.1s">Ten days, <em>airport to airport</em></h2></div>
        <p class="lead reveal" style="--d:.2s">Pick-up at Skardu Airport, seven tracking days from Sost, then the drive back for your flight home.</p>
      </div>
      <div class="stages">
        ${stages.map(
          (s) => html`<article class="stage reveal">
            <div class="stage__day"><small>${/[–-]/.test(s.day) ? "Days" : "Day"}</small>${s.day}</div>
            <div class="stage__body"><h3>${s.title}</h3>${s.meta ? html`<p class="stage__meta">${s.meta}</p>` : ""}${s.description ? html`<p class="stage__desc">${summary(s.description)}</p>` : ""}</div>
            <div class="stage__media">${s.photo ? img(s.photo, { sizes: "(min-width: 1100px) 34vw, 100vw", box: [520, 390] }) : ""}</div>
          </article>`,
        )}
      </div>
    </div>
  </section>`
}

function guide(d: SiteData): Html {
  const g = d.guide
  return html`<section class="guide" id="guide" aria-labelledby="guide-h">
    <div class="guide__media">${img(g.photo, { sizes: "(min-width: 1100px) 50vw, 100vw", box: [960, 639] })}</div>
    <div class="guide__body">
      <span class="eyebrow reveal">Your lead guide</span>
      <h2 id="guide-h" class="reveal" style="--d:.1s">${g.name}</h2>
      <p class="guide__role reveal" style="--d:.15s">${g.title}</p>
      ${g.bio ? html`<p class="guide__bio reveal" style="--d:.2s">${g.bio}</p>` : ""}
      ${g.bio2 ? html`<p class="guide__bio guide__bio--more reveal" style="--d:.22s">${g.bio2}</p>` : ""}
      ${g.quote ? html`<blockquote class="guide__quote reveal" style="--d:.24s"><p>${g.quote}</p>${g.quoteBy ? html`<cite>${g.quoteBy}</cite>` : ""}</blockquote>` : ""}
      ${g.credentials.length
        ? html`<div class="creds reveal" style="--d:.25s">${g.credentials.slice(0, 4).map(
            (c) => html`<div class="cred"><div class="cred__value">${c.value}</div><p class="cred__label">${c.label}</p>${c.desc ? html`<p class="cred__desc">${c.desc}</p>` : ""}</div>`,
          )}</div>`
        : ""}
    </div>
  </section>`
}

function field(d: SiteData): Html {
  const set = d.gallery.length >= 4 ? d.gallery : [PHOTOS.campfire, PHOTOS.cubsCave, PHOTOS.scopes, PHOTOS.ridge, PHOTOS.yak, PHOTOS.portraitBw, PHOTOS.trek, PHOTOS.cubsRock, PHOTOS.lying, PHOTOS.navBear, PHOTOS.navIbex]
  const fig = (p: Photo, hidden: boolean) => {
    const h = 420
    const w = Math.round((p.width / p.height) * h)
    return html`<figure${hidden ? raw(` aria-hidden="true"`) : ""}>${img(hidden ? { ...p, alt: "" } : p, { sizes: `${w}px`, box: [w, h] })}</figure>`
  }
  return html`<section class="section section--tight" id="field" aria-labelledby="field-h">
    <div class="wrap">
      <div class="head">
        <div><span class="eyebrow reveal">From the field</span><h2 id="field-h" class="reveal" style="--d:.1s">Last season, <em>as it happened</em></h2></div>
        <p class="lead reveal" style="--d:.2s">Photographs from our guests and guides: the camps, the climbs, the long waits and the moments that made them worth it.</p>
      </div>
    </div>
    <div class="strip"><div class="strip__track">${set.map((p) => fig(p, false))}${set.map((p) => fig(p, true))}</div></div>
  </section>`
}

function prices(d: SiteData): Html {
  return html`<section class="section" id="prices" aria-labelledby="prices-h">
    <div class="wrap">
      <div class="head">
        <div><span class="eyebrow reveal">Prices</span><h2 id="prices-h" class="reveal" style="--d:.1s">One price, <em>everything on the mountain</em></h2></div>
        <p class="lead reveal" style="--d:.2s">From pick-up at Skardu Airport to the drive back. The larger your group, the lower the price per person.</p>
      </div>
      <div class="tiers">
        ${d.tiers.map(
          (t, i) => html`<article class="tier reveal" style="--d:${i * 0.08}s">
            <p class="tier__label">${t.label}</p>
            <p class="tier__price">${t.price}</p>
            <p class="tier__note">${t.note.charAt(0).toUpperCase() + t.note.slice(1)}</p>
            <a class="btn btn--ghost" href="#book">Request dates${arrow}</a>
          </article>`,
        )}
      </div>
      <div class="includes">
        <div class="reveal"><h3>Included</h3><ul>${d.included.map((t) => html`<li>${t}</li>`)}</ul></div>
        <div class="no reveal" style="--d:.1s"><h3>Not included</h3><ul>${d.excluded.map((t) => html`<li>${t}</li>`)}</ul></div>
      </div>
    </div>
  </section>`
}

function faq(d: SiteData): Html {
  const items: [string, string][] = [
    ["When is the season?", `The expeditions run ${d.season}, when snow pushes the snow leopards and their prey down into the valleys.`],
    ["How big are the groups?", `${d.groupSizes}. Prices are lower per person in a group.`],
    ["Where does the expedition start?", "At Skardu Airport, where your guide meets you for the drive to Sost on day one."],
    ["How likely is a sighting?", d.sightingRate ? `Our sighting rate is ${d.sightingRate}. Spotters watch the territories all year and report fresh signs each morning.` : "Spotters watch the territories all year and report fresh signs each morning."],
    ["Is camera equipment provided?", "Photography equipment support is part of the price. Bring your own camera body and lenses."],
  ]
  return html`<section class="section section--alt" id="faq" aria-labelledby="faq-h">
    <div class="wrap faq-grid">
      <div class="sticky">
        <span class="eyebrow reveal">Questions</span>
        <h2 id="faq-h" class="reveal" style="--d:.1s">Before you <em>book</em></h2>
        <p class="lead reveal" style="--d:.2s">Anything else about the trip, the season or your gear, ask us directly.</p>
        ${d.email ? html`<p class="reveal" style="--d:.25s"><a class="link" href="mailto:${d.email}">Email us ${arrow}</a></p>` : ""}
      </div>
      <div class="faq reveal">
        ${items.map(([q, a], i) => html`<details${i === 0 ? raw(" open") : ""}><summary>${q}<i aria-hidden="true"></i></summary><p>${a}</p></details>`)}
      </div>
    </div>
  </section>`
}

function book(d: SiteData): Html {
  const sizes = ["Solo", "Two people", "3 to 6 people"]
  return html`<section class="section book" id="book" aria-labelledby="book-h">
    <div class="book__bg">${img(PHOTOS.yak, { sizes: "100vw", box: [1440, 1920] })}</div>
    <div class="wrap book__grid">
      <div>
        <span class="eyebrow reveal">Book</span>
        <h2 id="book-h" class="reveal" style="--d:.1s">Reserve your place on the <em>mountain</em></h2>
        <p class="lead reveal" style="--d:.2s">Send your dates and group size. We reply by email to confirm your place and plan the trip with you. The season runs ${d.season}.</p>
        <div class="contact-list reveal" style="--d:.3s">
          ${d.email ? html`<a href="mailto:${d.email}">${icons.mail}${d.email}</a>` : ""}
          ${d.phone ? html`<a href="${telHref(d.phone)}">${icons.phone}${d.phone}</a>` : ""}
          <span class="muted" style="display:inline-flex;gap:14px;align-items:center">${icons.pin}${d.location}</span>
        </div>
      </div>
      <div class="form-card reveal" style="--d:.15s">
        <form class="form" method="post" action="/api/bookings">
          <label class="field">Name<input name="name" autocomplete="name" required></label>
          <label class="field">Email<input name="email" type="email" autocomplete="email" required></label>
          <label class="field">Phone or WhatsApp<input name="phone" type="tel" autocomplete="tel"></label>
          <label class="field">Group size<select name="groupSize">${sizes.map((s) => html`<option>${s}</option>`)}</select></label>
          <label class="field field--full">Preferred dates<input name="preferredDates" placeholder="e.g. first two weeks of February"></label>
          <label class="field field--full">Message<textarea name="message" rows="4" placeholder="Anything we should know: experience, lenses, dietary needs"></textarea></label>
          <button class="btn btn--gold" type="submit">Send booking request${arrow}</button>
          <p class="form__note">No payment now. We confirm dates with you by email first.</p>
        </form>
      </div>
    </div>
  </section>`
}

export function renderHome(d: SiteData, origin = ""): string {
  const body = html`${nav(true)}
<main id="top">
  ${hero(d)}
  ${expedition(d)}
  ${band(d.intro.band)}
  ${wildlife(d)}
  ${culture(d)}
  ${itinerary(d)}
  ${guide(d)}
  ${field(d)}
  ${prices(d)}
  ${faq(d)}
  ${book(d)}
</main>
${footer(d, true)}`
  return shell({
    title: "Wakhan Wildlife | Snow leopard expeditions in the Karakoram, Pakistan",
    description: `Ten-day snow leopard photo expeditions from Sost into the Khunjerab conservancy, Gilgit-Baltistan. Season ${d.season}.`,
    body,
    ogImage: origin ? `${origin}${optimised(PHOTOS.cliff.src, 1200)}` : undefined,
    head: html`<link rel="preload" as="image" href="${optimised(PHOTOS.heroPoster.src, 1920)}">`,
  })
}
