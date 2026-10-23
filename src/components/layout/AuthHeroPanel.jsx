import { CarFront, Lock, ShieldCheck } from 'lucide-react'
import loginHeroImg from '../../assets/login.png'

export default function AuthHeroPanel({
  badgeText = "India's Trusted Marketplace",
  headline = (
    <>
      Buy smarter.
      <br />
      <span className="text-[#C8102E]">Sell faster.</span>
    </>
  ),
  subheading = 'From cars and bikes to properties, electronics, furniture, jobs and more — everything you need, all in one place.',
  heroImage = loginHeroImg,
  heroImageAlt = 'SwipeDeals marketplace - Cars, bikes, laptops, electronics and properties',
  trustItems = [
    {
      icon: <ShieldCheck size={16} />,
      title: (
        <>
          Verified<br className="hidden sm:block" /> Dealers
        </>
      ),
      desc: 'Buy & sell with confidence',
    },
    {
      icon: <Lock size={15} />,
      title: (
        <>
          Secure<br className="hidden sm:block" /> Transactions
        </>
      ),
      desc: 'Your data is always safe',
    },
    {
      icon: <CarFront size={15} />,
      title: (
        <>
          200-Point<br className="hidden sm:block" /> Inspected Cars
        </>
      ),
      desc: 'Quality you can trust',
    },
  ],
}) {
  return (
    <div className="w-full lg:w-[55%] relative flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-[#ECEEF2] bg-white">
      {/* Top text block */}
      <div className="relative z-10 px-5 sm:px-8 pt-6 sm:pt-7">
        {/* Badge line */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-6 h-[2px] bg-[#CD1020] rounded-full inline-block" />
          <span
            className="text-[9px] sm:text-[10.5px] uppercase"
            style={{ fontFamily: 'Inter', fontWeight: 700, color: '#444C5A' }}
          >
            {badgeText}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-3xl sm:text-4xl lg:text-[50px] leading-tight"
          style={{ fontFamily: 'Inter', fontWeight: 700, color: '#0B1B2E' }}
        >
          {headline}
        </h1>

        {/* Subheading */}
        <p
          className="mt-2.5 text-xs sm:text-[14px] max-w-[330px]"
          style={{ fontFamily: 'Inter', fontWeight: 400, color: '#3A4352' }}
        >
          {subheading}
        </p>
      </div>

      {/* Hero Illustration */}
      <div className="relative z-0 flex-1 min-h-[220px] sm:min-h-[380px] lg:-mt-42 -mb-2">
        <img
          src={heroImage}
          alt={heroImageAlt}
          className="absolute inset-0 w-full h-full object-contain object-right"
          loading="eager"
        />
      </div>

      {/* Trust Badges Card */}
      <div className="relative z-10 mx-3 sm:mx-5 mb-3 bg-white rounded-xl border border-[#ECEEF2] shadow-[0_4px_16px_rgba(0,0,0,0.05)] px-3.5 py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-0">
        {trustItems.map((item, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2.5 ${
              idx === 0
                ? 'sm:pr-2'
                : idx === 1
                ? 'sm:border-l sm:border-[#ECEEF2] sm:px-2'
                : 'sm:border-l sm:border-[#ECEEF2] sm:pl-2'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-[#FFE9EC] flex items-center justify-center text-[#CF1430] shrink-0">
              {item.icon}
            </div>
            <div className="min-w-0">
              <p
                className="text-[13px] leading-tight"
                style={{ fontFamily: 'Inter', fontWeight: 700, color: '#0B1B2E' }}
              >
                {item.title}
              </p>
              <p
                className="mt-0.5 text-[10px]"
                style={{ fontFamily: 'Inter', fontWeight: 400, color: '#5B6474' }}
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
