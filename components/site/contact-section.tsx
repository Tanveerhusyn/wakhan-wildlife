"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContactSectionProps {
  settings: Record<string, string>
}

export function ContactSection({ settings }: ContactSectionProps) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", groupSize: "", preferredDates: "", message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Submit failed")
      setStatus("success")
      setForm({ name: "", email: "", phone: "", groupSize: "", preferredDates: "", message: "" })
    } catch {
      setStatus("error")
    }
  }

  const inputCls = "w-full bg-transparent border-b border-[--color-cream]/20 py-2.5 text-[--color-cream] placeholder:text-[--color-cream]/30 text-sm font-body focus:outline-none focus:border-[--color-terracotta] transition-colors"

  return (
    <section id="contact" className="py-24 bg-[--color-charcoal]">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16">
        {/* Left — info */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-8 bg-[--color-terracotta]" />
            <span className="text-[--color-terracotta] text-xs uppercase tracking-[0.2em]">Contact</span>
          </div>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] text-[--color-cream] mb-6">
            Plan Your<br /><em>Expedition</em>
          </h2>
          <p className="font-body text-[--color-cream]/60 leading-relaxed mb-10 max-w-sm">
            Expeditions are available March–April and November–December. Groups are capped at 6 to ensure quality sightings and a genuine wilderness experience.
          </p>

          {/* Contact cards */}
          <div className="space-y-4">
            {settings.contact_email && (
              <div className="flex items-center gap-4">
                <div className="p-2 border border-white/10 rounded-sm">
                  <Mail className="h-4 w-4 text-[--color-terracotta]" />
                </div>
                <div>
                  <p className="text-xs text-[--color-cream]/30 uppercase tracking-widest">Email</p>
                  <a href={`mailto:${settings.contact_email}`} className="text-sm text-[--color-cream]/80 hover:text-[--color-cream] transition-colors">
                    {settings.contact_email}
                  </a>
                </div>
              </div>
            )}
            {settings.contact_phone && (
              <div className="flex items-center gap-4">
                <div className="p-2 border border-white/10 rounded-sm">
                  <Phone className="h-4 w-4 text-[--color-terracotta]" />
                </div>
                <div>
                  <p className="text-xs text-[--color-cream]/30 uppercase tracking-widest">Phone / WhatsApp</p>
                  <p className="text-sm text-[--color-cream]/80">{settings.contact_phone}</p>
                </div>
              </div>
            )}
            {settings.contact_location && (
              <div className="flex items-center gap-4">
                <div className="p-2 border border-white/10 rounded-sm">
                  <MapPin className="h-4 w-4 text-[--color-terracotta]" />
                </div>
                <div>
                  <p className="text-xs text-[--color-cream]/30 uppercase tracking-widest">Base</p>
                  <p className="text-sm text-[--color-cream]/80">{settings.contact_location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick info */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            {settings.best_season && (
              <div className="p-4 border border-white/8">
                <p className="text-xs text-[--color-cream]/30 uppercase tracking-widest mb-1">Best Season</p>
                <p className="text-sm text-[--color-sand]">{settings.best_season}</p>
              </div>
            )}
            {settings.group_sizes && (
              <div className="p-4 border border-white/8">
                <p className="text-xs text-[--color-cream]/30 uppercase tracking-widest mb-1">Group Sizes</p>
                <p className="text-sm text-[--color-sand]">{settings.group_sizes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right — form */}
        <div>
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <CheckCircle2 className="h-12 w-12 text-[--color-olive] mb-4" />
              <h3 className="font-display text-2xl text-[--color-cream] mb-2">Enquiry Received</h3>
              <p className="text-[--color-cream]/60 font-body max-w-xs">
                Thank you. Hussain will be in touch within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your name *"
                    className={inputCls}
                  />
                </div>
                <div>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="Email address *"
                    className={inputCls}
                  />
                </div>
              </div>
              <input
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="Phone / WhatsApp (optional)"
                className={inputCls}
              />
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={form.groupSize}
                  onChange={(e) => setForm((p) => ({ ...p, groupSize: e.target.value }))}
                  className={cn(inputCls, "appearance-none")}
                >
                  <option value="">Group size</option>
                  <option value="Solo">Solo</option>
                  <option value="2 people">2 people</option>
                  <option value="3-4 people">3–4 people</option>
                  <option value="5-6 people">5–6 people</option>
                </select>
                <input
                  value={form.preferredDates}
                  onChange={(e) => setForm((p) => ({ ...p, preferredDates: e.target.value }))}
                  placeholder="Preferred dates"
                  className={inputCls}
                />
              </div>
              <textarea
                value={form.message}
                onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                placeholder="Questions or special requirements"
                rows={4}
                className={cn(inputCls, "resize-none")}
              />

              {status === "error" && (
                <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className={cn(
                  "px-8 py-3.5 font-body text-sm uppercase tracking-widest transition-all duration-300",
                  "bg-[--color-terracotta] text-white hover:bg-[--color-terracotta]/90",
                  status === "loading" && "opacity-60 cursor-wait"
                )}
              >
                {status === "loading" ? "Sending…" : "Send Enquiry"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-6 mt-20 pt-8 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-[--color-cream]/30 font-body">
          © {new Date().getFullYear()} Wakhan Wildlife Tourism. All rights reserved.
        </p>
        <p className="text-xs text-[--color-cream]/20 font-body">{settings.contact_location}</p>
      </div>
    </section>
  )
}
