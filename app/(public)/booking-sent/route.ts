import { NextRequest } from "next/server"
import { loadSite } from "@/lib/site/data"
import { renderBookingSent } from "@/lib/site/pages"

export async function GET(req: NextRequest) {
  const ok = req.nextUrl.searchParams.get("status") !== "invalid"
  return new Response(renderBookingSent(await loadSite(), ok), {
    status: ok ? 200 : 400,
    headers: { "content-type": "text/html; charset=utf-8" },
  })
}
