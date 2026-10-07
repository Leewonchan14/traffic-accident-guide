import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'motion/react'
import { PhoneIcon } from '@phosphor-icons/react'
import { scrollToId } from '../utils.js'

const NAV = [
  ['diagnose', '상황 진단'],
  ['immediate', '즉시 조치'],
  ['highway', '고속도로'],
  ['simulator', '3D 시뮬레이터'],
  ['evidence', '사진·증거'],
  ['never', '주의사항'],
  ['after', '이후 절차'],
  ['contacts', '연락처'],
  ['faq', 'FAQ'],
]

function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const ids = ['top', ...NAV.map(([id]) => id)]
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!sections.length || !('IntersectionObserver' in window)) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id === 'top' ? '' : e.target.id)
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])
  return active
}

export default function Header() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 })
  const active = useActiveSection()

  return (
    <header className="no-print sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="wrap flex h-16 items-center gap-6">
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="flex shrink-0 items-center gap-2.5 text-[15.5px] font-extrabold tracking-[-0.01em] text-ink no-underline"
        >
          <span aria-hidden="true" className="relative h-[26px] w-[26px] rounded-lg bg-ink">
            <span className="absolute left-1/2 top-[6px] h-[14px] w-[3px] -translate-x-1/2 rounded-sm bg-[repeating-linear-gradient(180deg,#fff_0_4px,transparent_4px_7px)]" />
          </span>
          <span className="hidden sm:inline">교통사고 대처 가이드</span>
        </a>

        <nav aria-label="목차" className="hidden min-w-0 items-center gap-0.5 xl:flex">
          {NAV.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => { e.preventDefault(); scrollToId(id) }}
              aria-current={active === id ? 'true' : undefined}
              className={`rounded-xl px-2.5 py-2 text-[13.5px] font-semibold no-underline transition-colors ${
                active === id ? 'bg-accenttint text-accentdeep' : 'text-muted hover:bg-ink/5 hover:text-ink'
              }`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <a className="btn btn-sm btn-accent" href="tel:119">
            <PhoneIcon weight="fill" size={14} aria-hidden="true" />
            119 구급
          </a>
          <a className="btn btn-sm btn-ghost" href="tel:112">112 경찰</a>
        </div>
      </div>
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="h-[2px] origin-left bg-accent"
      />
    </header>
  )
}
