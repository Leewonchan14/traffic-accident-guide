import * as Accordion from '@radix-ui/react-accordion'
import { CaretDownIcon } from '@phosphor-icons/react'
import { FAQS } from '../data.jsx'
import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-surface py-16 md:py-24">
      <div className="wrap">
        <SectionHead id="faq-title" kicker="자주 묻는 질문" title="현장에서 가장 많이 나오는 질문" />

        <Accordion.Root type="single" collapsible className="max-w-[820px]">
          {FAQS.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.03}>
              <Accordion.Item
                value={f.q}
                className="group card mb-2.5 overflow-hidden"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full items-center justify-between gap-3.5 px-5.5 py-4.5 text-left text-[15.5px] font-bold">
                    {f.q}
                    <CaretDownIcon
                      size={15}
                      weight="bold"
                      aria-hidden="true"
                      className="shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
                    />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="acc-content">
                  <div className="px-5.5 pb-5 text-[14.5px] leading-relaxed text-muted">
                    <p>{f.a}</p>
                    {f.law && <span className="law">{f.law}</span>}
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
