import { ShieldCheck, LayoutGrid, Lock, Tag } from 'lucide-react'

const FEATURES = [
  {
    Icon: ShieldCheck,
    title: 'Verified Sellers',
    desc: 'Every seller is KYC verified for your safety.',
    circle: 'bg-[#E8F0FE]',
    color: 'text-[#2F6BEB]',
  },
  {
    Icon: LayoutGrid,
    title: 'Wide Range',
    desc: 'Cars, properties, electronics and spare parts in one place.',
    circle: 'bg-[#EEEAFD]',
    color: 'text-[#5B3FD9]',
  },
  {
    Icon: Lock,
    title: 'Secure Transactions',
    desc: 'Safe payments with fraud protection.',
    circle: 'bg-[#E8F0FE]',
    color: 'text-[#2F6BEB]',
  },
  {
    Icon: Tag,
    title: 'Best Market Deals',
    desc: 'Get the best prices from trusted sellers.',
    circle: 'bg-[#FFE4E4]',
    color: 'text-[#D5112A]',
  },
]

export default function WhyChoose() {
  return (
    <section
      aria-labelledby="why-choose-heading"
      className="w-full py-8 sm:py-8 2xl:py-14 bg-[#FFFFFF]"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      <div className="container-page">
        {/* Heading */}
        <h2
          id="why-choose-heading"
          className="text-[20px] sm:text-[22px] xl:text-2xl 2xl:text-[28px] tracking-tight text-[#0F1624]"
          style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}
        >
          Why Choose SwipeDeals?
        </h2>

        {/* Cards */}
        <div className="mt-5 2xl:mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 xl:gap-3">
          {FEATURES.map(({ Icon, title, desc, circle, color }) => (
            <div
              key={title}
              className="flex items-center gap-4 rounded-xl bg-[#F6F8FA] px-4 py-5 xl:px-5 xl:py-6 2xl:px-6 2xl:py-7"
            >
              {/* Icon circle */}
              <div
                className={`flex h-[52px] w-[52px] xl:h-[62px] xl:w-[62px] 2xl:h-[72px] 2xl:w-[72px] shrink-0 items-center justify-center rounded-full ${circle} ${color}`}
              >
                <Icon
                  className="h-6 w-6 xl:h-7 xl:w-7 2xl:h-8 2xl:w-8"
                  strokeWidth={1.75}
                />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <h3 className="text-[14px] xl:text-[14.5px] 2xl:text-base text-[#0F1624] leading-tight" style={{ fontFamily: 'Inter', fontWeight: 700, fontStyle: 'Bold' }}>
                  {title}
                </h3>
                <p className="mt-1.5 text-[11.5px] xl:text-xs 2xl:text-sm leading-[1.7] text-[#7A8190] max-w-[200px] 2xl:max-w-[260px]" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', color: '#7B8390' }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}