import * as Accordion from '@radix-ui/react-accordion'
import { CaretDownIcon } from '@phosphor-icons/react'
import { FAQS } from '../data.jsx'
import SectionHead from './SectionHead.jsx'

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="sec sec-light">
      <div className="wrap">
        <SectionHead
          index="09"
          id="faq-title"
          kicker="자주 묻는 질문"
          title="현장에서 가장 많이 나오는 질문"
        />

        <Accordion.Root type="single" collapsible className="lg:max-w-[860px]">
          {FAQS.map((f) => (
            <Accordion.Item key={f.q} value={f.q} className="group border-t border-line last:border-b">
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full items-center justify-between gap-5 py-6 text-left text-[17.5px] font-bold tracking-[-0.02em] md:text-[19px]">
                  {f.q}
                  <CaretDownIcon
                    size={17}
                    weight="bold"
                    aria-hidden="true"
                    className="shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-180"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="acc-content">
                <div className="max-w-[70ch] pb-7 text-[15.5px] leading-relaxed text-muted">
                  <p>{f.a}</p>
                  {f.law && <span className="law">{f.law}</span>}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  )
}
