import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import {
  ArrowCounterClockwiseIcon,
  CubeIcon,
  PauseIcon,
  PlayIcon,
  WarningIcon,
} from '@phosphor-icons/react'
import SceneBoundary from './SceneBoundary.jsx'
import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'
import { withViewTransition } from '../utils.js'

const Scene3D = lazy(() => import('./Scene3D.jsx'))

const STEP_MS = 4200

const STEPS = [
  {
    t: '사고 직후',
    d: '두 차량이 멈춘 상태입니다. 이 순간부터 후속 차량에 의한 2차 사고 위험이 시작됩니다.',
    law: '곧바로 정차·비상등 단계로 넘어갑니다. (도로교통법 제54조 제1항)',
  },
  {
    t: '비상등 · 트렁크',
    d: '비상등을 켜고 트렁크를 열어 후속 차량이 멀리서도 정차 상태를 알아볼 수 있게 합니다.',
    law: '도로교통법 제66조, 시행규칙 제40조',
  },
  {
    t: '안전삼각대 설치',
    d: '차량 뒤 100m 지점에 고장자동차 표지를 설치합니다. 야간에는 사방 500m에서 보이는 적색 섬광신호나 불꽃신호를 추가합니다.',
    law: '도로교통법 제66조, 시행규칙 제40조 (미설치 시 범칙금 부과 대상)',
  },
  {
    t: '가드레일 밖 대피',
    d: '탑승자 전원이 가드레일 밖 안전한 곳으로 이동합니다. 차 안 대기와 갓길 대기는 모두 위험합니다.',
    dDanger:
      '위험 시나리오: 탑승자가 차로 옆에 서 있습니다. 후속 차량이 정차 차량을 발견하지 못하면 그대로 추돌합니다.',
    law: '고속도로 2차 사고 치명률은 일반 고속도로 사고의 약 5배 (한국도로공사)',
  },
  {
    t: '112 · 119 신고',
    d: '안전을 확보한 뒤 경찰(112)·구급(119)·도로공사(1588-2504)에 사고 위치와 피해 상황을 신고합니다.',
    law: '도로교통법 제54조 제2항. 사상자 발생 시 신고는 의무입니다.',
  },
]

const CAMERAS = [
  ['total', '전체 뷰'],
  ['back', '후방 뷰'],
  ['top', '탑 뷰'],
]

