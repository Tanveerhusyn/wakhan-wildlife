/**
 * A tiny HTML templating helper for the public site.
 *
 * The public pages are served as plain server-rendered HTML (see app/(public)/route.ts) so the
 * site's own small script (public/site/site.js) can work on the
 * markup without React hydration fighting them. Every interpolated value is escaped unless it
 * is wrapped in raw() or is the result of another html`` call.
 */

const RAW = Symbol("raw")

export type Html = { [RAW]: true; value: string }

export function raw(value: string): Html {
  return { [RAW]: true, value }
}

function isHtml(v: unknown): v is Html {
  return typeof v === "object" && v !== null && (v as Html)[RAW] === true
}

export function escape(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function render(v: unknown): string {
  if (v === null || v === undefined || v === false) return ""
  if (Array.isArray(v)) return v.map(render).join("")
  if (isHtml(v)) return v.value
  return escape(v)
}

export function html(strings: TemplateStringsArray, ...values: unknown[]): Html {
  let out = strings[0]
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1]
  return raw(out)
}

export function toString(h: Html): string {
  return h.value
}
