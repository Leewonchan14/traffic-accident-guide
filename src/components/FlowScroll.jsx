import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { CaretDownIcon } from '@phosphor-icons/react'
import { FLOW } from '../data.jsx'
import { prefersReduce } from '../utils.js'

/* "이후 절차" 스크롤 스토리.
   GSAP(2025년부터 무료) ScrollTrigger로 단계를 고정(pin)하고 스크롤에 맞춰 진행하며,
   SplitText로 제목을 키네틱 타이포그래피로 다시 그립니다.
   GSAP을 불러오지 못하거나 동작 줄이기 설정이면 같은 내용을 정적 카드 목록으로 보여줍니다.
   WebGL은 쓰지 않습니다(3D는 히어로 한 곳에만). */
export default function FlowScroll() {
  const reduce = useReducedMotion()
  const rootRef = useRef(null)
  const titleRef = useRef(null)
  const libRef = useRef(null)
  /* 50% 미리 감지해 GSAP을 먼저 준비 (레이아웃 전환을 사용자가 보지 않도록) */
  const near = useInView(rootRef, { margin: '0px 0px 50% 0px' })
  const [pinned, setPinned] = useState(false)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (reduce || !near || libRef.current) return
    let killed = false
    ;(async () => {
      try {
        const [g, s] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')])
        if (killed) return
        const gsap = g.gsap ?? g.default
        const ScrollTrigger = s.ScrollTrigger ?? s.default
        gsap.registerPlugin(ScrollTrigger)
        libRef.current = { gsap, ScrollTrigger }
        setPinned(true)
      } catch {
        /* 오프라인 등으로 불러오지 못하면 정적 목록 유지 */
      }
    })()
    return () => {
      killed = true
    }
  }, [near, reduce])

  useEffect(() => {
    const lib = libRef.current
    const root = rootRef.current
    if (!pinned || !lib || !root) return
    const { gsap, ScrollTrigger } = lib
    const triggers = []
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-flow-step]').forEach((el, i) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: 'top center',
            end: 'bottom center',
            onToggle: (self) => {
              if (self.isActive) setActive(i)
            },
          }),
        )
      })
    }, root)
    ScrollTrigger.refresh()
    const current = triggers.findIndex((t) => t.isActive)
    if (current >= 0) setActive(current)
    return () => ctx.revert()
  }, [pinned])

  /* 단계가 바뀔 때 제목을 글자 단위로 다시 그린다 */
  useEffect(() => {
    const lib = libRef.current
    const el = titleRef.current
    if (!pinned || !lib || !el) return
    let killed = false
    let split
    let anim
    ;(async () => {
      try {
        const mod = await import('gsap/SplitText')
        if (killed) return
        const SplitText = mod.SplitText ?? mod.default
        lib.gsap.registerPlugin(SplitText)
        split = new SplitText(el, { type: 'chars' })
        anim = lib.gsap.from(split.chars, {
          opacity: 0,
          yPercent: 55,
          duration: 0.45,
          stagger: 0.015,
          ease: 'power2.out',
        })
      } catch {
        /* 키네틱 효과만 생략 */
      }
    })()
    return () => {
      killed = true
      anim?.kill()
      split?.revert()
    }
  }, [active, pinned])

  const jumpTo = (i) => {
    const el = rootRef.current?.querySelector(`[data-flow-step="${i}"]`)
    if (!el) return
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4,
      behavior: prefersReduce() ? 'auto' : 'smooth',
    })
  }

  if (!pinned) {
    return (
      <div ref={rootRef} className="mb-11 grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
        {FLOW.map((f, i) => (
          <div key={f.t} className="card px-4 py-4.5">
            <span className="text-[11.5px] font-extrabold tracking-[0.08em] text-accent">STEP {i + 1}</span>
            <b className="mt-2 block text-[15px]">{f.t}</b>
            <small className="mt-1.5 block text-[12.8px] leading-relaxed text-muted">{f.d}</small>
          </div>
        ))}
      </div>
    )
  }

  const step = FLOW[active]

  return (
    <div ref={rootRef} className="relative mb-11">
      <div className="flow-stage z-10 overflow-hidden rounded-[18px] border border-line bg-surface p-6 shadow-card md:p-8">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-2 select-none text-[64px] font-extrabold leading-none tracking-[-0.04em] text-line md:right-8 md:text-[88px]"
        >
          {String(active + 1).padStart(2, '0')}
        </span>

        <div className="flex items-baseline gap-2.5">
          <span className="text-[12.5px] font-extrabold tracking-[0.1em] text-accent">
            STEP {String(active + 1).padStart(2, '0')}
          </span>
          <span className="text-[12.5px] font-bold text-muted2 tabular-nums">/ {FLOW.length}</span>
        </div>

        <b key={active} ref={titleRef} className="mt-3 block text-[27px] leading-[1.2] md:text-[38px]">
          {step.t}
        </b>
        <p className="mt-3 max-w-[52ch] text-[15.5px] text-muted md:text-[17px]">{step.d}</p>

        <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full w-full origin-left rounded-full bg-accent"
            animate={{ scaleX: (active + 1) / FLOW.length }}
            transition={{ type: 'spring', stiffness: 170, damping: 26 }}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <ol className="m-0 flex list-none flex-wrap gap-2 p-0">
            {FLOW.map((f, i) => (
              <li key={f.t}>
                <button
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-current={i === active ? 'step' : undefined}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                    i === active
                      ? 'border-ink bg-ink text-white'
                      : 'border-linestrong text-muted hover:border-ink hover:text-ink'
                  }`}
                >
                  {i + 1}. {f.t}
                </button>
              </li>
            ))}
          </ol>
          <span className="hidden shrink-0 items-center gap-1.5 text-[12.5px] font-semibold text-muted2 lg:flex">
            스크롤하면 다음 단계로
            <CaretDownIcon size={12} weight="bold" aria-hidden="true" />
          </span>
        </div>
      </div>

      <ol data-pinned="true" className="flow-steps m-0 list-none p-0">
        {FLOW.map((f, i) => (
          <li key={f.t} data-flow-step={i} aria-hidden="true" />
        ))}
      </ol>
    </div>
  )
}
