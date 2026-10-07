/* Smooth anchor scrolling without scrollIntoView (iframe-safe). */
export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 76,
    behavior: reduce ? 'auto' : 'smooth',
  })
}
