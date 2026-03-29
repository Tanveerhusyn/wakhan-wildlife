"use client"

import { useRef, useState } from "react"
import { useInView } from "@/hooks/use-in-view"
import { MapPin, Camera, Mountain, Compass, Plane, Home, ChevronRight, Clock, Binary as Binoculars } from "lucide-react"

const itinerary = [
  {
    day: "01",
    date: "17 March",
    title: "Arrival & Scenic Drive",
    location: "Skardu to Sost",
    duration: "7 hours",
    desc: "Your adventure begins as we pick you up from Skardu Airport. Enjoy a breathtaking drive to our base camp in Sost. Keep your cameras ready for potential sightings of Markhor, Himalayan Ibex, and various bird species along the way.",
    icon: Plane,
    image: "/scenic-mountain-road-winding-through-karakoram-hig.jpg",
  },
  {
    day: "02",
    date: "18 March",
    title: "Acclimatization Day",
    location: "Sost Village",
    duration: "Full day",
    desc: "A vital day for adjusting to the altitude. We will take gentle walks around Sost for sightseeing and to prepare your body for the days ahead. Experience authentic Wakhi hospitality and local culture.",
    icon: Home,
    image: "/traditional-wakhi-village-stone-houses-mountains-p.jpg",
  },
  {
    day: "03-07",
    date: "19-23 March",
    title: "The Search Begins",
    location: "Khunjerab National Park",
    duration: "5 full days",
    desc: "Each day, we venture into Khunjerab National Park (approximately 88km from base camp). Our strategy is dynamic: the main group searches prime habitat while our network of 40+ expert spotters monitors remote valleys for fresh tracks, scrapes, or activity.",
    icon: Binoculars,
    image: "/wildlife-photographers-with-telephoto-lenses-scann.jpg",
    isHighlight: true,
  },
  {
    day: "08",
    date: "24 March",
    title: "Final Search Day",
    location: "Prime Locations",
    duration: "Full day",
    desc: "One last, full-day effort in the park to capture that perfect shot. Our spotters will have identified the most promising locations based on the week's observations and movement patterns.",
    icon: Camera,
    image: "/snow-leopard-habitat-rocky-cliffs-snow-patches-daw.jpg",
  },
  {
    day: "09",
    date: "25 March",
    title: "Return Journey",
    location: "Sost to Skardu",
    duration: "7 hours",
    desc: "We begin our journey back, driving from Sost to Skardu, allowing you to reflect on the incredible experiences of the past week and share stories with fellow expeditioners.",
    icon: Compass,
    image: "/mountain-valley-road-sunset-karakoram-range-panora.jpg",
  },
  {
    day: "10",
    date: "26 March",
    title: "Departure",
    location: "Skardu Airport",
    duration: "Morning",
    desc: "Transfer to Skardu Airport for your flight back to Islamabad, concluding your expedition. Depart with memories—and hopefully images—that will last a lifetime.",
    icon: MapPin,
    image: "/small-aircraft-on-mountain-airstrip-sunrise-dramat.jpg",
  },
]

