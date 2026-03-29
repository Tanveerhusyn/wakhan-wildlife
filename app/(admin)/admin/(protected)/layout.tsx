import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AdminSidebarNav } from "@/components/admin/sidebar-nav"
import { Toaster } from "@/components/ui/sonner"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/admin/login")

  return (
    <div className="admin-light min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-stone-200 bg-white flex flex-col min-h-screen sticky top-0">
        <AdminSidebarNav />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-8">
        {children}
      </main>

      <Toaster />
    </div>
  )
}
