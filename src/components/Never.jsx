import { NEVER } from '../data.jsx'
import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'

export default function Never() {
  return (
    <section id="never" aria-labelledby="never-title" className="py-16 md:py-24">
      <div className="wrap">
        <SectionHead
          id="never-title"
          kicker="주의사항"
          title="이 다섯 가지가 사고를 키웁니다"
          lede="현장에서의 판단 실수 하나가 형사처벌과 보상 결과를 바꿉니다."
        />

        <ul className="m-0 grid list-none gap-3 p-0">
          {NEVER.map((n, i) => (
            <Reveal key={n.t} delay={i * 0.04}>
              <li className="card grid items-start gap-4.5 p-5 md:grid-cols-[auto_1fr] md:px-6 md:py-5.5">
                <span
                  className={`h-fit rounded-full px-3 py-1.5 text-[12px] font-extrabold tracking-[0.06em] whitespace-nowrap ${
                    n.tone === 'danger' ? 'bg-accenttint text-accentdeep' : 'bg-ambertint text-amberink'
                  }`}
                >
                  {n.tag}
                </span>
                <div>
                  <b className="text-[16.5px]">{n.t}</b>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{n.d}</p>
                  {n.law && <span className="law">{n.law}</span>}
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
