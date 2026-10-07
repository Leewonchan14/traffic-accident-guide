import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { CameraIcon, CheckIcon, CubeIcon } from '@phosphor-icons/react'
import { CHECKLIST } from '../data.jsx'
import SceneBoundary from './SceneBoundary.jsx'
import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'
import { withViewTransition } from '../utils.js'

const PhotoScene = lazy(() => import('./PhotoScene.jsx'))
const STORE_KEY = 'ta-checklist-v2'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '[]')
  } catch {
    return []
  }
}

function StageLoading() {
  return (
    <div className="flex h-full items-center justify-center gap-2.5 text-[13.5px] text-[#7c8694]">
      <CubeIcon size={17} className="animate-pulse" aria-hidden="true" />
      3D 촬영 안내 준비 중…
    </div>
  )
}

export default function Evidence() {
  const reduce = useReducedMotion()
  const [done, setDone] = useState(load)
  const [shotIdx, setShotIdx] = useState(0)

  const stageRef = useRef(null)
  const inView = useInView(stageRef, { margin: '-10% 0px' })
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    if (inView) setSeen(true)
  }, [inView])

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(done))
    } catch {
      /* storage unavailable; state still works for the session */
    }
  }, [done])

  const toggle = (key, index) =>
    withViewTransition(() => {
      setDone((d) => (d.includes(key) ? d.filter((k) => k !== key) : [...d, key]))
      setShotIdx(index)
    })

  const count = done.length
  const pct = Math.round((count / CHECKLIST.length) * 100)
  const current = CHECKLIST[shotIdx]

  return (
    <section id="evidence" aria-labelledby="evidence-title" className="sec sec-white">
      <div className="wrap">
        <SectionHead
          index="05"
          id="evidence-title"
          kicker="사진·증거 체크리스트"
          title="어디서, 무엇을 찍어야 하는지까지 확인하세요"
          lede="사진이 없으면 과실비율 다툼에서 말이 통하지 않습니다. 항목을 고르면 그 촬영 위치와 구도가 3D로 표시됩니다."
        />

        <div className="mb-7 flex flex-wrap items-center gap-5">
          <div
            role="progressbar"
            aria-label="촬영 체크 진행률"
            aria-valuemin={0}
            aria-valuemax={CHECKLIST.length}
            aria-valuenow={count}
            className="h-2.5 min-w-[200px] flex-1 overflow-hidden rounded-full bg-line"
          >
            <motion.div
              className="h-full w-full origin-left rounded-full bg-greenink"
              animate={{ scaleX: pct / 100 }}
              transition={{ type: 'spring', stiffness: 160, damping: 24 }}
            />
          </div>
          <span className="whitespace-nowrap text-[15px] font-bold tabular-nums text-greenink">
            {count} / {CHECKLIST.length}
          </span>
          <button type="button" className="btn btn-sm btn-ghost" onClick={() => setDone([])}>
            저장 초기화
          </button>
        </div>

        <div ref={stageRef} className="mb-7 grid gap-3.5 lg:grid-cols-[1.45fr_1fr]">
          <Reveal className="min-w-0">
            <div className="relative h-full overflow-hidden rounded-[18px] border border-inkline bg-[#0d1117]">
              <div className="h-[320px] md:h-[430px]">
                {seen ? (
                  <SceneBoundary>
                    <Suspense fallback={<StageLoading />}>
                      <PhotoScene
                        variant="overview"
                        shotIndex={shotIdx}
                        onSelect={(i) => withViewTransition(() => setShotIdx(i))}
                        active={inView}
                      />
                    </Suspense>
                  </SceneBoundary>
                ) : (
                  <StageLoading />
                )}
              </div>
              <div className="pointer-events-none absolute left-3.5 top-3.5">
                <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 text-[11.5px] font-bold text-white backdrop-blur-sm">
                  촬영 위치 3D 안내 · 번호를 눌러 보세요
                </span>
              </div>
              <div className="pointer-events-none absolute bottom-3.5 left-3.5 text-[11.5px] text-[#7c8694]">
                드래그: 회전 · 휠/핀치: 확대 · 실제 거리와 도로 구조를 단순화한 장면입니다
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="min-w-0">
            <div className="flex h-full flex-col gap-3">
              <div className="relative overflow-hidden rounded-[18px] border border-inkline bg-black">
                <div className="aspect-[4/3]">
                  {seen ? (
                    <SceneBoundary>
                      <Suspense fallback={<StageLoading />}>
                        <PhotoScene variant="preview" shotIndex={shotIdx} active={inView} />
                      </Suspense>
                    </SceneBoundary>
                  ) : (
                    <StageLoading />
                  )}
                </div>
                {/* viewfinder chrome */}
                <div className="pointer-events-none absolute inset-0">
                  <span className="absolute left-2.5 top-2.5 h-4 w-4 border-l-2 border-t-2 border-white/70" />
                  <span className="absolute right-2.5 top-2.5 h-4 w-4 border-r-2 border-t-2 border-white/70" />
                  <span className="absolute bottom-2.5 left-2.5 h-4 w-4 border-b-2 border-l-2 border-white/70" />
                  <span className="absolute bottom-2.5 right-2.5 h-4 w-4 border-b-2 border-r-2 border-white/70" />
                  <span className="absolute left-3.5 top-3 text-[11.5px] font-bold text-white/90">
                    {shotIdx + 1}번 시점 미리보기
                  </span>
                  <span className="absolute bottom-3 right-3.5 text-[11px] text-white/60 tabular-nums">
                    4:3 · {String(shotIdx + 1).padStart(2, '0')} / {String(CHECKLIST.length).padStart(2, '0')}
                  </span>
                </div>
                {!reduce && (
                  <motion.div
                    key={shotIdx}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="pointer-events-none absolute inset-0 bg-white"
                  />
                )}
              </div>

              <div className="card flex-1 p-4 md:p-5" style={{ viewTransitionName: 'photo-caption' }}>
                <div className="text-[11.5px] font-bold uppercase tracking-[0.08em] text-muted2">현재 시점</div>
                <b className="mt-1.5 block text-[16px]">{current.t}</b>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{current.d}</p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {CHECKLIST.map((c, i) => {
            const on = done.includes(c.key)
            const sel = i === shotIdx
            return (
              <Reveal key={c.key} delay={(i % 2) * 0.05}>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.99 }}
                  aria-pressed={on}
                  onClick={() => toggle(c.key, i)}
                  className={`grid w-full grid-cols-[26px_1fr] items-start gap-3.5 rounded-xl border p-5 text-left transition-colors ${
                    on ? 'border-greenink/35 bg-greentint' : 'border-line bg-paper hover:border-linestrong'
                  } ${sel ? 'ring-2 ring-accent/60' : ''}`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-px flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-colors ${
                      on ? 'border-greenink bg-greenink' : 'border-linestrong bg-white'
                    }`}
                  >
                    <CheckIcon
                      weight="bold"
                      size={13}
                      className={`text-white transition-all duration-150 ${on ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                    />
                  </span>
                  <span>
                    <b className="text-[17.5px] tracking-[-0.02em] md:text-[18.5px]">{c.t}</b>
                    <small className="mt-1.5 block text-[14.5px] leading-relaxed text-muted">{c.d}</small>
                  </span>
                </motion.button>
              </Reveal>
            )
          })}
        </div>

        <p className="mt-4 flex items-center gap-2 text-[13px] text-muted2">
          <CameraIcon size={15} aria-hidden="true" />
          항목을 누르면 체크와 함께 그 시점의 구도가 위 3D 뷰파인더에 표시됩니다. 확인한 항목은 이 브라우저에만
          저장됩니다.
        </p>
      </div>
    </section>
  )
}
