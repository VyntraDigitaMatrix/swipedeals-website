import Breadcrumb from '../components/common/Breadcrumb'

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: 'By accessing or using SwipeDeals, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use the platform.',
  },
  {
    title: '2. Marketplace Role',
    body: 'SwipeDeals is a marketplace that connects buyers and sellers/dealers. We do not own, inspect, or guarantee any listed product unless explicitly stated (e.g. SwipeDeals Verified inspections). Transactions occur directly between buyers and dealers.',
  },
  {
    title: '3. Dealer Obligations',
    body: 'Dealers must provide accurate listing information, honor advertised pricing, and comply with all applicable consumer protection and business regulations. Fraudulent or misleading listings will result in account suspension.',
  },
  {
    title: '4. User Conduct',
    body: 'You agree not to misuse the platform, post false information, harass other users, or attempt to circumvent our verification and safety systems.',
  },
  {
    title: '5. Fees & Payments',
    body: 'Browsing and contacting dealers is free for buyers. Dealers pay subscription fees for listing and promotional tools as agreed during dealer onboarding.',
  },
  {
    title: '6. Limitation of Liability',
    body: 'SwipeDeals is not liable for disputes, damages or losses arising from transactions between buyers and dealers, to the maximum extent permitted by law.',
  },
  {
    title: '7. Termination',
    body: 'We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or pose a risk to other users.',
  },
  {
    title: '8. Governing Law',
    body: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.',
  },
]

export default function Terms() {
  return (
    <div className="container-page py-8">
      <Breadcrumb items={[{ label: 'Terms of Service' }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-extrabold text-text sm:text-3xl">Terms of Service</h1>
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
