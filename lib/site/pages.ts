import { html, type Html } from "./html"
import type { SiteData } from "./data"
import { footer, nav, shell } from "./shell"

/** A small inner page: one section on the page ground, then the shared footer. */
function inner(d: SiteData, title: string, h1: string, content: Html, eyebrow = "Wakhan Wildlife"): string {
  const body = html`${nav(false)}
<main id="top">
  <section class="page" aria-labelledby="page-h">
    <div class="wrap">
      <span class="eyebrow">${eyebrow}</span>
      <h1 id="page-h">${h1}</h1>
      <div class="prose">${content}</div>
    </div>
  </section>
</main>
${footer(d, false)}`
  return shell({ title: `${title} | Wakhan Wildlife`, description: `${title} for Wakhan Wildlife snow leopard expeditions.`, body })
}

export function renderPrivacy(d: SiteData): string {
  return inner(
    d,
    "Privacy",
    "Privacy",
    html`<p>When you send the booking form we store your name, email, phone number, group size, preferred dates and message, so we can reply and plan your expedition.</p>
      <p>We use these details only to answer your request and run your trip. We do not sell them or share them for marketing.</p>
      <p>To see or delete what we hold about you, ${d.email ? html`email <a href="mailto:${d.email}">${d.email}</a>` : "contact us"}.</p>
      <p>The site counts visits with Vercel Web Analytics, which sets no cookies and stores no personal data.</p>`,
  )
}

export function renderBookingSent(d: SiteData, ok: boolean): string {
  return ok
    ? inner(
        d,
        "Request sent",
        "Your booking request is sent",
        html`<p class="lead">Thank you. We read every request and reply by email to confirm your place and dates.</p>
          <p><a href="/">Back to the expedition</a></p>`,
      )
    : inner(
        d,
        "Request not sent",
        "Your request could not be sent",
        html`<p class="lead">A name and a valid email address are needed. Please go back and check the form.</p>
          <p><a href="/#book">Back to the booking form</a></p>`,
      )
}
