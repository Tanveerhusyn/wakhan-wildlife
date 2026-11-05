import { loadSite } from "@/lib/site/data"
import { renderHome } from "@/lib/site/home"

/*
 * The public home page, served as plain HTML (no React on the page) so the design system's own
 * scripts in public/assets run on markup they own. Content comes from the admin CMS (Postgres);
 * the page is cached and rebuilt at most once a minute, and the admin's saves call
 * revalidatePath("/") to rebuild it at once.
 */
export const dynamic = "force-static"
export const revalidate = 60

export async function GET() {
  const data = await loadSite()
  const origin = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : ""
  return new Response(renderHome(data, origin), {
    headers: { "content-type": "text/html; charset=utf-8" },
  })
}
