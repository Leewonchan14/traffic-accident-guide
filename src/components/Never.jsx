import { NEVER } from '../data.jsx'
import SectionHead from './SectionHead.jsx'

export default function Never() {
  return (
    <section id="never" aria-labelledby="never-title" className="sec sec-dark">
      <div className="wrap">
        <SectionHead
          dark
          index="06"
          id="never-title"
          kicker="주의사항"
          title="이 다섯 가지가 사고를 키웁니다"
          lede="현장에서의 판단 실수 하나가 형사처벌과 보상 결과를 바꿉니다."
        />

        <ul className="m-0 grid list-none p-0">
          {NEVER.map((n) => (
            <li
              key={n.t}
              className="grid items-start gap-4 border-t border-white/10 py-6 last:border-b md:grid-cols-[150px_1fr] md:gap-8 md:py-7"
            >
              <span
                className={`h-fit w-fit rounded-full px-3 py-1.5 text-[12px] font-extrabold tracking-[0.06em] whitespace-nowrap ${
                  n.tone === 'danger' ? 'bg-[#ff4d4d]/15 text-[#ff9a9c]' : 'bg-[#ffb648]/15 text-[#ffd08a]'
                }`}
              >
                {n.tag}
              </span>
              <div>
                <b className="block text-[18.5px] tracking-[-0.02em] text-white md:text-[20px]">{n.t}</b>
                <p className="mt-2 text-[15.5px] leading-relaxed text-[#aeb7c2]">{n.d}</p>
                {n.law && <span className="mt-3 block text-[13px] text-[#7c8694]">{n.law}</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