export default function Simulator3D() {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [danger, setDanger] = useState(false)
  const [preset, setPreset] = useState('total')
  const [hit, setHit] = useState(false)
  const hitTimer = useRef(null)
  const stageRef = useRef(null)
  const inView = useInView(stageRef, { margin: '-15% 0px' })

  /* advance the timeline while playing and visible */
  useEffect(() => {
    if (!playing || !inView) return
    if (step >= STEPS.length - 1) {
      setPlaying(false)
      return
    }
    const id = window.setTimeout(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), STEP_MS)
    return () => window.clearTimeout(id)
  }, [playing, step, inView])

  useEffect(() => () => window.clearTimeout(hitTimer.current), [])

  const onHit = useCallback(() => {
    setHit(true)
    window.clearTimeout(hitTimer.current)
    hitTimer.current = window.setTimeout(() => setHit(false), 1700)
  }, [])

  const current = STEPS[step]
  const desc = danger && step === 3 && current.dDanger ? current.dDanger : current.d

  return (
    <section id="simulator" aria-labelledby="simulator-title" className="sec sec-dark">
      <div className="wrap">
        <SectionHead
          dark
          index="04"
          id="simulator-title"
          kicker="3D 시뮬레이터"
          title="행동을 순서대로, 눈으로 확인하세요"
          lede="사고 직후부터 신고까지를 3D 장면으로 재생합니다. 드래그로 시점을 돌리고, 차로 대기 시나리오로 위험을 비교해 보세요."
        />

        <div className="grid gap-3.5 lg:grid-cols-[1.55fr_1fr]">
          <Reveal className="min-w-0">
            <div
              ref={stageRef}
              className="relative overflow-hidden rounded-[18px] border border-inkline bg-[#0d1117]"
            >
              <div className="h-[340px] md:h-[460px]">
                <SceneBoundary>
                  <Suspense
                    fallback={
                      <div className="flex h-full items-center justify-center gap-2.5 text-[14.5px] text-[#7c8694]">
                        <CubeIcon size={18} className="animate-pulse" aria-hidden="true" />
                        3D 장면 준비 중…
                      </div>
                    }
                  >
                    <Scene3D step={step} danger={danger} preset={preset} onHit={onHit} active={inView} />
                  </Suspense>
                </SceneBoundary>
              </div>

              {/* overlays */}
              <div className="pointer-events-none absolute left-3.5 top-3.5 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[11.5px] font-bold text-white backdrop-blur-sm">
                  {String(step + 1).padStart(2, '0')} · {current.t}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[11.5px] font-bold ${
                    danger ? 'bg-[#ff4d4d] text-white' : 'bg-greenink text-white'
                  }`}
                >
                  {danger ? '위험 시나리오' : '올바른 행동'}
                </span>
              </div>

              <AnimatePresence>
                {hit && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  >
                    <span className="flex items-center gap-2 rounded-xl border border-[#ff4d4d]/60 bg-[#2a1214]/90 px-4 py-2.5 text-[15px] font-extrabold text-[#ff9a9c]">
                      <WarningIcon size={18} weight="fill" aria-hidden="true" />
                      2차 사고 발생! 차로 대기는 이렇게 끝납니다
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pointer-events-none absolute bottom-3.5 left-3.5 text-[11.5px] text-[#7c8694]">
                드래그: 회전 · 휠/핀치: 확대 · 실제 거리와 도로 구조를 단순화한 장면입니다
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {CAMERAS.map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPreset(key)}
                  aria-pressed={preset === key}
                  className={`rounded-full border px-3.5 py-1.5 text-[14px] font-semibold transition-colors ${
                    preset === key
                      ? 'border-white/50 bg-white/15 text-white'
                      : 'border-inkline text-[#aeb7c2] hover:border-white/30 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.07} className="min-w-0">
            <div className="flex h-full flex-col rounded-[18px] border border-inkline bg-inksoft p-5 md:p-6">
              <ol className="m-0 grid list-none gap-2 p-0">
                {STEPS.map((s, i) => (
                  <li key={s.t}>
                    <button
                      type="button"
                      onClick={() =>
                        withViewTransition(() => {
                          setStep(i)
                          setPlaying(false)
                        })
                      }
                      aria-current={step === i ? 'step' : undefined}
                      className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                        step === i
                          ? 'border-white/25 bg-white/10'
                          : 'border-transparent hover:border-inkline hover:bg-white/5'
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11.5px] font-extrabold tabular-nums ${
                          step >= i ? 'bg-accent text-white' : 'bg-[#2a323c] text-[#7c8694]'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className={`text-[16px] font-bold tracking-[-0.01em] ${step === i ? 'text-white' : 'text-[#c3cad3]'}`}>
                        {s.t}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#2a323c]">
                <motion.div
                  key={`${step}-${playing}-${inView}`}
                  className="h-full w-full origin-left rounded-full bg-accent"
                  initial={{ scaleX: playing && inView ? 0 : 1 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: playing && inView ? STEP_MS / 1000 : 0.3, ease: 'linear' }}
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-accent"
                  onClick={() => {
                    if (step >= STEPS.length - 1) setStep(0)
                    setPlaying((p) => !p)
                  }}
                >
                  {playing ? (
                    <PauseIcon size={14} weight="fill" aria-hidden="true" />
                  ) : (
                    <PlayIcon size={14} weight="fill" aria-hidden="true" />
                  )}
                  {playing ? '일시정지' : step >= STEPS.length - 1 ? '다시 재생' : '재생'}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-4 py-2 text-[14.5px] font-bold text-[#c3cad3] transition-colors hover:border-white/60 hover:text-white active:translate-y-px"
                  onClick={() => {
                    setStep(0)
                    setPlaying(false)
                  }}
                >
                  <ArrowCounterClockwiseIcon size={14} weight="bold" aria-hidden="true" />
                  처음으로
                </button>
              </div>

              <div className="mt-5 border-t border-inkline pt-4">
                <div className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#7c8694]">
                  시나리오
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => withViewTransition(() => setDanger(false))}
                    aria-pressed={!danger}
                    className={`rounded-xl border px-3 py-2.5 text-[14.5px] font-bold transition-colors ${
                      !danger
                        ? 'border-greenink/60 bg-greenink/20 text-[#8fe6b8]'
                        : 'border-inkline text-[#aeb7c2] hover:border-white/30'
                    }`}
                  >
                    올바른 행동
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      withViewTransition(() => {
                        setDanger(true)
                        if (step < 3) setStep(3)
                        setPlaying(false)
                      })
                    }
                    aria-pressed={danger}
                    className={`rounded-xl border px-3 py-2.5 text-[14.5px] font-bold transition-colors ${
                      danger
                        ? 'border-[#ff4d4d]/60 bg-[#ff4d4d]/20 text-[#ff9a9c]'
                        : 'border-inkline text-[#aeb7c2] hover:border-white/30'
                    }`}
                  >
                    위험: 차로 대기
                  </button>
                </div>
                <p className="mt-3 text-[14px] leading-relaxed text-[#aeb7c2]">
                  위험 시나리오를 켜면 대피 단계에서 탑승자가 차로에 남아 있고, 후속 차량이 그대로 접근하는
                  장면을 볼 수 있습니다.
                </p>
              </div>

              <div
                className="mt-5 flex-1 rounded-xl border border-inkline bg-[#161b22] p-4"
                style={{ viewTransitionName: 'sim-desc' }}
              >
                <div className="text-[18px] font-bold tracking-[-0.02em] text-white md:text-[19px]">{current.t}</div>
                <p className="mt-2 text-[15px] leading-relaxed text-[#aeb7c2]">{desc}</p>
                <span className="mt-3 block text-[13px] text-[#7c8694]">{current.law}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
