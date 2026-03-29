"use client"

interface KenBurnsImageProps {
  src: string
  alt: string
  direction?: "left" | "right" | "up" | "down"
}

export function KenBurnsImage({ src, alt, direction = "left" }: KenBurnsImageProps) {
  const transforms = {
    left: "animate-ken-burns-left",
    right: "animate-ken-burns-right",
    up: "animate-ken-burns-up",
    down: "animate-ken-burns-down",
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${transforms[direction]}`}
      />
    </div>
  )
}
