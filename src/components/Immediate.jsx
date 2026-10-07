import * as Accordion from '@radix-ui/react-accordion'
import { PlusIcon } from '@phosphor-icons/react'
import { IMMEDIATE_STEPS } from '../data.jsx'
import { scrollToId } from '../utils.js'
import SectionHead from './SectionHead.jsx'

export default function Immediate() {
  return (
    <section id="immediate" aria-labelledby="immediate-title" className="sec sec-light">
      <div className="wrap">
        <SectionHead
          index="02"
          id="immediate-title"
          kicker="일반도로 즉시 조치"
          title="사고 현장에서, 이 순서대로"
          lede="각 단계를 누르면 이유와 법적 근거가 펼쳐집니다. 외우지 못했더라도 순서만 기억하세요."
        />

        <Accordion.Root type="single" collapsible>
          {IMMEDIATE_STEPS.map((s) => (
            <Accordion.Item key={s.n} value={s.n} className="group border-t border-line last:border-b">
              <Accordion.Header>
                <Accordion.Trigger className="grid w-full grid-cols-[56px_1fr_auto] items-center gap-5 py-6 text-left md:grid-cols-[92px_1fr_auto] md:gap-8 md:py-7">
                  <span className="text-[clamp(26px,2.6vw,38px)] font-extrabold tabular-nums tracking-[-0.04em] text-linestrong transition-colors group-data-[state=open]:text-accent">
                    {s.n}
                  </span>
                  <span>
                    <b className="block text-[19px] tracking-[-0.02em] md:text-[21px]">{s.t}</b>
                    <span className="mt-1 block text-[14.5px] text-muted md:text-[15.5px]">{s.sub}</span>
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-linestrong text-muted transition-transform duration-200 group-data-[state=open]:rotate-45 group-data-[state=open]:border-ink group-data-[state=open]:text-ink">
                    <PlusIcon size={16} weight="bold" aria-hidden="true" />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="acc-content">
                <div className="pb-8 text-[15.5px] text-muted md:pl-[92px] md:pr-8">
                  <ul className="m-0 list-disc pl-5">
                    {s.body.map((line) => (
                      <li key={line} className="my-2">{line}</li>
                    ))}
                  </ul>
                  {s.link && (
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost mt-4"
                      onClick={() => scrollToId('evidence')}
                    >
                      {s.link.label}
                    </button>
                  )}
                  {s.law && (
                    <span className="mt-4 block border-t border-dashed border-line pt-3 text-[13px] text-muted2">
                      근거: {s.law}
                    </span>
                  )}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  )
}
