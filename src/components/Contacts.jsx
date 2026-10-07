import { useState } from 'react'
import { CopyIcon, PhoneIcon } from '@phosphor-icons/react'
import { CONTACTS } from '../data.jsx'
import SectionHead from './SectionHead.jsx'
import Reveal from './Reveal.jsx'
import { withViewTransition } from '../utils.js'

function legacyCopy(text) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.opacity = '0'
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand('copy')
  } catch {
    /* ignore */
  }
  document.body.removeChild(ta)
}

export default function Contacts() {
  const [copied, setCopied] = useState(null)

  const copy = (num) => {
    const mark = () =>
      withViewTransition(() => {
        setCopied(num)
        window.setTimeout(() => setCopied((c) => (c === num ? null : c)), 1600)
      })
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(num).then(mark, () => {
        legacyCopy(num)
        mark()
      })
    } else {
      legacyCopy(num)
      mark()
    }
  }

  return (
    <section id="contacts" aria-labelledby="contacts-title" className="sec sec-white">
      <div className="wrap">
        <SectionHead
          index="08"
          id="contacts-title"
          kicker="비상 연락처"
          title="사고 때 눌러야 할 번호"
          lede="번호를 누르면 바로 연결되고, 복사 버튼으로 저장해 둘 수 있습니다."
        />

        <Reveal>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-[16px]">
              <thead>
                <tr>
                  {['기관', '번호', '용도', ''].map((h, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="border-b border-line px-4 py-3.5 text-left text-[12px] font-bold uppercase tracking-[0.08em] text-muted2"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CONTACTS.map((c) => (
                  <tr key={c.num} className="border-b border-line">
                    <td className="px-4 py-4">{c.name}</td>
                    <td className="px-4 py-4 text-[17.5px] font-bold tabular-nums tracking-[-0.01em]">{c.num}</td>
                    <td className="px-4 py-4 text-[15.5px] text-muted">{c.use}</td>
                    <td className="px-4 py-4">
                      <span className="flex gap-2">
                        <a className={`btn btn-sm ${c.accent ? 'btn-accent' : 'btn-ghost'}`} href={`tel:${c.tel}`}>
                          <PhoneIcon weight="fill" size={13} aria-hidden="true" />
                          전화
                        </a>
                        <button
                          type="button"
                          onClick={() => copy(c.num)}
                          aria-label={`${c.num} 복사`}
                          style={copied === c.num ? { viewTransitionName: 'copy-state' } : undefined}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-bold transition-colors ${
                            copied === c.num
                              ? 'border-greenink text-greenink'
                              : 'border-linestrong text-muted hover:border-ink hover:text-ink'
                          }`}
                        >
                          <CopyIcon size={13} aria-hidden="true" />
                          {copied === c.num ? '복사됨' : '복사'}
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <span className="src mt-3.5 block text-[12.8px] text-muted2">
          보험사 대표번호는 2026년 9월 각 사 안내 기준이며 변경될 수 있습니다. 가입 보험사 번호는 보험증권이나
          앱에서 확인하세요.
        </span>
      </div>
    </section>
  )
}
