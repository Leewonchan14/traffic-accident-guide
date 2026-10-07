import { useState } from 'react'
import { motion } from 'motion/react'
import { CheckIcon, PhoneIcon, WarningOctagonIcon } from '@phosphor-icons/react'
import { CALLS, PLAN_QUESTIONS, buildPlan } from '../data.jsx'
import SectionHead from './SectionHead.jsx'

const Q_KEYS = PLAN_QUESTIONS.map((q) => q.id)

function QuestionRow({ q, index, selected, onSelect }) {
  const done = Boolean(selected)
  return (
    <div className="grid items-center gap-3.5 border-t border-line px-0 py-7 last:border-b md:grid-cols-[240px_1fr] md:gap-6 md:py-8">
      <div className="flex items-center gap-3 text-[17.5px] font-bold tracking-[-0.02em] md:text-[19px]">
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
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[15px] font-semibold transition-colors md:text-[15.5px] ${
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
    <li
      style={{ animationDelay: `${i * 0.05}s` }}
      className="plan-in grid grid-cols-[34px_1fr] gap-3.5 border-t border-line py-4 first:border-t-0 first:pt-1"
    >
      <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-accent text-[13.5px] font-extrabold tabular-nums text-white">
        {i + 1}
      </span>
      <div>
        <b className="block text-[18px] tracking-[-0.02em] md:text-[19px]">{step.t}</b>
        <p className="mt-1.5 text-[15.5px] text-muted">{step.d}</p>
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
    </li>
  )
}

export default function Diagnose() {
  const [answers, setAnswers] = useState({})
  const answered = Q_KEYS.filter((k) => answers[k]).length
  const complete = answered === Q_KEYS.length
  const plan = complete ? buildPlan(answers) : null

  const select = (qid, v) => setAnswers((a) => ({ ...a, [qid]: v }))
  const reset = () => setAnswers({})

  return (
    <section id="diagnose" aria-labelledby="diagnose-title" className="sec sec-white">
      <div className="wrap">
        <SectionHead
          index="01"
          id="diagnose-title"
          kicker="상황 진단"
          title="세 가지만 고르면, 지금 할 일이 나옵니다"
          lede="선택에 따라 신고 의무와 우선순위가 달라집니다. 결과는 도로교통법 조문 기준으로 구성됩니다."
        />

        <div>
          {PLAN_QUESTIONS.map((q, i) => (
            <QuestionRow key={q.id} q={q} index={i} selected={answers[q.id]} onSelect={select} />
          ))}

          <div className="border-t border-line py-8" aria-live="polite">
            {!complete ? (
              <p className="flex min-h-16 items-center text-[15.5px] text-muted">
                <span>
                  질문에 답하면 맞춤 조치가 여기에 표시됩니다. 남은 질문:{' '}
                  <b className="text-ink">{Q_KEYS.length - answered}</b>개
                </span>
              </p>
            ) : (
              /* 등장은 CSS로만 처리합니다. JS 애니메이션 완료에 의존하면
                 프레임이 밀리는 상황에서 결과가 늦게 뜨거나 비어 보일 수 있습니다. */
              <div key={JSON.stringify(answers)} className="plan-in">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <strong className="text-[19px] tracking-[-0.02em]">지금 해야 할 일 {plan.steps.length}단계</strong>
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
              </div>
            )}
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
