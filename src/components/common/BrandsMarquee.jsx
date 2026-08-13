import SectionHeader from './SectionHeader'
import { brands } from '../../data/brands'

export default function BrandsMarquee() {
  const loop = [...brands, ...brands]

  return (
    <section className="border-y border-border bg-surface-alt/60 py-14">
      <div className="container-page">
        <SectionHeader eyebrow="Trusted Brands" title="Popular brands on SwipeDeals" align="center" className="mb-8" />
      </div>
      <div className="no-scrollbar relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-surface-alt to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-surface-alt to-transparent sm:w-32" />
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-4">
          {loop.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="flex h-16 shrink-0 items-center justify-center rounded-xl border border-border bg-surface px-8 text-sm font-bold text-text-secondary shadow-soft"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
