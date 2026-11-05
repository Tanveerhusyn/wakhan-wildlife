// Wakhan Wildlife — small progressive enhancements. The page works without this file.
(() => {
  const doc = document.documentElement
  doc.classList.add("js")
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches

  // nav: solid once the hero is scrolled past
  const nav = document.querySelector(".nav")
  if (nav && !nav.classList.contains("nav--solid")) {
    const onScroll = () => nav.classList.toggle("is-solid", scrollY > 40)
    onScroll()
    addEventListener("scroll", onScroll, { passive: true })
  }

  // mobile menu
  const toggle = document.querySelector(".nav__toggle")
  const setOpen = (open) => {
    doc.classList.toggle("nav-open", open)
    toggle?.setAttribute("aria-expanded", String(open))
  }
  toggle?.addEventListener("click", () => setOpen(!doc.classList.contains("nav-open")))
  document.querySelectorAll(".menu a").forEach((a) => a.addEventListener("click", () => setOpen(false)))
  addEventListener("keydown", (e) => e.key === "Escape" && setOpen(false))

  // reveal on scroll
  const items = document.querySelectorAll(".reveal")
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-in"))
  } else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target) }
      }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    )
    items.forEach((el) => io.observe(el))
    // anything already on screen at load
    requestAnimationFrame(() => items.forEach((el) => {
      if (el.getBoundingClientRect().top < innerHeight) el.classList.add("is-in")
    }))
  }

  // hero video: honour reduced motion, pause while off screen
  const video = document.querySelector(".hero__media video")
  if (video) {
    if (reduce) { video.removeAttribute("autoplay"); video.pause() }
    else {
      new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause())).observe(video)
    }
  }

  // slow parallax on the full-bleed bands
  const bands = [...document.querySelectorAll(".band img")]
  if (bands.length && !reduce) {
    let ticking = false
    const update = () => {
      ticking = false
      for (const img of bands) {
        const r = img.parentElement.getBoundingClientRect()
        if (r.bottom < 0 || r.top > innerHeight) continue
        const p = (r.top + r.height / 2 - innerHeight / 2) / (innerHeight + r.height)
        img.style.transform = `translate3d(0, ${(p * -14).toFixed(2)}%, 0)`
      }
    }
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update) } }, { passive: true })
    update()
  }
})()
