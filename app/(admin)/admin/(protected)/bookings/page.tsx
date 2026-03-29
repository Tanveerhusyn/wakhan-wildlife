"use client"

import { useEffect, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/admin/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import type { Booking } from "@/lib/db/schema"

type StatusFilter = "all" | "new" | "read" | "archived"

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    new: "bg-amber-100 text-amber-700",
    read: "bg-blue-100 text-blue-700",
    archived: "bg-stone-100 text-stone-500",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${variants[status] ?? ""}`}>
      {status}
    </span>
  )
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<StatusFilter>("all")
  const [selected, setSelected] = useState<Booking | null>(null)

  async function load(status: StatusFilter) {
    const url = status === "all" ? "/api/bookings" : `/api/bookings?status=${status}`
    const data = await fetch(url).then((r) => r.json())
    setBookings(data)
  }

  useEffect(() => { load(filter) }, [filter])

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    load(filter)
  }

  const columns: ColumnDef<Booking>[] = [
    {
      accessorKey: "submittedAt",
      header: "Date",
      cell: ({ row }) => {
        const d = new Date(row.getValue("submittedAt"))
        return <span className="text-stone-500 text-sm">{d.toLocaleDateString()}</span>
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <button className="text-sm font-medium text-stone-800 hover:underline text-left" onClick={() => setSelected(row.original)}>
          {row.getValue("name")}
        </button>
      ),
    },
    { accessorKey: "email", header: "Email", cell: ({ row }) => <span className="text-sm text-stone-600">{row.getValue("email")}</span> },
    { accessorKey: "groupSize", header: "Group", cell: ({ row }) => <span className="text-sm text-stone-500">{row.getValue("groupSize") || "—"}</span> },
    { accessorKey: "preferredDates", header: "Dates", cell: ({ row }) => <span className="text-sm text-stone-500">{row.getValue("preferredDates") || "—"}</span> },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.getValue("status")} /> },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => updateStatus(row.original.id, "read")}>Mark as Read</DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatus(row.original.id, "archived")}>Archive</DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateStatus(row.original.id, "new")}>Mark as New</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl font-semibold text-stone-900">Bookings</h1>
        <p className="mt-1 text-sm text-stone-500">Expedition enquiries submitted via the contact form.</p>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as StatusFilter)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataTable columns={columns} data={bookings} />

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selected.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2"><span className="text-stone-500 w-28">Email</span><span>{selected.email}</span></div>
              {selected.phone && <div className="flex gap-2"><span className="text-stone-500 w-28">Phone</span><span>{selected.phone}</span></div>}
              {selected.groupSize && <div className="flex gap-2"><span className="text-stone-500 w-28">Group Size</span><span>{selected.groupSize}</span></div>}
              {selected.preferredDates && <div className="flex gap-2"><span className="text-stone-500 w-28">Preferred Dates</span><span>{selected.preferredDates}</span></div>}
              {selected.message && (
                <div>
                  <p className="text-stone-500 mb-1">Message</p>
                  <p className="bg-stone-50 rounded p-3 text-stone-700 whitespace-pre-wrap">{selected.message}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => { updateStatus(selected.id, "read"); setSelected(null) }}>
                  Mark Read
                </Button>
                <Button size="sm" variant="outline" onClick={() => { updateStatus(selected.id, "archived"); setSelected(null) }}>
                  Archive
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
