import Breadcrumb from '../components/common/Breadcrumb'

const sections = [
  {
    title: '1. Information We Collect',
    body: 'We collect information you provide directly (name, email, phone, listing details), information collected automatically (device data, usage patterns, cookies) and information from third parties (payment processors, verification partners) to operate and improve SwipeDeals.',
  },
  {
    title: '2. How We Use Your Information',
    body: 'We use your information to provide and personalize the marketplace, verify dealer and listing authenticity, process transactions, communicate with you, prevent fraud, and comply with legal obligations.',
  },
  {
    title: '3. Sharing of Information',
    body: 'We share information with dealers you choose to contact, service providers who help operate our platform, and law enforcement when required by law. We never sell your personal information to third parties for their marketing purposes.',
  },
  {
    title: '4. Data Security',
    body: 'We use industry-standard encryption, access controls and regular security audits to protect your data. However, no method of transmission over the internet is 100% secure.',
  },
  {
    title: '5. Your Rights',
    body: 'You may access, correct, or delete your personal information at any time through your account settings, or by contacting our support team at support@swipedeals.in.',
  },
  {
    title: '6. Cookies',
    body: 'We use cookies and similar technologies to remember your preferences, understand usage patterns and deliver relevant listings. You can control cookie preferences through your browser settings.',
  },
  {
    title: '7. Changes to This Policy',
    body: 'We may update this Privacy Policy from time to time. We will notify you of material changes via email or an in-app notice.',
  },
]

export default function Privacy() {
  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-extrabold text-text sm:text-3xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-text-secondary">Last updated: August 6, 2026</p>

        <div className="mt-8 space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="mb-2 text-base font-bold text-text">{s.title}</h2>
              <p className="text-sm leading-relaxed text-text-secondary">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
