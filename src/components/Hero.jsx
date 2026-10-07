import { motion, useReducedMotion } from 'motion/react'
import { PhoneIcon } from '@phosphor-icons/react'
import { scrollToId } from '../utils.js'
import Hero3D from './Hero3D.jsx'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] } },
}

const NOW = [
  ['정차하고 비상등을 켭니다', '2차 사고 방지가 첫 번째입니다'],
  ['다친 사람이 있으면 119', '할 수 있는 범위에서 구호조치'],
  ['현장을 떠나지 않습니다', '신고와 인적사항 제공까지가 조치입니다'],
]

export default function Hero() {
  const reduce = useReducedMotion()
  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden pb-14 pt-12 md:pb-16 md:pt-16">
      <div className="wrap relative grid items-center gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-11">
        <motion.div variants={reduce ? undefined : container} initial={reduce ? false : 'hidden'} animate="show">
          <motion.span variants={item} className="kicker block">
            도로교통법 제54조 기준 · 2026. 10. 확인
          </motion.span>
          <motion.h1
            variants={item}
            id="hero-title"
            className="mt-3.5 text-[clamp(2.2rem,4.6vw,3.35rem)] font-extrabold leading-[1.14] tracking-[-0.025em]"
          >
            도로에서 사고가 났을 때,
            <br />
            운전자가 해야 할 <span className="text-accent">것</span>
          </motion.h1>
          <motion.p variants={item} className="mt-5 max-w-[52ch] text-[18px] text-muted">
            즉시 정차, 구호, 신고까지 법이 정한 순서가 있습니다. 옆 화면이 그 순서를 3D로 재생 중입니다.
            지금 상황을 고르면 해야 할 일을 순서대로 보여드립니다.
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <button type="button" className="btn btn-accent" onClick={() => scrollToId('diagnose')}>
              내 상황 진단하기
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => scrollToId('simulator')}>
              3D로 직접 조작하기
            </button>
          </motion.div>
          <motion.p variants={item} className="mt-5 text-[14px] text-muted2">
            구호조치 없이 현장을 떠나면 도주차량으로 가중처벌 대상입니다. 순서를 지키면 대부분의 문제는
            줄어듭니다.
          </motion.p>
        </motion.div>

        <Hero3D />
      </div>

      <div className="wrap relative mt-7">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-8% 0px' }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="card flex flex-col gap-4 p-5 md:flex-row md:items-center md:gap-8 md:p-6"
        >
          <div className="flex shrink-0 items-center gap-2.5 md:w-[104px]">
            <span aria-hidden="true" className="pulse-dot h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
            <strong className="text-[15.5px] font-extrabold">지금 즉시</strong>
          </div>
          <ol className="m-0 grid flex-1 list-none gap-3 p-0 sm:grid-cols-3 sm:gap-5">
            {NOW.map(([t, d], i) => (
              <li key={t} className="flex items-baseline gap-3">
                <span className="shrink-0 pt-0.5 text-[12.5px] font-extrabold tabular-nums text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <strong className="block text-[14.5px] leading-snug">{t}</strong>
                  <small className="text-[12.5px] text-muted">{d}</small>
                </span>
              </li>
            ))}
          </ol>
          <div className="flex shrink-0 flex-wrap gap-2">
            <a className="btn btn-sm btn-accent" href="tel:119">
              <PhoneIcon weight="fill" size={13} aria-hidden="true" />
              119 전화
            </a>
            <a className="btn btn-sm btn-ghost" href="tel:112">112 전화</a>
          </div>
        </motion.div>
      </div>

      <div className="wrap mt-12">
        <div className="lane-dash" aria-hidden="true" />
      </div>
    </section>
  )
}
