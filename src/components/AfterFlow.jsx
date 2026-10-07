import * as Accordion from '@radix-ui/react-accordion'
import { CaretDownIcon } from '@phosphor-icons/react'
import { FLOW, MAJOR_12 } from '../data.jsx'
import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'

export default function AfterFlow() {
  return (
    <section id="after" aria-labelledby="after-title" className="py-16 md:py-24">
      <div className="wrap">
        <SectionHead
          id="after-title"
          kicker="이후 절차"
          title="현장 이후, 이 흐름으로 진행됩니다"
          lede="경찰 조사부터 과실비율 확정까지는 몇 주에서 몇 달이 걸릴 수 있습니다. 단계마다 준비물이 다릅니다."
        />

        <div className="mb-11 grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
          {FLOW.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.04} className="h-full">
              <div className="card h-full px-4 py-4.5">
                <span className="text-[11.5px] font-extrabold tracking-[0.08em] text-accent">
                  STEP {i + 1}
                </span>
                <b className="mt-2 block text-[15px]">{f.t}</b>
                <small className="mt-1.5 block text-[12.8px] leading-relaxed text-muted">{f.d}</small>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-3.5 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div className="card h-full p-6">
              <h3 className="text-[17px] font-bold">내 사고가 형사처벌로 이어지는 기준</h3>
              <ul className="mt-3.5 list-disc pl-4 text-[14.5px] leading-relaxed text-muted">
                <li className="my-2.5">
                  <b className="text-ink">원칙:</b> 종합보험에 가입되어 있으면 업무상과실치사상죄(5년 이하
                  금고 또는 2천만원 이하 벌금에 해당하는 죄)는 공소제기가 제한되는 특례가 적용됩니다.
                </li>
                <li className="my-2.5">
                  <b className="text-ink">예외 1: 12대 중과실</b> 중 하나에 해당하면 보험과 무관하게 처벌될 수
                  있습니다.
                </li>
                <li className="my-2.5">
                  <b className="text-ink">예외 2: 도주</b> 구호조치 없이 도주하면 특례 없이 가중처벌됩니다.
                </li>
                <li className="my-2.5">
                  <b className="text-ink">예외 3: 중상해</b> 생명 위험, 불구, 난치 질병이 생긴 경우 합의가
                  없으면 공소제기될 수 있습니다.
                </li>
                <li className="my-2.5">
                  <b className="text-ink">반의사불벌:</b> 피해자의 명시적 의사에 반해 공소를 제기할 수 없는
                  원칙이 일부 적용됩니다.
                </li>
              </ul>

              <Accordion.Root type="single" collapsible className="mt-3.5">
                <Accordion.Item value="majors" className="group rounded-xl border border-line bg-paper">
                  <Accordion.Header>
                    <Accordion.Trigger className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-[14px] font-bold">
                      12대 중과실 전체 목록 보기
                      <CaretDownIcon
                        size={15}
                        weight="bold"
                        aria-hidden="true"
                        className="shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
                      />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="acc-content">
                    <ul className="flex flex-wrap gap-2 px-4 pb-4">
                      {MAJOR_12.map((m) => (
                        <li
                          key={m}
                          className="rounded-full border border-line bg-surface px-3 py-1.5 text-[12.8px] font-semibold text-muted"
                        >
                          {m}
                        </li>
                      ))}
                    </ul>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>

              <span className="src mt-3.5 block text-[12.8px] text-muted2">
                근거: 교통사고처리 특례법 제3조·제4조 (법제처 생활법령 기준)
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.07}>
            <div className="card h-full p-6">
              <h3 className="text-[17px] font-bold">챙겨야 할 서류와 확인 사항</h3>
              <ul className="mt-3.5 list-disc pl-4 text-[14.5px] leading-relaxed text-muted">
                <li className="my-2.5">
                  <b className="text-ink">교통사고사실확인원</b> 경찰서에서 발급받습니다. 보험 청구 등 증명이
                  필요할 때 사용합니다.
                </li>
                <li className="my-2.5">
                  <b className="text-ink">사고 접수 번호</b> 보험사 접수 시 반드시 받아 두세요. 이후 모든
                  절차의 기준 번호가 됩니다.
                </li>
                <li className="my-2.5">
                  <b className="text-ink">진단서·진료기록</b> 부상이 있다면 초기에 진료를 받고 기록을 남기세요.
                  나중에 인과관계 다툼이 생길 수 있습니다.
                </li>
                <li className="my-2.5">
                  <b className="text-ink">수리 견적서</b> 정비소를 정하기 전에 견적을 확인하고, 보험사와 수리
                  범위를 협의하세요.
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
