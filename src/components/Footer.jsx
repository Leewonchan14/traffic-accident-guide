const SOURCES = [
  {
    t: '도로교통법 제54조(사고발생 시의 조치), 제66조(고장 등의 조치), 제154조(벌칙)',
    href: 'https://www.law.go.kr',
    label: '국가법령정보센터',
  },
  { t: '도로교통법 시행규칙 제40조(고장자동차의 표지), 제129조의3(사실확인원 발급)' },
  { t: '특정범죄 가중처벌 등에 관한 법률 제5조의3(도주차량), 제5조의13(어린이보호구역)' },
  {
    t: '교통사고처리 특례법 제3조·제4조 (처벌 특례, 12대 중과실)',
    href: 'https://easylaw.go.kr',
    label: '법제처 생활법령정보',
  },
  {
    t: '고속도로 2차 사고 치명률, 무료 긴급견인 안내 (2026.09)',
    href: 'https://insight.kbinsure.co.kr/20260923-kb-prevention-of-secondary-accidents-on-the-highway/',
    label: 'KB손해보험 인사이트',
  },
  { t: '보험사 사고접수 대표번호 (2026.09 기준, 각 사 공식 안내)' },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface pb-16 pt-14 text-[14px] text-muted">
      <div className="wrap">
        <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h3 className="mb-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-muted2">
              근거 법령·출처
            </h3>
            <ul className="m-0 list-none p-0">
              {SOURCES.map((s) => (
                <li key={s.t} className="my-2">
                  {s.t}
                  {s.href && (
                    <>
                      {' '}
                      ·{' '}
                      <a href={s.href} target="_blank" rel="noopener noreferrer">
                        {s.label}
                      </a>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-3.5 text-[12px] font-bold uppercase tracking-[0.08em] text-muted2">
              이 페이지 정보
            </h3>
            <ul className="m-0 list-none p-0">
              <li className="my-2">기준 법령 확인일: 2026년 10월</li>
              <li className="my-2">법령은 개정될 수 있으므로 처벌·의무 내용은 최신 법령 확인 필요</li>
              <li className="my-2">체크리스트는 이 브라우저에만 저장되며 외부로 전송되지 않습니다</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 max-w-[76ch] border-t border-line pt-5 text-[13px] text-muted2">
          이 페이지는 일반적인 정보 제공을 목적으로 하며 법률 자문이 아닙니다. 사고의 구체적인 상황(과실, 부상
          정도, 보험 가입 조건)에 따라 결론이 달라질 수 있으니, 실제 사안은 경찰, 보험사, 변호사와 상담하세요.
        </p>
      </div>
    </footer>
  )
}
