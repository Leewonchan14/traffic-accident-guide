import * as Accordion from '@radix-ui/react-accordion'
import { PlusIcon } from '@phosphor-icons/react'
import { IMMEDIATE_STEPS } from '../data.jsx'
import { scrollToId } from '../utils.js'
import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'

export default function Immediate() {
  return (
    <section id="immediate" aria-labelledby="immediate-title" className="py-16 md:py-24">
      <div className="wrap">
        <SectionHead
          id="immediate-title"
          kicker="일반도로 즉시 조치"
          title="사고 현장에서, 이 순서대로"
          lede="각 단계를 누르면 이유와 법적 근거가 펼쳐집니다. 외우지 못했더라도 순서만 기억하세요."
        />

        <Accordion.Root type="single" collapsible className="grid gap-3.5">
          {IMMEDIATE_STEPS.map((s) => (
            <Reveal key={s.n}>
              <Accordion.Item
                value={s.n}
                className="group card overflow-hidden data-[state=open]:shadow-card"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="grid w-full grid-cols-[46px_1fr_auto] items-center gap-4 px-5 py-5 text-left md:grid-cols-[52px_1fr_auto] md:px-6">
                    <span className="text-[22px] font-extrabold tabular-nums tracking-[-0.03em] text-linestrong transition-colors group-data-[state=open]:text-accent md:text-[24px]">
                      {s.n}
                    </span>
                    <span>
                      <b className="block text-[16.5px]">{s.t}</b>
                      <span className="text-[13.5px] text-muted">{s.sub}</span>
                    </span>
                    <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-linestrong text-muted transition-transform duration-200 group-data-[state=open]:rotate-45 group-data-[state=open]:border-ink group-data-[state=open]:text-ink">
                      <PlusIcon size={15} weight="bold" aria-hidden="true" />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="acc-content">
                  <div className="px-5 pb-6 text-[15px] text-muted md:pl-[92px] md:pr-6">
                    <ul className="m-0 list-disc pl-4">
                      {s.body.map((line) => (
                        <li key={line} className="my-1.5">{line}</li>
                      ))}
                    </ul>
                    {s.link && (
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost mt-3"
                        onClick={() => scrollToId('evidence')}
                      >
                        {s.link.label}
                      </button>
                    )}
                    {s.law && (
                      <span className="mt-3 block border-t border-dashed border-line pt-2.5 text-[12.8px] text-muted2">
                        근거: {s.law}
                      </span>
                    )}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Reveal>
          ))}
        </Accordion.Root>
      </div>
    </section>
  )
}
