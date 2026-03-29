"use client"

import type React from "react"

import { useRef, useState } from "react"
import { useInView } from "@/hooks/use-in-view"
import { MapPin, Mail, Phone, MessageSquare, Send, Users, Calendar } from "lucide-react"

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.2 })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    groupSize: "",
    preferredDates: "",
    message: "",
  })
  const [isHovered, setIsHovered] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Booking inquiry:", formData)
  }

  return (
    <section id="contact" ref={ref} className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24 py-24">
        <div className="max-w-6xl mx-auto w-full">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
          >
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/50 mb-6">Book Your Expedition</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white/95 leading-[1.1] mb-6">
              Begin Your <em className="italic text-white/60">Journey</em>
            </h2>
            <p className="text-sm text-white/50 max-w-lg mx-auto">
              Ready to track the mountain ghost? Fill out the form below and our team will get back to you within 24
              hours with availability and next steps.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left - Contact Info */}
            <div
              className={`lg:col-span-2 space-y-8 transition-all duration-1000 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
            >
              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg group-hover:border-white/20 transition-colors">
                    <Mail className="w-5 h-5 text-white/50" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Email</p>
                    <a
                      href="mailto:info@wakhanwildlife.com"
                      className="text-sm text-white/80 hover:text-white transition-colors"
                    >
                      info@wakhanwildlife.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg group-hover:border-white/20 transition-colors">
                    <Phone className="w-5 h-5 text-white/50" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Phone / WhatsApp</p>
                    <a href="tel:+923001234567" className="text-sm text-white/80 hover:text-white transition-colors">
                      +92 300 123 4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg group-hover:border-white/20 transition-colors">
                    <MapPin className="w-5 h-5 text-white/50" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Base Location</p>
                    <p className="text-sm text-white/80">
                      Sost, Gilgit-Baltistan
                      <br />
                      Pakistan
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick info cards */}
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white/[0.03] rounded-lg border border-white/5">
                  <Users className="w-5 h-5 text-white/40" />
                  <div>
                    <p className="text-xs text-white/70">Group Sizes</p>
                    <p className="text-[10px] text-white/40">Solo, pairs, or small groups (3-6)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/[0.03] rounded-lg border border-white/5">
                  <Calendar className="w-5 h-5 text-white/40" />
                  <div>
                    <p className="text-xs text-white/70">Best Season</p>
                    <p className="text-[10px] text-white/40">March – April, November – December</p>
                  </div>
                </div>
              </div>

              {/* Response time note */}
              <div className="flex items-start gap-3">
                <MessageSquare className="w-4 h-4 text-white/40 mt-0.5" />
                <p className="text-xs text-white/40 leading-relaxed">
                  We typically respond within 24 hours. For urgent inquiries, please call or WhatsApp directly.
                </p>
              </div>
            </div>

            {/* Right - Booking/Contact Form */}
            <div
              className={`lg:col-span-3 transition-all duration-1000 delay-300 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
            >
              <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 rounded-xl p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/50 mb-2 block">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/50 mb-2 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/50 mb-2 block">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/50 mb-2 block">Group Size</label>
                    <select
                      value={formData.groupSize}
                      onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white/90 focus:outline-none focus:border-white/30 transition-colors"
                    >
                      <option value="" className="bg-zinc-900">
                        Select...
                      </option>
                      <option value="solo" className="bg-zinc-900">
                        Solo ($7,000)
                      </option>
                      <option value="two" className="bg-zinc-900">
                        Two ($3,700/person)
                      </option>
                      <option value="group" className="bg-zinc-900">
                        Group 3+ ($3,300/person)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-white/50 mb-2 block">
                      Preferred Dates
                    </label>
                    <input
                      type="text"
                      value={formData.preferredDates}
                      onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="e.g., March 2025"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-wider text-white/50 mb-2 block">
                    Message / Questions
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
                    placeholder="Tell us about your travel plans, experience level, photography goals, specific questions, or any special requirements..."
                  />
                </div>

                <button
                  type="submit"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-lg py-4 text-sm uppercase tracking-wider text-white/90 transition-all duration-300 group"
                >
                  <span>Send Inquiry</span>
                  <Send className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
                </button>

                <p className="text-[10px] text-white/30 text-center">
                  We will respond within 24 hours with availability and booking details.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-1000 delay-500 ${isInView ? "opacity-100" : "opacity-0"
            }`}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">Wakhan Wildlife Tourism</span>
          <div className="h-px w-full md:w-auto md:flex-1 max-w-xs bg-white/5" />
          <span className="text-[10px] text-white/30">Since 2014 | Gilgit-Baltistan, Pakistan</span>
        </div>
      </div>
    </section>
  )
}
