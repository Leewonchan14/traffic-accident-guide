import { PhoneIcon } from '@phosphor-icons/react'
import Hero3D from './Hero3D.jsx'
import { scrollToId } from '../utils.js'

const NOW = [
  ['정차하고 비상등을 켭니다', '2차 사고 방지가 첫 번째입니다'],
  ['다친 사람이 있으면 119', '할 수 있는 범위에서 구호조치'],
  ['현장을 떠나지 않습니다', '신고와 인적사항 제공까지가 조치입니다'],
]

/* 히어로: 다크 챕터 + 큰 타이포 + 3D 스테이지. 이후 페이지는 라이트로 이어집니다. */
export default function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative bg-ink text-white">
      <div className="wrap grid items-center gap-9 pb-12 pt-12 md:pt-16 lg:grid-cols-[1.06fr_0.94fr] lg:gap-11">
        <div className="min-w-0">
          <span className="eyebrow text-[#ff8d90]">도로교통법 제54조 기준 · 2026. 10. 확인</span>
          <h1
            id="hero-title"
            className="mt-5 max-w-[13ch] text-[clamp(38px,5.8vw,74px)] font-extrabold leading-[1.01] tracking-[-0.042em] text-white"
          >
            사고가 났다면,
            <br />
            먼저 <span className="text-[#ff4d4d]">멈추고</span> 순서대로
          </h1>
          <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed text-[#c3cad3] md:text-[18.5px]">
            정차, 구호, 신고까지 법이 정한 순서가 있습니다. 옆 화면이 그 순서를 3D로 재생 중입니다. 지금 상황을
            고르면 해야 할 일을 순서대로 보여드립니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <button type="button" className="btn btn-accent" onClick={() => scrollToId('diagnose')}>
              내 상황 진단하기
            </button>
            <button
              type="button"
              className="btn border-white/25 text-white hover:border-white/60"
              onClick={() => scrollToId('simulator')}
            >
              3D로 직접 조작하기
            </button>
            <a className="btn border-white/25 text-white hover:border-white/60" href="tel:119">
              <PhoneIcon weight="fill" size={14} aria-hidden="true" />
              119
            </a>
          </div>
          <p className="mt-6 text-[14.5px] text-[#8b95a1]">
            구호조치 없이 현장을 떠나면 도주차량으로 가중처벌 대상입니다. 순서를 지키면 대부분의 문제는
            줄어듭니다.
          </p>
        </div>

        <Hero3D />
      </div>

      <div className="rule-dark border-t">
        <div className="wrap py-10 md:py-12">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-10">
            <div className="flex shrink-0 items-center gap-2.5 md:w-[120px]">
              <span aria-hidden="true" className="pulse-dot h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
              <strong className="text-[15.5px] font-extrabold">지금 즉시</strong>
            </div>
            <ol className="m-0 grid flex-1 list-none gap-5 p-0 sm:grid-cols-3">
              {NOW.map(([t, d], i) => (
                <li key={t} className="flex items-baseline gap-3">
                  <span className="shrink-0 pt-0.5 text-[12.5px] font-extrabold tabular-nums text-[#ff8d90]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <strong className="block text-[15.5px] leading-snug text-white">{t}</strong>
                    <small className="text-[13.5px] text-[#aeb7c2]">{d}</small>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
