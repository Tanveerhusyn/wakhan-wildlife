"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Image,
  BarChart3,
  Map,
  Users,
  BookOpen,
  DollarSign,
  Globe,
  Inbox,
  Mountain,
  Camera,
  LogOut,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sectionLinks = [
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

export function AdminSidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-stone-200">
        <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">
          Wakhan Wildlife
        </p>
        <p className="text-sm font-semibold text-stone-800 mt-0.5">
          Content Manager
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {/* Dashboard */}
        <div>
          <NavItem
            href="/admin/dashboard"
            label="Dashboard"
            icon={LayoutDashboard}
            active={pathname === "/admin/dashboard"}
          />
        </div>

        {/* Site Content */}
        <div>
          <p className="px-3 mb-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Site Content
          </p>
          <div className="space-y-0.5">
            {sectionLinks.map((link) => (
              <NavItem
                key={link.href}
                href={link.href}
                label={link.label}
                icon={link.icon}
                active={pathname === link.href}
              />
            ))}
          </div>
        </div>

        {/* Other */}
        <div>
          <p className="px-3 mb-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Manage
          </p>
          <div className="space-y-0.5">
            <NavItem
              href="/admin/bookings"
              label="Bookings"
              icon={Inbox}
              active={pathname === "/admin/bookings"}
            />
            <NavItem
              href="/admin/media"
              label="Media Library"
              icon={Image}
              active={pathname === "/admin/media"}
            />
          </div>
        </div>
      </div>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-stone-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-stone-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </nav>
  )
}

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
        active
          ? "bg-stone-100 text-stone-900 font-medium"
          : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1">{label}</span>
      {active && <ChevronRight className="h-3.5 w-3.5 text-stone-400" />}
    </Link>
  )
}
