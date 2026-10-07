import { flushSync } from 'react-dom'

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

export function prefersReduce() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* CSS scroll-driven animations: Chrome/Edge 115+, Safari 26+ (Firefox ships nothing yet). */
export function supportsScrollTimeline() {
  return typeof CSS !== 'undefined' && typeof CSS.supports === 'function'
    ? CSS.supports('animation-timeline: scroll()')
    : false
}

/* Same-document View Transitions (Baseline 2025-10-14). Falls back to a plain update.
   flushSync is required so React has committed the new DOM before the API snapshots it. */
export function withViewTransition(update) {
  if (typeof document === 'undefined' || typeof document.startViewTransition !== 'function' || prefersReduce()) {
    update()
    return
  }
  document.startViewTransition(() => flushSync(update))
}
