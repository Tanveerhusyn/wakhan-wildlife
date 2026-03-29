import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isLoginPage = req.nextUrl.pathname === "/admin/login"

  if (isAdminRoute && !isLoginPage && !req.auth) {
    const loginUrl = new URL("/admin/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from login
  if (isLoginPage && req.auth) {
    const dashboardUrl = new URL("/admin/dashboard", req.url)
    return NextResponse.redirect(dashboardUrl)
  }
})

export const config = {
  // Protect all /admin routes EXCEPT the login page itself to avoid redirect loops
  matcher: ["/admin/((?!login$).*)"],
}
