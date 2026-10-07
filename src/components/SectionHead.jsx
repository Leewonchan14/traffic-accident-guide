/* 섹션 헤더: 챕터 번호 + 헤어라인 + 큰 제목 (하이브리드 아트 디렉션) */
export default function SectionHead({ kicker, title, lede, dark = false, id, index }) {
  return (
    <div className="mb-14 md:mb-16">
      <div className={`flex items-baseline gap-4 ${dark ? 'rule-dark' : 'rule'} border-t pt-4`}>
        {index && (
          <span
            className={`text-[12.5px] font-extrabold tabular-nums tracking-[0.1em] ${
              dark ? 'text-[#ff8d90]' : 'text-accent'
            }`}
          >
            {index}
          </span>
        )}
        <span className={`eyebrow ${dark ? 'text-[#aeb7c2]' : 'text-muted2'}`}>{kicker}</span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-10">
        <h2
          id={id}
          className={`max-w-[22ch] text-[clamp(30px,3.6vw,52px)] font-extrabold leading-[1.08] tracking-[-0.035em] ${
            dark ? 'text-white' : 'text-ink'
          }`}
        >
          {title}
        </h2>
        {lede && (
          <p className={`max-w-[46ch] text-[17px] leading-relaxed md:text-[18px] ${dark ? 'text-[#aeb7c2]' : 'text-muted'}`}>
            {lede}
          </p>
        )}
      </div>
    </div>
  )
}
