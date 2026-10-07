import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CheckIcon, PhoneIcon, WarningOctagonIcon } from '@phosphor-icons/react'
import { CALLS, PLAN_QUESTIONS, buildPlan } from '../data.jsx'
import SectionHead from './SectionHead.jsx'

const Q_KEYS = PLAN_QUESTIONS.map((q) => q.id)

function QuestionRow({ q, index, selected, onSelect }) {
  const done = Boolean(selected)
  return (
    <div className="grid items-center gap-3.5 border-b border-line px-5 py-6 last:border-b-0 md:grid-cols-[220px_1fr] md:gap-5 md:px-6.5">
      <div className="flex items-center gap-2.5 text-[15.5px] font-bold">
        <span
          className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full text-[11.5px] font-extrabold tabular-nums ${
            done ? 'bg-greenink text-white' : 'bg-ink text-white'
          }`}
        >
          {done ? <CheckIcon weight="bold" size={12} aria-hidden="true" /> : index + 1}
        </span>
        {q.label}
      </div>
      <div role="group" aria-label={q.label} className="flex flex-wrap gap-2.5">
        {q.options.map((o) => {
          const isSel = selected === o.v
          return (
            <motion.button
              key={o.v}
              type="button"
              whileTap={{ scale: 0.97 }}
              aria-pressed={isSel}
              onClick={() => onSelect(q.id, o.v)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[14.5px] font-semibold transition-colors ${
                isSel
                  ? 'border-ink bg-ink text-white'
                  : 'border-linestrong bg-surface text-ink hover:border-ink'
              }`}
            >
              {isSel && <CheckIcon weight="bold" size={13} aria-hidden="true" />}
              {o.label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

function PlanStep({ step, i }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
      className="grid grid-cols-[34px_1fr] gap-3.5 border-t border-line py-4 first:border-t-0 first:pt-1"
    >
      <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-accent text-[13.5px] font-extrabold tabular-nums text-white">
        {i + 1}
      </span>
      <div>
        <b className="block text-[16px]">{step.t}</b>
        <p className="mt-1 text-[14.5px] text-muted">{step.d}</p>
        {step.tel && (
          <span className="mt-2.5 flex flex-wrap gap-2">
            {step.tel.map((c) => (
              <a key={c} className="btn btn-sm btn-accent" href={CALLS[c].href}>
                <PhoneIcon weight="fill" size={13} aria-hidden="true" />
                {CALLS[c].label}
              </a>
            ))}
          </span>
        )}
        {step.law && <span className="law">{step.law}</span>}
      </div>
    </motion.li>
  )
}

export default function Diagnose() {
  const [answers, setAnswers] = useState({})
  const reduce = useReducedMotion()
  const answered = Q_KEYS.filter((k) => answers[k]).length
  const complete = answered === Q_KEYS.length
  const plan = complete ? buildPlan(answers) : null

  const select = (qid, v) => setAnswers((a) => ({ ...a, [qid]: v }))
  const reset = () => setAnswers({})

  return (
    <section id="diagnose" aria-labelledby="diagnose-title" className="border-y border-line bg-surface py-16 md:py-24">
      <div className="wrap">
        <SectionHead
          id="diagnose-title"
          kicker="상황 진단"
          title="세 가지만 고르면, 지금 할 일이 나옵니다"
          lede="선택에 따라 신고 의무와 우선순위가 달라집니다. 결과는 도로교통법 조문 기준으로 구성됩니다."
        />

        <div className="overflow-hidden rounded-[18px] border border-line bg-paper">
          {PLAN_QUESTIONS.map((q, i) => (
            <QuestionRow key={q.id} q={q} index={i} selected={answers[q.id]} onSelect={select} />
          ))}

          <div className="border-t border-line bg-surface p-6 md:px-6.5" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {!complete ? (
                <motion.p
                  key="hint"
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  className="flex min-h-16 items-center gap-2 text-[15.5px] text-muted"
                >
                  질문에 답하면 맞춤 조치가 여기에 표시됩니다. 남은 질문:
                  <b className="text-ink">{Q_KEYS.length - answered}</b>개
                </motion.p>
              ) : (
                <motion.div
                  key={JSON.stringify(answers)}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <strong className="text-[16px]">지금 해야 할 일 {plan.steps.length}단계</strong>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={reset}>
                      다시 선택
                    </button>
                  </div>
                  {plan.alert && (
                    <div
                      className={`mt-4 flex gap-3 rounded-xl border p-4 text-[14.5px] leading-relaxed ${
                        plan.alert.type === 'danger'
                          ? 'border-accent/25 bg-accenttint text-accentdeep'
                          : 'border-amberink/25 bg-ambertint text-amberink'
                      }`}
                    >
                      <WarningOctagonIcon weight="fill" size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                      <span>{plan.alert.text}</span>
                    </div>
                  )}
                  <ol className="mt-5 list-none p-0">
                    {plan.steps.map((s, i) => (
                      <PlanStep key={s.t} step={s} i={i} />
                    ))}
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <span className="src mt-4 block text-[13px] text-muted2">
          근거: 도로교통법 제54조, 특정범죄가중처벌법 제5조의3, 도로교통법 제66조·시행규칙 제40조. 세부 판단이
          어려우면 112 또는 보험사에 문의하세요.
        </span>
      </div>
    </section>
  )
}
