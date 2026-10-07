import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'motion/react'
import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'

function CountUp({ to, suffix = '', className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration: 1.1,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, to])
  return (
    <span ref={ref} className={className}>
      {val}
      {suffix}
    </span>
  )
}

const BTP = [
  {
    letter: '비',
    short: '상등',
    t: '비상등을 켜고 트렁크를 연다',
    d: '후속 차량이 멀리서도 정차 상태를 알아볼 수 있게 비상 점멸등을 켜고, 안전이 확보되면 트렁크를 열어 둡니다.',
  },
  {
    letter: '탑',
    short: '승자 대피',
    t: '가드레일 밖으로 전원 대피',
    d: '운전자와 탑승자 전원이 차에서 내려 가드레일 밖 안전한 곳으로 이동합니다. 차 안 대기와 갓길 대기는 모두 위험합니다.',
  },
  {
    letter: '신',
    short: '고',
    t: '안전을 확보한 뒤 신고',
    d: '대피를 마친 후 112(경찰), 119(구급), 도로공사(1588-2504)에 위치와 상황을 알립니다.',
  },
]

export default function Highway() {
  return (
    <section id="highway" aria-labelledby="highway-title" className="bg-ink py-16 text-[#eef1f5] md:py-24">
      <div className="wrap">
        <SectionHead
          dark
          id="highway-title"
          kicker="고속도로"
          title="고속도로에서는 순서가 생사를 가릅니다"
          lede="2차 사고는 고속도로 사고 사망의 큰 비중을 차지합니다. 서 있거나 차 안에 머무는 시간이 길수록 위험이 커집니다."
        />

        <div className="grid gap-3.5 md:grid-cols-3">
          {BTP.map((c, i) => (
            <Reveal key={c.letter} delay={i * 0.07}>
              <div className="h-full rounded-[18px] border border-inkline bg-inksoft px-6 py-6.5">
                <div className="text-[42px] font-extrabold leading-none tracking-[-0.04em] text-white">
                  <span className="text-[#ff8d90]">{c.letter}</span>
                  {c.short}
                </div>
                <h3 className="mt-4 text-[17.5px] font-bold text-white">{c.t}</h3>
                <p className="mt-2.5 text-[14.5px] text-[#aeb7c2]">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-3.5 grid gap-3.5 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <div className="h-full rounded-[18px] border border-inkline bg-inksoft p-6">
              <h3 className="text-[16.5px] font-bold text-white">안전삼각대, 어디에 세우나</h3>
              <ul className="mt-3 list-disc pl-4 text-[14.5px] leading-relaxed text-[#c3cad3]">
                <li className="my-2">
                  차량 뒤쪽 <b className="text-white">100m 지점</b>에 세우는 것이 안내 기준입니다. 후방에서
                  접근하는 운전자가 확인할 수 있는 위치라야 합니다.
                </li>
                <li className="my-2">
                  야간에는 사방 500m에서 식별할 수 있는 <b className="text-white">적색 섬광신호나 불꽃신호</b>를
                  추가로 설치해야 합니다.
                </li>
                <li className="my-2">미설치 시 승용차 기준 범칙금이 부과될 수 있습니다(4만원, 가이드라인 기준).</li>
              </ul>
              <span className="mt-3.5 block text-[12.8px] text-[#7c8694]">
                근거: 도로교통법 제66조, 시행규칙 제40조
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.07}>
            <div className="h-full rounded-[18px] border border-inkline bg-inksoft p-6">
              <h3 className="text-[16.5px] font-bold text-white">차를 옮길 수 없다면</h3>
              <ul className="mt-3 list-disc pl-4 text-[14.5px] leading-relaxed text-[#c3cad3]">
                <li className="my-2">
                  도로공사 <b className="text-white">무료 긴급견인(1588-2504)</b>은 본선·갓길 위 위험 차량을
                  가까운 휴게소·졸음쉼터 등 안전지대로 옮겨 줍니다.
                </li>
                <li className="my-2">안전지대로 이동한 뒤 보험사 긴급출동으로 정비소 이동을 이어가면 됩니다.</li>
                <li className="my-2">터널 안이라면 소방·구급이 차를 옮길 수 있게 열쇠를 꽂아 두고 하차하세요.</li>
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-3.5">
          <div className="rounded-[18px] border border-[#5c3a3d] bg-[#25191b] p-6">
            <h3 className="text-[16.5px] font-bold text-[#ff8d90]">절대 하지 말 것</h3>
            <ul className="mt-3 list-disc pl-4 text-[14.5px] leading-relaxed text-[#e8c9cb]">
              <li className="my-2">차 안에 앉아 대기하기, 갓길에 서 있기</li>
              <li className="my-2">차로 위에서 사진 찍기, 상대 운전자와 실랑이하기</li>
              <li className="my-2">표지 없이 차만 세워 두고 떠나기</li>
            </ul>
            <div className="mt-5 text-[30px] font-extrabold tracking-[-0.03em] text-white">
              약 <CountUp to={20} suffix="%" />
              <small className="ml-2 text-[13.5px] font-semibold tracking-normal text-[#aeb7c2]">
                고속도로 2차 사고 치명률
              </small>
            </div>
            <span className="mt-1 block text-[12.8px] text-[#7c8694]">
              한국도로공사 최근 5년(2021~2025) 기준, 일반 고속도로 사고 치명률(약 4.7%)의 약 5배
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