export function ItinerarySection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { threshold: 0.1 })
  const [activeDay, setActiveDay] = useState(0)

  return (
    <section
      id="itinerary"
      ref={ref}
      className="relative min-h-screen w-full py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md" />

      {/* Mist Effect */}
      <div className="absolute top-1/2 left-1/4 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_50%)]" />
      </div>

      <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`mb-16 transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.4em] text-white/40 mb-4">Your Journey</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white/90 leading-tight">
                10-Day Expedition
                <br />
                <span className="text-white/50">Itinerary</span>
              </h2>
            </div>
            <div className="flex items-center gap-4 text-white/40">
              <Clock className="w-4 h-4" />
              <p className="text-sm font-light">17 – 26 March 2025</p>
            </div>
          </div>
        </div>

        {/* Timeline cards - horizontal scroll on mobile, grid on desktop */}
        <div className="relative">
          {/* Progress line */}
          <div className="hidden lg:block absolute top-[100px] left-0 right-0 h-px bg-white/10">
            <div
              className="h-full bg-white/30 transition-all duration-500"
              style={{ width: `${((activeDay + 1) / itinerary.length) * 100}%` }}
            />
          </div>

          {/* Cards */}
          <div className="flex lg:grid lg:grid-cols-6 gap-4 overflow-x-auto pb-8 lg:pb-0 snap-x snap-mandatory scrollbar-hide">
            {itinerary.map((item, i) => {
              const Icon = item.icon
              const isActive = activeDay === i
              return (
                <button
                  key={item.day}
                  onClick={() => setActiveDay(i)}
                  className={`flex-shrink-0 w-[280px] lg:w-auto snap-center text-left transition-all duration-500 group ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {/* Day marker */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive
                          ? "border-white/60 bg-white/10"
                          : "border-white/20 bg-transparent group-hover:border-white/30"
                        }`}
                    >
                      <span
                        className={`text-xs font-mono transition-colors ${isActive ? "text-white" : "text-white/50"}`}
                      >
                        {item.day.split("-")[0]}
                      </span>
                    </div>
                    <div className="hidden lg:block h-px flex-1 bg-white/10" />
                  </div>

                  {/* Card */}
                  <div
                    className={`relative overflow-hidden rounded-lg transition-all duration-300 ${isActive ? "ring-1 ring-white/20" : ""
                      } ${item.isHighlight ? "lg:col-span-1" : ""}`}
                  >
                    {/* Image */}
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className={`w-full h-full object-cover transition-all duration-700 ${isActive ? "scale-100" : "scale-105 brightness-75"
                          }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent" />

                      {/* Icon badge */}
                      <div
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${isActive ? "bg-white/20" : "bg-black/30"
                          }`}
                      >
                        <Icon className="w-4 h-4 text-white/70" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 bg-zinc-900/80">
                      <p className="text-[9px] uppercase tracking-wider text-white/40 mb-1">{item.date}</p>
                      <h3
                        className={`text-sm font-medium mb-1 transition-colors ${isActive ? "text-white" : "text-white/70"}`}
                      >
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-white/40">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                        <span className="text-white/20">•</span>
                        <span>{item.duration}</span>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Active day detail panel */}
        <div className={`mt-12 transition-all duration-700 ${isInView ? "opacity-100" : "opacity-0"}`}>
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-xl p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Image */}
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <img
                  src={itinerary[activeDay].image || "/placeholder.svg"}
                  alt={itinerary[activeDay].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
                    <Mountain className="w-3 h-3 text-white/70" />
                    <span className="text-[10px] uppercase tracking-wider text-white/70">
                      {itinerary[activeDay].location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl font-light text-white/20">Day {itinerary[activeDay].day}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-light text-white/90 mb-2">{itinerary[activeDay].title}</h3>
                <p className="text-sm text-white/40 mb-6">
                  {itinerary[activeDay].date} • {itinerary[activeDay].duration}
                </p>
                <p className="text-sm text-white/60 leading-relaxed">{itinerary[activeDay].desc}</p>

                {/* Special content for search days */}
                {itinerary[activeDay].day === "03-07" && (
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                      <Camera className="w-5 h-5 text-white/40 mb-2" />
                      <p className="text-xs text-white/70 font-medium">Primary Search</p>
                      <p className="text-[10px] text-white/40 mt-1">Full days in prime leopard habitat</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                      <Binoculars className="w-5 h-5 text-white/40 mb-2" />
                      <p className="text-xs text-white/70 font-medium">Scout Network</p>
                      <p className="text-[10px] text-white/40 mt-1">40+ spotters monitoring valleys</p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex items-center gap-4">
                  <button
                    onClick={() => setActiveDay(Math.max(0, activeDay - 1))}
                    disabled={activeDay === 0}
                    className="px-4 py-2 text-xs uppercase tracking-wider text-white/50 hover:text-white/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex-1 h-px bg-white/10" />
                  <button
                    onClick={() => setActiveDay(Math.min(itinerary.length - 1, activeDay + 1))}
                    disabled={activeDay === itinerary.length - 1}
                    className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors group"
                  >
                    Next Day
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
