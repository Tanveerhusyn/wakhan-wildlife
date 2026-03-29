"use client"

import { useEffect, useRef } from "react"

export function SnowParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    interface Particle { x: number; y: number; r: number; speed: number; drift: number; opacity: number }
    let particles: Particle[] = []

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const count = Math.floor((canvas.width * canvas.height) / 25000)
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.4 + 0.1,
        drift: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.1,
      }))
    }

    function draw() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,252,245,${p.opacity})`
        ctx.fill()
        p.y += p.speed
        p.x += p.drift
        if (p.y > canvas.height) { p.y = -5; p.x = Math.random() * canvas.width }
        if (p.x > canvas.width) p.x = 0
        if (p.x < 0) p.x = canvas.width
      }
      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener("resize", resize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 opacity-60"
      aria-hidden="true"
    />
  )
}
