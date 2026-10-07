import { motion, useReducedMotion } from 'motion/react'
import { supportsScrollTimeline } from '../utils.js'

/* Scroll-triggered entrance used across sections.
   Chrome/Edge/Safari run it on the compositor through CSS scroll-driven animations
   (zero JS per frame); Firefox, which ships no animation-timeline yet, keeps the JS path. */
export default function Reveal({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion()

  if (!reduce && supportsScrollTimeline()) {
    return <div className={className ? `sd-reveal ${className}` : 'sd-reveal'}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}
