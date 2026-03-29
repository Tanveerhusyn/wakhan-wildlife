import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  weight: ["300", "400", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Wakhan Wildlife Tourism | Snow Leopard Expeditions",
  description:
    "Exclusive Snow Leopard Photo Expeditions in the Heart of the Karakoram. Journey into the realm of the mountain ghost with expert local guides.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
