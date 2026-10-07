# 교통사고 대처 가이드

도로에서 교통사고가 났을 때 운전자가 해야 할 일을 상황별로 안내하는 인터랙티브 웹 앱입니다.

**배포 주소: https://leewonchan14.github.io/traffic-accident-guide/**

## 기능

- **상황 진단 위저드**: 장소(일반도로/고속도로) · 사상자 유무 · 상대와 피해 유형 3문항 선택 → 맞춤 조치 단계와 도주 경고를 즉시 생성
- **즉시 조치 타임라인**: 정차·구호·증거·인적사항·신고 5단계, 각 단계별 법적 근거(도로교통법 §54 등) 펼쳐보기
- **고속도로 비·탑·신 수칙**: 2차 사고 예방 수칙, 안전삼각대 설치 기준, 무료 긴급견인 안내
- **촬영 체크리스트**: 증거 사진 8종 체크 → 진행률 표시, localStorage에 저장
- **비상 연락처**: 119 · 112 · 도로공사 · 보험사 원터치 전화 및 번호 복사
- **FAQ**: 신고 면제 조건, 현장 합의 대응, 사실확인원 발급 등

## 기술 스택

- React 18 + Vite
- Tailwind CSS v4 (`@theme` 디자인 토큰)
- motion (Framer Motion) — 등장 트랜지션, 스프링 진행률, 카운트업
- @radix-ui/react-accordion — 접근성 아코디언
- @phosphor-icons/react — 아이콘

## 개발

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # dist/ 생성
npm run preview # 빌드 결과 미리보기
```

## 배포

`main` 브랜치에 푸시하면 GitHub Actions(`.github/workflows/deploy.yml`)가 빌드 후 GitHub Pages로 자동 배포합니다.

## 내용 출처

도로교통법 제54조 · 제66조 · 제154조, 도로교통법 시행규칙 제40조 · 제129조의3, 특정범죄가중처벌법 제5조의3, 교통사고처리 특례법 제3조·제4조 (2026년 10월 확인 기준). 이 앱은 일반 정보 안내이며 법률 자문이 아닙니다.
