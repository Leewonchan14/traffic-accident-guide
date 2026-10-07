import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { CameraIcon, CheckIcon } from '@phosphor-icons/react'
import { CHECKLIST } from '../data.jsx'
import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'

const STORE_KEY = 'ta-checklist-v2'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '[]')
  } catch {
    return []
  }
}

export default function Evidence() {
  const [done, setDone] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(done))
    } catch {
      /* storage unavailable; state still works for the session */
    }
  }, [done])

  const toggle = (key) =>
    setDone((d) => (d.includes(key) ? d.filter((k) => k !== key) : [...d, key]))

  const count = done.length
  const pct = Math.round((count / CHECKLIST.length) * 100)

  return (
    <section id="evidence" aria-labelledby="evidence-title" className="border-y border-line bg-surface py-16 md:py-24">
      <div className="wrap">
        <SectionHead
          id="evidence-title"
          kicker="사진·증거 체크리스트"
          title="이 장면들은 반드시 찍어 두세요"
          lede="사진이 없으면 과실비율 다툼에서 말이 통하지 않습니다. 확인한 항목은 이 브라우저에 저장됩니다."
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
              className="h-full rounded-full bg-greenink"
              animate={{ width: `${pct}%` }}
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

        <div className="grid gap-3 md:grid-cols-2">
          {CHECKLIST.map((c, i) => {
            const on = done.includes(c.key)
            return (
              <Reveal key={c.key} delay={(i % 2) * 0.05}>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.99 }}
                  aria-pressed={on}
                  onClick={() => toggle(c.key)}
                  className={`grid w-full grid-cols-[26px_1fr] items-start gap-3.5 rounded-[18px] border p-5 text-left transition-colors ${
                    on ? 'border-greenink/35 bg-greentint' : 'border-line bg-paper hover:border-linestrong'
                  }`}
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
                    <b className="text-[16px]">{c.t}</b>
                    <small className="mt-1 block text-[13.5px] text-muted">{c.d}</small>
                  </span>
                </motion.button>
              </Reveal>
            )
          })}
        </div>

        <p className="mt-4 flex items-center gap-2 text-[13px] text-muted2">
          <CameraIcon size={15} aria-hidden="true" />
          확인한 항목은 이 브라우저에만 저장됩니다. 서버로 전송되지 않습니다.
        </p>
      </div>
    </section>
  )
}
