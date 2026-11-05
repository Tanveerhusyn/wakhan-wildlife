import { loadSite } from "@/lib/site/data"
import { renderPrivacy } from "@/lib/site/pages"

export const dynamic = "force-static"
export const revalidate = 3600

export async function GET() {
  return new Response(renderPrivacy(await loadSite()), {
    headers: { "content-type": "text/html; charset=utf-8" },
  })
}
