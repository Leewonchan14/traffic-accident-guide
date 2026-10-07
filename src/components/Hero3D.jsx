import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { ArrowSquareOutIcon, CaretLeftIcon, CaretRightIcon, CubeIcon, PauseIcon, PlayIcon } from '@phosphor-icons/react'
import SceneBoundary from './SceneBoundary.jsx'
import { scrollToId } from '../utils.js'

const Scene3D = lazy(() => import('./Scene3D.jsx'))

const HERO_STEPS = ['사고 직후', '비상등 · 트렁크', '안전삼각대 설치', '가드레일 밖 대피', '112 · 119 신고']
const DURATION = [2400, 3000, 3200, 3600, 4600]

/* Hero stage: the 3D scene plays the correct action sequence on a loop. */
export default function Hero3D() {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(reduce ? 3 : 0)
  const [playing, setPlaying] = useState(!reduce)
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-10% 0px' })

  useEffect(() => {
    if (reduce || !playing || !inView) return
    const id = window.setTimeout(() => setStep((s) => (s + 1) % HERO_STEPS.length), DURATION[step])
    return () => window.clearTimeout(id)
  }, [step, playing, inView, reduce])

  /* manual navigation always stops the auto loop so the scene can be inspected */
  const go = (delta) => {
    setStep((s) => (s + delta + HERO_STEPS.length) % HERO_STEPS.length)
    setPlaying(false)
  }

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative min-w-0 overflow-hidden rounded-[18px] border border-inkline bg-[#0d1117] shadow-card"
    >
      <div className="h-[320px] sm:h-[380px] lg:h-[500px]">
        <SceneBoundary>
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center gap-2.5 text-[14px] text-[#7c8694]">
                <CubeIcon size={18} className="animate-pulse" aria-hidden="true" />
                3D 장면 준비 중…
              </div>
            }
          >
            <Scene3D
              step={step}
              danger={false}
              preset="hero"
              active={inView}
              autoRotate={!reduce}
              labels={false}
              dpr={[1, 1.5]}
            />
          </Suspense>
        </SceneBoundary>
      </div>

      {/* carousel arrows: left/right edges of the stage */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="이전 장면"
        className="absolute left-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-black/75 md:left-3.5 md:h-10 md:w-10"
      >
        <CaretLeftIcon size={17} weight="bold" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="다음 장면"
        className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/55 text-white backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-black/75 md:right-3.5 md:h-10 md:w-10"
      >
        <CaretRightIcon size={17} weight="bold" aria-hidden="true" />
      </button>

      {/* overlays: buttons stay clickable, the rest passes through to the canvas */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3.5">
        <span className="flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[11.5px] font-bold text-white backdrop-blur-sm">
          <span
            className={`h-1.5 w-1.5 rounded-full bg-accent ${playing ? 'animate-pulse' : 'opacity-45'}`}
            aria-hidden="true"
          />
          {playing ? '자동 재생' : '일시정지'} · {HERO_STEPS[step]}
        </span>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? '자동 재생 일시정지' : '자동 재생 시작'}
          className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white backdrop-blur-sm transition-colors hover:border-white/60"
        >
          {playing ? <PauseIcon size={13} weight="fill" /> : <PlayIcon size={13} weight="fill" />}
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 p-3.5">
        <div className="flex gap-1.5" role="group" aria-label="장면 단계 선택">
          {HERO_STEPS.map((s, i) => (
            <button
              key={s}
              type="button"
              aria-current={step === i ? 'true' : undefined}
              aria-label={s}
              onClick={() => {
                setStep(i)
                setPlaying(false)
              }}
              className={`pointer-events-auto h-1.5 rounded-full transition-all ${
                step === i ? 'w-6 bg-accent' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollToId('simulator')}
          className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-[11.5px] font-bold text-white backdrop-blur-sm transition-colors hover:border-white/60"
        >
          직접 조작해 보기
          <ArrowSquareOutIcon size={12} weight="bold" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  )
}
