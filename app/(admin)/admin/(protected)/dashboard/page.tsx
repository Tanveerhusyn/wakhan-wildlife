import { db, bookings } from "@/lib/db"
import { eq, count } from "drizzle-orm"
import Link from "next/link"
import { Inbox, BarChart3, Globe, Mountain, Image, Map, Users, Camera, DollarSign, BookOpen } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const [newBookingsResult] = await db
    .select({ count: count() })
    .from(bookings)
    .where(eq(bookings.status, "new"))

  const newCount = newBookingsResult?.count ?? 0

  const recentBookings = await db
    .select()
    .from(bookings)
    .orderBy(bookings.submittedAt)
    .limit(5)

  const sections = [
    { href: "/admin/sections/hero", label: "Hero", icon: Mountain },
    { href: "/admin/sections/about", label: "About", icon: Globe },
    { href: "/admin/sections/statistics", label: "Statistics", icon: BarChart3 },
    { href: "/admin/sections/wildlife", label: "Wildlife", icon: Camera },
    { href: "/admin/sections/gallery", label: "Gallery", icon: Image },
    { href: "/admin/sections/culture", label: "Culture", icon: Users },
    { href: "/admin/sections/expert", label: "Expert Guide", icon: BookOpen },
    { href: "/admin/sections/itinerary", label: "Itinerary", icon: Map },
    { href: "/admin/sections/pricing", label: "Pricing", icon: DollarSign },
    { href: "/admin/sections/contact", label: "Contact Info", icon: Globe },
  ]

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Dashboard</h1>
        <p className="mt-1 text-sm text-stone-500">
          Manage all content on your Wakhan Wildlife website.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/bookings">
          <div className="bg-white rounded-lg border border-stone-200 p-5 hover:border-stone-300 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">New Bookings</p>
                <p className="text-3xl font-semibold text-stone-900 mt-1">{newCount}</p>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-lg">
                <Inbox className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            {newCount > 0 && (
              <p className="text-xs text-amber-600 mt-2">Requires attention →</p>
            )}
          </div>
        </Link>
        <div className="bg-white rounded-lg border border-stone-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">Site Sections</p>
              <p className="text-3xl font-semibold text-stone-900 mt-1">{sections.length}</p>
            </div>
            <div className="p-2.5 bg-stone-100 rounded-lg">
              <Globe className="h-5 w-5 text-stone-600" />
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-2">All editable</p>
        </div>
      </div>

      {/* Section links */}
      <div>
        <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-3">
          Site Content
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {sections.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 bg-white rounded-lg border border-stone-200 px-3 py-3 text-sm text-stone-700 hover:border-stone-300 hover:bg-stone-50 transition-colors"
            >
              <Icon className="h-4 w-4 text-stone-400 shrink-0" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent bookings */}
      {recentBookings.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">
              Recent Bookings
            </h2>
            <Link href="/admin/bookings" className="text-xs text-stone-500 hover:text-stone-700">
              View all →
            </Link>
          </div>
          <div className="bg-white rounded-lg border border-stone-200 divide-y divide-stone-100">
            {recentBookings.map((b) => (
              <div key={b.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-800">{b.name}</p>
                  <p className="text-xs text-stone-400">{b.email}</p>
                </div>
                <Badge
                  variant={
                    b.status === "new"
                      ? "default"
                      : b.status === "read"
                        ? "secondary"
                        : "outline"
                  }
                  className="text-xs capitalize"
                >
                  {b.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
