export default function SectionHead({ kicker, title, lede, dark = false, id }) {
  return (
    <div className="mb-11 max-w-[720px]">
      <span className={dark ? 'text-[12.5px] font-bold uppercase tracking-[0.14em] text-[#ff8d90]' : 'kicker'}>
        {kicker}
      </span>
      <h2
        id={id}
        className={`mt-3.5 text-[clamp(1.7rem,3.4vw,2.35rem)] font-extrabold leading-[1.22] ${
          dark ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </h2>
      {lede && (
        <p className={`mt-3.5 text-[17px] ${dark ? 'text-[#aeb7c2]' : 'text-muted'}`}>{lede}</p>
      )}
    </div>
  )
}
