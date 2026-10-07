import { PhoneIcon } from '@phosphor-icons/react'

export default function MobileBar() {
  return (
    <div
      role="region"
      aria-label="긴급 전화"
      className="no-print fixed inset-x-0 bottom-0 z-[60] grid grid-cols-2 gap-2.5 border-t border-line bg-paper/92 px-3.5 pt-2.5 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'calc(10px + env(safe-area-inset-bottom))' }}
    >
      <a className="btn btn-accent" href="tel:119">
        <PhoneIcon weight="fill" size={15} aria-hidden="true" />
        119 구급
      </a>
      <a className="btn btn-ink" href="tel:112">112 경찰</a>
    </div>
  )
}
