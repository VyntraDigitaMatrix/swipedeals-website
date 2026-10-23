import AuthHeader from './AuthHeader'
import AuthHeroPanel from './AuthHeroPanel'

export default function AuthLayout({
  children,
  badgeText,
  headline,
  subheading,
  heroImage,
  heroImageAlt,
  trustItems,
  heroCustom,
  rightWidthClass = 'w-full lg:w-[45%]',
}) {
  return (
    <div className="min-h-screen bg-white px-3 sm:px-6 lg:px-8 py-2 sm:py-4 flex flex-col font-sans selection:bg-[#B8001F] selection:text-white overflow-x-hidden">
      {/* Top Navbar */}
      <div className="shrink-0">
        <AuthHeader />
      </div>

      {/* Main card container */}
      <main className="flex-1 w-full mx-auto py-2 sm:py-3 flex items-center justify-center">
        <div className="w-full bg-white rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#ECEEF2] overflow-hidden flex flex-col lg:flex-row min-h-[580px]">
          {/* Left column */}
          {heroCustom ? (
            heroCustom
          ) : (
            <AuthHeroPanel
              badgeText={badgeText}
              headline={headline}
              subheading={subheading}
              heroImage={heroImage}
              heroImageAlt={heroImageAlt}
              trustItems={trustItems}
            />
          )}

          {/* Right column */}
          <div
            className={`${rightWidthClass} p-5 sm:p-7 lg:px-9 lg:py-6 flex flex-col justify-center`}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}