import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import homeImage from '../../assets/Home-1.png'

/*
  Set to true ONLY if Home-1.png is the complete banner
  (text + gradient + photo baked into one image).
  Leave false if it is just the car/house/gadgets photo.
*/
const FULL_BANNER_IMAGE = false

// Hero never gets shorter than this on desktop, even in a very short window
const MIN_DESKTOP_HEIGHT = 480

const TRUST_ITEMS = [
  { title: 'Verified', sub: 'Sellers' },
  { title: 'Safe & Secure', sub: 'Transactions' },
  { title: 'Best', sub: 'Market Deals' },
]

export default function Hero() {
  const sectionRef = useRef(null)
  const [height, setHeight] = useState(null)

  // On desktop: hero height = viewport height - space taken by navbar/categories above it
  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')

    const measure = () => {
      if (!mq.matches || !sectionRef.current) {
        setHeight(null)
        return
      }
      const top = sectionRef.current.getBoundingClientRect().top + window.scrollY
      setHeight(Math.max(window.innerHeight - top, MIN_DESKTOP_HEIGHT))
    }

    measure()
    window.addEventListener('resize', measure)
    mq.addEventListener('change', measure)
    return () => {
      window.removeEventListener('resize', measure)
      mq.removeEventListener('change', measure)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Hero"
      style={{ containerType: 'inline-size', height: height ?? undefined }}
      className="relative w-full overflow-hidden bg-gradient-to-br from-[#EBEDF1] via-[#F5F6F8] to-white lg:min-h-[480px]"
    >
      {/* ───── Desktop illustration ───── */}
      <div
        className="hidden lg:block absolute top-0 right-0 h-full w-[78%] pointer-events-none select-none translate-x-[4%] xl:translate-x-[5%]"
        style={
          FULL_BANNER_IMAGE
            ? undefined
            : {
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%)',
              maskImage: 'linear-gradient(to right, transparent 0%, black 20%)',
            }
        }
      >
        <img
          src={homeImage}
          alt="SwipeDeals — Cars, Properties, Electronics and Spare Parts"
          className="w-full h-full object-cover object-right"
          loading="eager"
          draggable={false}
        />
      </div>

      {/* ───── Content (vertically centred in the hero on desktop) ───── */}
      <div className="relative z-10 px-4 sm:px-8 pt-8 sm:pt-10 pb-6 lg:absolute lg:inset-0 lg:p-0 lg:pl-[5.1cqw] lg:py-[2vh] flex flex-col justify-center max-w-[640px] lg:max-w-[49%]">
        {/* Headline */}
        <h1 className="text-[30px] sm:text-[38px] md:text-[44px] lg:text-[52px] font-bold leading-[1.12] tracking-tight text-[#0B1625]">
          Buy. Sell. Upgrade.
          <br />
          <span className="text-[#D5112A]">Everything You Need.</span>
        </h1>

        {/* Subheading */}
        <p className="mt-3 lg:mt-[0.9cqw] text-[13px] sm:text-sm lg:text-[15px] leading-relaxed lg:leading-[2.35cqw] text-[#4B5563]" style={{ fontFamily: 'Inter', fontWeight: 400, fontStyle: 'Regular', color: '#2F3744' }}>
          Cars, properties, electronics and spare parts —
          <br className="hidden sm:block" />
          all in one trusted marketplace.
        </p>

        {/* CTA */}
        <Link
          to="/cars"
          className="mt-5 sm:mt-6 lg:mt-[2.2cqw] inline-flex items-center justify-between gap-8 lg:gap-0 rounded-lg lg:rounded-[0.8cqw] px-6 lg:px-[2.8cqw] py-3 lg:py-0 lg:h-[4.0cqw] lg:w-[18.2cqw] text-[13px] sm:text-sm lg:text-[1.3cqw] font-bold text-white shadow-md hover:shadow-lg transition"
          style={{ background: 'linear-gradient(90deg, #C50E26 0%, #B30A20 100%)' }}
        >
          <span>Explore Listings</span>
          <ArrowRight
            className="w-[18px] h-[18px] lg:w-[1.9cqw] lg:h-[1.9cqw]"
            strokeWidth={2}
          />
        </Link>

        {/* Trust badges */}
        <div className="mt-6 sm:mt-8 lg:mt-[3.6cqw] lg:-ml-[0.4cqw] flex flex-wrap items-center gap-x-5 gap-y-3 lg:gap-x-[2.4cqw]">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="flex items-center gap-2.5 lg:gap-[0.7cqw]">
              <div className="flex h-10 w-10 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-[#D5112A]">
                <ShieldCheck
                  className="w-[18px] h-[18px] lg:w-[16px] lg:h-[16px]"
                  strokeWidth={2.25}
                />
              </div>
              <div className="leading-tight lg:leading-[1.45]">
                <p className="text-[12px] sm:text-[13px] lg:text-[1.2cqw] font-bold text-[#0B1B2E]">
                  {item.title}
                </p>
                <p className="text-[11px] sm:text-[12px] lg:text-[13px] text-[#6B7280]">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───── Mobile / tablet illustration ───── */}
      <div
        className="lg:hidden relative w-full h-[240px] sm:h-[320px] md:h-[380px] pointer-events-none select-none"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)',
        }}
      >
        <img
          src={homeImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-[80%_bottom]"
          loading="eager"
          draggable={false}
        />
      </div>
    </section>
  )
}
